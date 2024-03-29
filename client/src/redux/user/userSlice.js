import { createSlice } from "@reduxjs/toolkit";
const initialState={
    currentUser : null,
    error : null,
    loading :false
}
const userSlice  = createSlice({
    name:'user',
    initialState,
    reducers:{
        signinStart:(state)=>{
            state.loading = true;
        },
        signinSuccess:(state , action)=>{
            state.currentUser = action.payload
            state.loading = false;
            state.error = null;
        },
        signinFaliure:(state , action)=>    {
            state.error = action.payload;
            state.loading = false;
        },
        updateUserStart:(state)=>{
            state.loading = false;
        },
        updateUserSuccess :(state,action)=>{
            state.currentUser = action.payload,
            state.loading = false,
            state.error = null
        },
        updateUserFail:(state,action)=>{
            state.error = action.payload,            
            state.loading = false
        },
        deleteUserStart:(state)=>{
            state.loading= true
        },
        deleteUserSuccess:(state)=>{
            state.currentUser = null,
            state.loading = false,
            state.error = null
        },
        deleteUserFailure:(state , action)=>{
            state.error = action.payload,
            state.loading = false
        },
        signoutUserStart:(state)=>{
            state.loading= true
        },
        signoutUserSuccess:(state)=>{
            state.currentUser = null,
            state.loading = false,
            state.error = null
        },
        signoutUserFailure:(state , action)=>{
            state.error = action.payload,
            state.loading = false
        }

    }
})
export const{signinStart , signinSuccess , signinFaliure , updateUserFail , updateUserStart 
     ,updateUserSuccess , deleteUserFailure, 
     deleteUserSuccess , deleteUserStart,
    signoutUserFailure,signoutUserStart,signoutUserSuccess} =userSlice.actions;
export default userSlice.reducer