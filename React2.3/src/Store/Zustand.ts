import { create } from 'zustand'
import axios from 'axios'

export const API = 'https://6a56fbf4b17de7bebbdeaff0.mockapi.io/PEOPLE'



export const useData = create<{
  data: []
  loading: boolean
}>((set) => ({
  data: [],
  loading: false,

  getUsers: async () => {
    set({ loading: true })
    const { data } = await axios.get(API)
    set({ data, loading: false })
  },

  addUsers: async (user) => {
    const { data } = await axios.post(API, user)
    set((state) => ({ data: [...state.data, data] }))
    return data
  },

  editUsers: async (user) => {
    const { data } = await axios.put(`${API}/${user.id}`, user)
    set((state) => ({
      data: state.data.map((elem) => (elem.id === data.id ? data : elem))
    }))
    return data
  },

  deleteUsers: async (id) => {
    await axios.delete(`${API}/${id}`)
    set((state) => ({
      data: state.data.filter((elem) => elem.id !== id)
    }))
  }
}))