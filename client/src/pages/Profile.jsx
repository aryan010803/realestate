import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useRef, useEffect } from 'react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase.js';
import { updateUserStart, updateUserFail, updateUserSuccess, deleteUserFailure, deleteUserStart, deleteUserSuccess, signoutUserStart, signoutUserFailure, signoutUserSuccess } from '../redux/user/userSlice.js';
import { useDispatch } from 'react-redux';
import { Link , useNavigate } from 'react-router-dom'

const Profile = () => {
  const { currentUser ,loading  ,error} = useSelector(state => state.user);
  const [file, setfile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileErr, setFileErr] = useState(false);
  const fileRef = useRef(null);
  const [formData, setFormData] = useState({});
  const[updatesuccess , setUpdateDuccess] = useState(false)
  const dispatch = useDispatch();
  const accessToken = typeof document !== 'undefined' && document.cookie
  ? document.cookie.split('; ')
    .find(row => row.startsWith('access_token='))
    .split('=')[1]
  : null;


  console.log(filePerc);
  console.log(formData);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileErr(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });
        });
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(updateUserStart());

      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success === false) {
        dispatch(updateUserFail(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateDuccess(true);
    } catch (error) {
      dispatch(updateUserFail(error.message));
      console.log(error);
    }
  };
  const handleDelete=async(e)=>{
    try {
      dispatch(deleteUserStart());
      const res = await fetch( `/api/user/delete/${currentUser._id}`,{
        method:'DELETE'
      });
      const data = await res.json();
      if(data.success===false){
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
      
      
    } catch (error) {
      useDispatch(deleteUserFailure(error.message))
    }
  }
  const handleSignout = async ()=>{
    try {
      dispatch(signoutUserStart());
      const res = await fetch('/api/auth/signout');
      const data  = await res.json();
      if(data.success ===false){
        dispatch(signoutUserFailure(data.message));
        console.log(data.message);
        return ;
      }
      dispatch(signoutUserSuccess(data));
    } catch (error) {
        dispatch(signoutUserFailure(error.message));
        console.log(error);
    }
  }

  return (
    <div className=' p-3 max-w-lg mx-auto'>
      <h1 className=' text-3xl text-center font-semibold my-7'>Profile</h1>
      <form  onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input onChange={(e) => setfile(e.target.files[0])} type='file' ref={fileRef} hidden accept='image/*'></input>
        <img onClick={() => fileRef.current.click()} className=' rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2' src={ formData.avatar ||currentUser.avatar}></img>

        <p className=' text-sm self-center'>
          {fileErr ? (
            <span className='text-red-700'>Error Image Upload</span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className='green-700'>{`uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className='text-green-700'>Image successfully uploaded</span>
          ) : (
            ""
          )}
        </p>


        <input type='text' id='username' placeholder='username' defaultValue={currentUser.username} className='border p-3 rounded-lg' onChange={handleChange}></input>
        <input type='email' id='email' placeholder='email' defaultValue={currentUser.email} className='border p-3 rounded-lg' onChange={handleChange}></input>
        <input type='password' id='password' placeholder='password' className='border p-3 rounded-lg' onChange={handleChange}></input>
        <button className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'>{loading?'Loading':'Update'}</button>
        <Link className='bg-green-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80 text-center' to={'/create-listing'}>Create Listing</Link>
      </form>
      <div className=' flex justify-between mt-5'>
        <span className='text-red-700 cursor-pointer' onClick={handleDelete}>Delete Account</span>
        <span className='text-red-700 cursor-pointer'onClick={handleSignout}>Sign-Out</span>
      </div>
      <p className='text-red-500'>{error?error:''}</p>
      <p className='text-green-500'>{updatesuccess?'User updated successfully':''}</p>
    </div>
  )
}

export default Profile