import React, { useState } from 'react'
import { Link , useNavigate } from 'react-router-dom'
import Oauth from '../Components/Oauth';


const SignUp = () => {
  const navigate = useNavigate();
  const[formData , setFormData] = useState({})
  const[error , seterror] = useState(null);
  const[loading , setloading] = useState(false);
  const handleChange = (e)=>{

    setFormData({
      ...formData,
      [e.target.id]:e.target.value

    });
  }
  const handleSubmit =async(e)=>{
    e.preventDefault();
    try{

      setloading(true);
      const res = await fetch('/api/auth/signup',{
        method:'POST',
        headers:{
          'Content-Type': 'application/json',
  
        },
        body:JSON.stringify(formData),
      });
      const data = await res.json();
      if(data.success===false){
        seterror(data.message);
        setloading(false);
        return
      }

      setloading(false);
      seterror(null);
      navigate('/signin');
      console.log(data);
    }
    catch(err){
     setloading(false);
     seterror(err.message);
    }
    };
  return (
    <div className='p-3 max-w-lg mx-auto'>

    <h1 className='text-3xl text-center font-semibold my-7' >Sign up</h1>
    <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
      <input type='text' placeholder='username' id='username' className='border p-3 rounded-lg' onChange={handleChange} />
      <input type='text' placeholder='email' id='email' className='border p-3 rounded-lg' onChange={handleChange} />
      <input type='text' placeholder='password' id='password' className='border p-3 rounded-lg' onChange={handleChange} />
      <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>{loading?'Loading':'Sign-up'}</button>
      <Oauth/>
    </form>
    <div className='flex ga-2 mt-5'>
      <p>Have an account?</p>
      <Link to={'/signin'}>
      <span className='text-blue-700'>Sign-in</span>
      </Link>
      
      
    </div>
    {error &&<p className='text-red-500 mt-5'>{error}</p>}




  </div>
  )
}

export default SignUp