import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

export type User = {
    id?: number
    userKey?: string
    name?: string
    avatar?: string
    phone?: string
    status?: boolean
}

export const API = 'https://6a56fbf4b17de7bebbdeaff0.mockapi.io/Zustand'

export const getUsers = createAsyncThunk('users/getUsers', async () => {
    const { data } = await axios.get<User[]>(API)
    return data
})

export const addUser = createAsyncThunk('users/addUser', async (user: User) => {
    const { data } = await axios.post<User>(API, user)
    return data
})

export const editUser = createAsyncThunk('users/editUser', async (user: User) => {
    const { data } = await axios.put<User>(`${API}/${user.id}`, user)
    return data
})

export const deleteUser = createAsyncThunk('users/deleteUser', async (id: number) => {
    await axios.delete(`${API}/${id}`)
    return id
})

const initialState: { data: User[]; loading: boolean } = {
    data: [],
    loading: false
}

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getUsers.pending, (state) => {
                state.loading = true
            })
            .addCase(getUsers.fulfilled, (state, action) => {
                state.data = action.payload
                state.loading = false
            })
            .addCase(getUsers.rejected, (state) => {
                state.loading = false
            })
            .addCase(addUser.fulfilled, (state, action) => {
                state.data = [...state.data, action.payload]
            })
            .addCase(editUser.fulfilled, (state, action) => {
                state.data = state.data.map((elem) =>
                    elem.id === action.payload.id ? action.payload : elem
                )
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.data = state.data.filter((elem) => elem.id !== action.payload)
            })
    }
})

export default usersSlice.reducer