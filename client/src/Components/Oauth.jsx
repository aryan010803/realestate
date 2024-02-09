import React from 'react'
import {GoogleAuthProvider  , getAuth, signInWithPopup}  from 'firebase/auth';
import  { useDispatch } from 'react-redux'
import { signinSuccess } from '../redux/user/userSlice';
import { app } from '../firebase';
import { useNavigate } from 'react-router-dom';
export default function Oauth  (){
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleGoogleClick= async()=>{
        try {
            const provider  = new GoogleAuthProvider()
            const auth = getAuth(app)
            const result  = await signInWithPopup(auth , provider);
            const res = await fetch('/api/auth/google',{
                method:'POST',
                headers:{
                    'Content-Type': 'application/json',
                },
                body:JSON.stringify({name:result.user.displayName ,email:result.user.email ,photo:result.user.photoURL}),
            })
            console.log(result);
            const data = await res.json()
            dispatch(signinSuccess(data))
            navigate('/');
        } catch (error) {
            console.log("couldnt connect" ,error);
        }
    }
  return (
    <button onClick={handleGoogleClick} type='button'className='bg-red-700 p-3 rounded-lg color text-white hover:opacity-95'>Continue with google</button>
  )
  
}

