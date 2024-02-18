  import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
  import React, { useState } from 'react'
  import {app} from '../firebase';

  const CreateListing = () => {
    const [file,setfile] = useState([]);
    const[form , setform] = useState({
      imageUrls:[]
    })
    const [uploading , setuploading] = useState(false);
    const[imageerror  , setimageerror] = useState(false);
    console.log(form);
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
    return (
    <main className='p-3 max-w-4xl mx-auto '>
    <h1 className='text-3xl font-semibold text-center my-7'>Create a Listing </h1>
    <form className='flex flex-col sm:flex-row gap-4'>
    <div className='flex flex-col gap-4 flex-1'>
      <input type='text' placeholder='Name' className='border p-3 rounded-lg' id='name' maxLength='62' minLength='10' required/>
      <input type='text' placeholder='Description' className='border p-3 rounded-lg' id='description'  required/>
      <input type='text' placeholder='Address' className='border p-3 rounded-lg' id='address' required/>
      
      <div className='flex  gap-6 flex-wrap'>
        <div className='flex gap-2'>
          <input type='checkbox' id='sale' className='w-5'/>
          <span>Sell</span>
        </div>
        <div className='flex gap-2'>
          <input type='checkbox' id='rent' className='w-5'/>
          <span>Rent</span>
        </div>
        <div className='flex gap-2'>
          <input type='checkbox' id='parking' className='w-5'/>
          <span>Parking</span>
        </div>
        <div className='flex gap-2'>
          <input type='checkbox' id='furnished' className='w-5'/>
          <span>Furnished</span>
        </div>
        <div className='flex gap-2'>
          <input type='checkbox' id='offer' className='w-5'/>
          <span>Offer</span>
        </div>
        
      </div>
      <div className='flex flex-wrap gap-6'>
        <div className='flex items-center gap-2'>
          <input className=' w-20 p-3 border-gray-300 rounded-lg'  type='number' id='bedrooms' max='10' required />
          <p>Beds</p>
        </div>
        <div className='flex items-center gap-2'>
          <input className=' w-20 p-3 border-gray-300 rounded-lg'  type='number' id='bathrooms' max='10' required />
          
          <p>Baths</p>
        </div>

        <div className='flex items-center gap-2'>
          <input className=' w-20 p-3 border-gray-300 rounded-lg'  type='number' id='regularPrice' max='10' required />
          <div className='flex flex-col items-center'>
          <p>Regular price</p>
          <span className='text-xs'>($/month)</span>
          </div>
          </div>
        <div className='flex items-center gap-2'>
          <input className=' w-20 p-3 border-gray-300 rounded-lg' min='1' type='number' id='discountPrice' max='10' required />
          <div className='flex flex-col items-center'>
          <p>Discounted price</p>
          <span className='text-xs'>($/month)</span>
          </div>
        </div>
        </div>
      
      </div>
      <div className='flex flex-col flex-1 gap-4'>
      <p className='font-semibold'>Images:
      <span className=' font-normal text-gray-600 ml-2'>The first image will be cover (max 6)</span></p>
      <div className='flex gap-4'>
        <input onChange={(e)=>setfile(e.target.files)} className='p-3 border border-gray-300 rounded w-full' type='file' id='images' accept='image/*' multiple/>
        <button disabled={uploading} type='button' onClick={handleImageSubmit} className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'> {uploading?'Uploading':'Upload'}</button>
      </div>
    <button className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>Create Listing</button>
    <p className='text-red-700 text-sm'>{imageerror&&imageerror}</p>
    {
      form.imageUrls.length>0 && form.imageUrls.map((url,index)=>(
        <div className='flex space justify-between p-3 border items-center'>
        <img key={index} src={url} alt='listing image' className='w-20 h-20 object-contain  rounded-lg' />
        <button  type='button' onClick={()=>handleremoveimage(index)} className=' p-2 rounded-lg  text-white bg-red-500 hover:opacity-80 '>Delete</button>
        </div>
      ))
    }
      </div>
    
    </form>
    </main>
    )
  }

  export default CreateListing