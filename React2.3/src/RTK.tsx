import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { getUsers, addUser, editUser, deleteUser } from './Store/RTX'
import { useData } from './Store/Zustand'

type UserForm = {
  name: string
  avatar: string
  phone: string
  status: string
}

function RTK() {
  const dispatch = useDispatch<any>()
  const { data, loading } = useSelector((state: any) => state.users)

  const zustandData = useData((state) => state.data)
  const getZustandUsers = useData((state) => state.getUsers)
  const addUsers = useData((state) => state.addUsers)
  const editUsers = useData((state) => state.editUsers)
  const deleteUsers = useData((state) => state.deleteUsers)

  const [open, setOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)

  const { register, handleSubmit, reset } = useForm<UserForm>()

  useEffect(() => {
    dispatch(getUsers())
    getZustandUsers()
  }, [dispatch, getZustandUsers])

  async function handleAdd(user: UserForm) {
    try {
      const userKey = Date.now().toString()
      const payload = {
        userKey,
        name: user.name,
        avatar: user.avatar || 'https://via.placeholder.com/150',
        phone: user.phone,
        status: user.status === 'true'
      }

      await addUsers({
        userKey,
        name: user.name,
        avatar: payload.avatar,
        phone: user.phone,
        status: payload.status
      })

      await dispatch(addUser(payload)).unwrap()
      reset()
      setOpen(false)
    } catch (error) {
      console.log(error)
    }
  }

  async function handleEdit(user: UserForm) {
    try {
      if (!selectedUser) return

      const zustandUser = zustandData.find(
        (elem) => elem.userKey === selectedUser.userKey
      )

      if (zustandUser) {
        await editUsers({
          ...zustandUser,
          name: user.name,
          avatar: user.avatar || zustandUser.avatar,
          phone: user.phone,
          status: user.status === 'true'
        })
      }

      await dispatch(
        editUser({
          ...selectedUser,
          name: user.name,
          avatar: user.avatar || selectedUser.avatar,
          phone: user.phone,
          status: user.status === 'true'
        })
      ).unwrap()

      reset()
      setOpen(false)
      setSelectedUser(null)
    } catch (error) {     
      console.log(error)
    }
  }

  function openEdit(elem: any) {
    setSelectedUser(elem)

    const zustandUser = zustandData.find(
      (user) => user.userKey === elem.userKey
    )

    reset({
      name: zustandUser?.name || '',
      avatar: zustandUser?.avatar || '',
      phone: elem.phone || '',
      status: elem.status ? 'true' : 'false'
    })

    setOpen(true)
  }

  async function allDelete(elem: any) {
    try {
      const zustandUser = zustandData.find(
        (user) => user.userKey === elem.userKey
      )

      if (zustandUser && zustandUser.id) {
        await deleteUsers(zustandUser.id)
      }

      await dispatch(deleteUser(elem.id)).unwrap()
    } catch (error) {
      console.log(error)
    }
  }

  function closeForm() {
    setOpen(false)
    setSelectedUser(null)
    reset()
  }

  if (loading) {
    return <h1>LOADING...</h1>
  }

  return (
    <>
      <button
        onClick={() => {
          setSelectedUser(null)
          reset({
            name: '',
            avatar: '',
            phone: '',
            status: 'true'
          })
          setOpen(true)
        }}
      >
        Add User
      </button>

      {data.map((elem: any) => {
        const zustandUser = zustandData.find(
          (user) => user.userKey && user.userKey === elem.userKey
        )

        return (
          <div key={elem.id}>
            <h2>{zustandUser ? zustandUser.name : elem.name || 'Имя не найдено'}</h2>

            {(zustandUser?.avatar || elem.avatar) && (
              <img
                style={{ width: '70px', borderRadius: '100%' }}
                src={zustandUser?.avatar || elem.avatar}
                alt=""
              />
            )}

            <h2>{elem.status ? 'Active' : 'Inactive'}</h2>
            <h2>{elem.phone || 'No phone'}</h2>

            <button type="button" onClick={() => openEdit(elem)}>
              Edit
            </button>
            <button type="button" onClick={() => allDelete(elem)}>
              Delete
            </button>
          </div>
        )
      })}

      {open && (
        <dialog open>
          <h2>{selectedUser ? 'Edit User' : 'Add User'}</h2>

          <form onSubmit={handleSubmit(selectedUser ? handleEdit : handleAdd)}>
            <input placeholder="Name" {...register('name', { required: true })} />
            <input placeholder="Avatar URL" {...register('avatar')} />
            <input placeholder="Phone" {...register('phone', { required: true })} />

            <select {...register('status')}>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>

            <button type="submit">{selectedUser ? 'Save' : 'Add'}</button>
            <button type="button" onClick={closeForm}>Cancel</button>
          </form>
        </dialog>
      )}
    </>
  )
}

export default RTK