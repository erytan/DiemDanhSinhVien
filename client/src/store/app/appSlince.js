import { createSlice } from "@reduxjs/toolkit";
import * as action from './asyncAction'
import { create } from "../../../../models/user";


export const appSlice = createSlice({
    name: 'app',
    initialState: {
        isLoading: false,
        isShowModal: false,
        modelChildren:null
    },
    reducers: {
        showModal: (state, action) => {
            console.log(action)
            state.isShowModal = action.payload.isShowModal
            state.modelChildren = action.payload.modelChildren
        }
    }
})
export const { showModal } = appSlice.actions
export default appSlice.reducer