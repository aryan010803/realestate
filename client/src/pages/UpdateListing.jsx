import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useEffect, useState } from 'react'
import {app} from '../firebase';
import { useSelector } from 'react-redux';
import { useNavigate ,useParams } from 'react-router-dom';

const CreateListing = () => {
  const navigae  = useNavigate();
  const params = useParams();
  const accessToken = typeof document !== 'undefined' && document.cookie
  ? document.cookie.split('; ')
    .find(row => row.startsWith('access_token='))
    .split('=')[1]
  : null;

  const {currentUser} = useSelector(state=>state.user);
  const [file,setfile] = useState([]);
  const [form, setform] = useState({
    imageUrls: [],
    name: '',
    description: '',
    address: '',
    type: '',
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 1000,
    discountedPrice: 500, 
    offer: false,
    parking: false,
    furnished: false
  });
  const [uploading , setuploading] = useState(false);
  const[imageerror  , setimageerror] = useState(false);
  const[error , seterror] = useState(false);
  const[loading , setloadig] = useState(false);
  useEffect(()=>{
    const fetchListing  =async ()=>{
        const listingId = params.listingId
        const res   = await fetch(`/api/listing/get/${listingId}`);
        const data = await res.json();
        if(data.success===false){
            console.log(data.message);
        }
        setform(data);
    }
    fetchListing();
  },[params.listingId])
  const handleImageSubmit = (e)=>{

    if(file.length>0 &&file.length +form.imageUrls.length<7){
      setuploading(true);
      const promise = [];
      for(let i=0;i<file.length;i++){
        promise.push(storeImage(file[i]));

      }
      Promise.all(promise).then((urls)=>{
        setform({...form , imageUrls:form.imageUrls.concat(urls)
        })
        setimageerror(false);
        setuploading(false)
        
      }).catch((err)=>{
        setimageerror("Image upload failed");
        setuploading(false);
      })
    }
    else{
      setimageerror('you can only upload 6 images ')
      setuploading(false);
    }
  }
  const storeImage = async(file)=>{
    return new Promise((resolve , reject)=>{
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage , fileName)
      const uploadTask  = uploadBytesResumable(storageRef , file);
      uploadTask.on(

        "state_changed",
        (snapshot)=>{
          const progress = 
          (snapshot.bytesTransferred/snapshot.totalBytes)*100;
          console.log(progress);
        },
        (error)=>{
          reject(error)
        },
        ()=>{
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
            resolve(downloadURL);
          })
        }

      )
    })
  }
  const handleremoveimage=(index)=>{
    setform({
      ...form,
      imageUrls:form.imageUrls.filter((url,i)=>i!==index),
    });
  }
  const handleChange = (e)=>{
    if(e.target.id==='sale' || e.target.id==='rent'){
      setform({
        ...form,
        type :e.target.id
      })
    }
    if(e.target.id==='parking'|| e.target.id==='furnished' || e.target.id==='offer'){
      setform({
        ...form,
        [e.target.id]  : e.target.checked
      })
    }
    if(e.target.type==='number' || e.target.type==='text' || e.target.type==='textarea'){
      setform({
        ...form,
        [e.target.id]:e.target.value
      })
    }
 
    
  }
  const handleSubmit= async(e)=>{
    e.preventDefault();
    try {
      if(form.imageUrls.length<1) return seterror("You must have to upload atleast  1 image");
      if(+form.regularPrice< +form.discountedPrice) return seterror("discounteded price should be less than regular price");
      setloadig(true)
      seterror(false);
      const res = await fetch(`/api/listing/update/${params.listingId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          ...form,
         
          UserRef: currentUser._id,
        }),
      });
      
      const data =  await res.json()
      setloadig(false);
      if(data.success===false){
        seterror(data.message);
      }
      navigae(`/listing/${data._id}`);
      
    } catch (error) {
      setloadig(false);
      seterror(error.message);
    }
  }
  console.log(error);
  return (
  <main className='p-3 max-w-4xl mx-auto '>
  <h1 className='text-3xl font-semibold text-center my-7'>Update Listing  </h1>
  <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4'>
  <div className='flex flex-col gap-4 flex-1'>
    <input type='text' placeholder='Name' className='border p-3 rounded-lg' id='name' maxLength='62' minLength='4' required onChange={handleChange} value={form.name}/>
    <input type='text' placeholder='Description' className='border p-3 rounded-lg' id='description'  required onChange={handleChange} value={form.description}/>
    <input type='text' placeholder='Address' className='border p-3 rounded-lg' id='address' required onChange={handleChange} value={form.address} />
    
    <div className='flex  gap-6 flex-wrap'>
      <div className='flex gap-2'>
        <input type='checkbox' id='sale' className='w-5' onChange={handleChange} checked={form.type==='sale'}/>
        <span>Sell</span>
      </div>
      <div className='flex gap-2'>
        <input type='checkbox' id='rent' className='w-5' onChange={handleChange} checked={form.type==='rent'}/>
        <span>Rent</span>
      </div>
      <div className='flex gap-2'>
        <input type='checkbox' id='parking' className='w-5' onChange={handleChange} checked={form.parking}/>
        <span>Parking</span>
      </div>
      <div className='flex gap-2'>
        <input type='checkbox' id='furnished' className='w-5'onChange={handleChange} checked={form.furnished}/>
        <span>Furnished</span>
      </div>
      <div className='flex gap-2'>
        <input type='checkbox' id='offer' className='w-5' onChange={handleChange} checked={form.offer}/>
        <span>Offer</span>
      </div>
      
    </div>
    <div className='flex flex-wrap gap-6'>
      <div className='flex items-center gap-2'>
        <input className=' w-20 p-3 border-gray-300 rounded-lg'  type='number' id='bedrooms' max='10' required onChange={handleChange} value={form.bedrooms} />
        <p>Beds</p>
      </div>
      <div className='flex items-center gap-2'>
        <input className=' w-20 p-3 border-gray-300 rounded-lg'  type='number' id='bathrooms' max='10' required onChange={handleChange} value={form.bathrooms} />
        
        <p>Baths</p>
      </div>

      <div className='flex items-center gap-2'>
        <input className=' w-20 p-3 border-gray-300 rounded-lg'  type='number' id='regularPrice'  max='10000000' required onChange={handleChange} value={form.regularPrice} />
        <div className='flex flex-col items-center'>
        <p>Regular price</p>
        <span className='text-xs'>($/month)</span>
        </div>
        </div>
        {form.offer &&(

      <div className='flex items-center gap-2'>
        <input className=' w-20 p-3 border-gray-300 rounded-lg'  type='number' id='discountedPrice' min='0'  max='100000000' required onChange={handleChange} value={form.discountedPrice} />
        <div className='flex flex-col items-center'>
        <p>discounteded price</p>
        <span className='text-xs'>($/month)</span>
        </div>
      </div>
        )}
      </div>
    
    </div>
    <div className='flex flex-col flex-1 gap-4'>
    <p className='font-semibold'>Images:
    <span className=' font-normal text-gray-600 ml-2'>The first image will be cover (max 6)</span></p>
    <div className='flex gap-4'>
      <input onChange={(e)=>setfile(e.target.files)} className='p-3 border border-gray-300 rounded w-full' type='file' id='images' accept='image/*' multiple/>
      <button disabled={uploading} type='button' onClick={handleImageSubmit} className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'> {uploading?'Uploading':'Upload'}</button>
    </div>
    <button disabled={loading||uploading} className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>{loading ? 'Creating...' : 'UPDATE LISTING'}</button>
<p className='text-red-700 text-sm'>{imageerror && imageerror}</p>

{form.imageUrls.length > 0 && form.imageUrls.map((url, index) => (
<div className='flex space justify-between p-3 border items-center' key={index}>
  <img src={url} alt='listing image' className='w-20 h-20 object-contain  rounded-lg' />
  <button type='button' onClick={() => handleremoveimage(index)} className='p-2 rounded-lg  text-white bg-red-500 hover:opacity-80 '>Delete</button>
</div>
))}
{error && <p className='text-red-700 text-xs'>{error}</p>}
    </div>
  
  </form>
  </main>
  )
}

export default CreateListing