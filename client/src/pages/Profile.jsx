import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useRef } from 'react';
import { useEffect } from 'react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase.js'

const Profile = () => {
  const { currentUser } = useSelector(state => state.user);
  const [file, setfile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileErr, setFileErr] = useState(false);
  const fileRef = useRef(null);
  const [formData, setFormData] = useState({});
  console.log(filePerc);
  console.log(formData);
  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file])
  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress))
      },
      (error) => {
        setFileErr(true)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then
          ((downloadURL) => {
            setFormData({ ...formData, avatar: downloadURL })
          })
      }
    )
  }



  return (
    <div className=' p-3 max-w-lg mx-auto'>
      <h1 className=' text-3xl text-center font-semibold my-7'>Profile</h1>
      <form className='flex flex-col gap-4'>
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


        <input type='text' id='username' placeholder='username' className='border p-3 rounded-lg'></input>
        <input type='email' id='email' placeholder='email' className='border p-3 rounded-lg'></input>
        <input type='text' id='password' placeholder='password' className='border p-3 rounded-lg'></input>
        <button className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'>update</button>
      </form>
      <div className=' flex justify-between mt-5'>
        <span className='text-red-700 cursor-pointer'>Delete Account</span>
        <span className='text-red-700 cursor-pointer'>Sign-Out</span>
      </div>
    </div>
  )
}

export default Profile