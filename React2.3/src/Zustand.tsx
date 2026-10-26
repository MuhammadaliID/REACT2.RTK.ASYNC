import { useEffect } from 'react'
import { useData } from './Store/Zustand'

function Zustand() {
  const data = useData((state) => state.data)
  const getUsers = useData((state) => state.getUsers)

  useEffect(() => {
    getUsers()
  }, [getUsers])

  return (
    <>
      <div>
        {data.map((elem) => (
          <div key={elem.id}>
            <h1>{elem.name}</h1>
            <img style={{ width: '70px', borderRadius: '100%' }} src={elem.avatar} alt="" />
          </div>
        ))}
      </div>
    </>
  )
}

export default Zustand