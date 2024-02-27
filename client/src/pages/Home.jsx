
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import ListingItem from '../Components/ListingItem';

  const Home = () => {
    const [offer , setoffer] =useState([]);
    const [sale , setsale]= useState([]);
    const [rent , setrent] =useState([]);
    SwiperCore.use([Navigation])
    console.log(offer);
    useEffect(()=>{
      const fetchOfferListings = async  ()=>{
        try {
          const res =   await fetch('/api/listing/get?offer=true&limit=4');
          const data = await res.json();
          setoffer(data);
          
        } catch (error) {
          console.log(error);
        }
      }
      const fetchRentListing = async ()=>{
        try {
          const res =   await fetch('/api/listing/get?type=rent&limit=4');
          const data = await res.json();
          setrent(data);
          
        } catch (error) {
          console.log(error);
        }
      }
      const fetchSaleListing = async ()=>{
        try {
          const res = await fetch ('/api/listing/get?type=sale&limit=4')
          const data = await res.json();
          setsale(data);
         
        } catch (error) {
          console.log(error);
        }
      }
      fetchOfferListings();
      fetchRentListing();
      fetchSaleListing();
    },[])
    return (
      <div>
        {}
        <div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto'>
          <h1 className='text-slate-700 font-bold text-3xl sm:text-6xl '>
            Find your next <span className='text-slate-500'>perfect</span> 
            <br/>place with ease
          </h1>
          <div className='text-gray-400 text-xs sm:text-sm'>
          Your real estate search starts here. Discover the perfect place to call home.
          <br/> we have wide range of properties to choose here 
          </div>
          <Link to={'/search'} className='text-xs sm:text-sm text-blue-800 font-bold hover:underline'>Lets start now ...</Link>

        </div>
        {}
        <Swiper navigation>

        {
          offer &&offer.length>0&&(
            offer.map((listing)=>(
              <SwiperSlide key={listing._id}>
                <div  style={{background:`url(${listing.imageUrls[0]}) center no-repeat `, backgroundSize:"cover"}} className='h-[500px]' ></div>
              </SwiperSlide>
            ))
          )
        }
        </Swiper>

        {}
       <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10'>
        {
          offer && offer.length>0 &&(
           
            <div className='my-3'>
              <h2 className='text-2xl font font-semibold text-slate-600  '>Recent Offers</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?offer=true'}>Show more offers</Link>
              <div className='flex flex-wrap gap-4'> 
              {offer.map((listing)=>(
                <ListingItem listing={listing} key={listing._id}></ListingItem>
              ))}
              </div>
            </div>
            

           
            
            
          )
        }
        {
          rent && rent.length>0 &&(
           
            <div className='my-3'>
              <h2 className='text-2xl font font-semibold text-slate-600  '>Recent places for Rent</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=rent'}>Show more rent</Link>
              <div className='flex flex-wrap gap-4'> 
              {rent.map((listing)=>(
                <ListingItem listing={listing} key={listing._id}></ListingItem>
              ))}
              </div>
            </div>
            

           
            
            
          )
        }
        {
        sale && sale.length>0 &&(
           
            <div className='my-3'>
              <h2 className='text-2xl font font-semibold text-slate-600  '>Recent places for Sale</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=sale'}>Show more sale</Link>
              <div className='flex flex-wrap gap-4'> 
              {sale.map((listing)=>(
                <ListingItem listing={listing} key={listing._id}></ListingItem>
              ))}
              </div>
            </div>
            

           
            
            
          )
        }
       </div>
      </div>
    )
  }

  export default Home