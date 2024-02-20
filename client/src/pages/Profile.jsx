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
  const [userListing , setUserListing] = useState([]);
  const [fileErr, setFileErr] = useState(false);
  const fileRef = useRef(null);
  const [formData, setFormData] = useState({});
  const [showListingError , setshowListingError] = useState(false)
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
  const handleShowListing = async(e)=>{
    try { 
      setshowListingError(false);
      const res = await fetch(`/api/user/listing/${currentUser._id}`);
      const data  = await res.json();
      if(data.success===false){
        setshowListingError(true);
        return;
      }
      setUserListing(data);

    } catch (error) {
      showListingError(true);
    }
  }
  const handleDeleteListing = async(listingId)=>{
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`,{
        method:'DELETE'
      })
      const data = await res.json();
      if(data.success===false){
        console.log(data.message);
        return
      }
      setUserListing((prev)=>prev.filter((listing)=>listing._id!=listingId));

    } catch (error) {
      console.log(error.message);
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
      <button className='text-green-700 w-full' onClick={handleShowListing}>Show Listing</button>
      <p className='text-red-700'> {showListingError? ' Error showing listing':''}</p>
      
        {userListing && userListing.length>0&&
        <div className='flex flex-col gap-4'> 
        <h1 className='text-center my-7 text-2xl font-semibold'> Your Listing </h1>
        {userListing.map((listing)=>(
          <div key={listing._id} className='flex border rounded-lg justify-between gap-4 items-center p-3'>
            <Link to={`/listing/${listing._id}`}>
              <img src={listing.imageUrls[0]} alt='listing covern' className='h-16 w-16 object-contain'/>
              </Link>
              <Link className='flex-1 text-slate-700 font-semibold  hover:underline truncate' to={`/listing/${listing._id}`}>
                <p >{listing.name}</p>
              </Link>
              <div className='flex flex-col items-center'>
              <button className='text-red-700 uppercase' onClick={()=>handleDeleteListing(listing._id)}>Delete</button>
              <button className='text-green-700 uppercase'>Edit</button>
              </div>
              
          </div>
        ))}
        </div>
        }
    </div>
  )
}

export default Profile