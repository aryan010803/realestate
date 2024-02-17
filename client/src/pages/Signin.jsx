import React, { useState } from 'react'
import { Link , useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { signinStart , signinSuccess ,signinFaliure } from '../redux/user/userSlice';
import Oauth from '../Components/Oauth';

const Signin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const[formData , setFormData] = useState({})
 const {loading , error} = useSelector((state)=>state.user);
  const handleChange = (e)=>{

    setFormData({
      ...formData,
      [e.target.id]:e.target.value

    });
  }
  const handleSubmit =async(e)=>{
    e.preventDefault();
    try{
      dispatch(signinStart())
      const res = await fetch('/api/auth/signin',{
        method:'POST',
        headers:{
          'Content-Type': 'application/json',
  
        },
        body:JSON.stringify(formData),
      });
      const data = await res.json();
      if(data.success===false){
       dispatch(signinFaliure(data.message))
        return;
      }

      dispatch(signinSuccess(data));
      navigate('/');
      console.log(data);
    }
    catch(err){
     dispatch(signinFaliure(err.message))
    }
    };
  return (
      <div className='p-3 max-w-lg mx-auto'>
  
      <h1 className='text-3xl text-center font-semibold my-7' >Sign in</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input type='text' placeholder='email' id='email' className='border p-3 rounded-lg' onChange={handleChange} />
        <input type='text' placeholder='password' id='password' className='border p-3 rounded-lg' onChange={handleChange} />
        <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>{loading?'Loading':'Sign-in'}</button>
        <Oauth/>
      </form>
      <div className='flex ga-2 mt-5'>
        <p>Don't Have an account ?</p>
        <Link to={'/signup'}>
        <span className='text-blue-700 mx-2'>Sign-up</span>
        </Link>
        
        
      </div>
      {error &&<p className='text-red-500 mt-5'>{error}</p>}
  
  
  
  
    </div>
  )
    }


export default Signin