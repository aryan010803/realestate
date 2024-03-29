import React from 'react'
import { useState,useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import ListingItem from '../Components/ListingItem';


const Search = () => {
    const[loading , setloading] = useState(false);
    const [listing , setlisting] = useState([]);
    const [showmore , setshowmore] = useState(false);
   
    const [sidebardata , setsidebardata] = useState({
        searchTerm : '',
        type:'all',
        parking:false,
        furnished:false,
        offer:false,
        sort:'created_at',
        order:'desc',
    });
    
    const navigate = useNavigate();
    
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        const typeFromUrl = urlParams.get('type');
        const parkingFromUrl = urlParams.get('parking');
        const furnishedFromUrl = urlParams.get('furnished');
        const offerFromUrl = urlParams.get('offer');
        const sortFromUrl = urlParams.get('sort');
        const orderFromUrl = urlParams.get('order');
    
        if (
            searchTermFromUrl ||
            typeFromUrl ||
            parkingFromUrl ||
            furnishedFromUrl ||
            offerFromUrl ||
            sortFromUrl ||
            orderFromUrl
        ) {
            setsidebardata({
                searchTerm: searchTermFromUrl || '',
                type: typeFromUrl || 'all',
                parking: parkingFromUrl === 'true' ? true : false,
                furnished: furnishedFromUrl === 'true' ? true : false,
                offer: offerFromUrl === 'true' ? true : false,
                sort: sortFromUrl || 'created_at',
                order: orderFromUrl || 'desc',
            });
        }
        const fetchListings = async () => {
            setloading(true);
            setshowmore(false);
            const searchQuery = urlParams.toString();
            const res = await fetch(`/api/listing/get?${searchQuery}`);
            const data = await res.json();
            if (data.length > 8) {
              setshowmore(true);
            } else {
              setshowmore(false);
            }
            setlisting(data);
            setloading(false);
          };
      
          fetchListings();
        }, [location.search]);
   

    const handleChange = (e)=>{
        if(e.target.id==='all'||e.target.id==='rent'||e.target.id==='sale'){
            setsidebardata({...sidebardata,type:e.target.id})
        }
        if(e.target.id==='searchTerm'){
            setsidebardata({...sidebardata , searchTerm:e.target.value})
        }
        if(e.target.id==='parking'||e.target.id==='furnished' || e.target.id==='offer'){
            setsidebardata({...sidebardata,[e.target.id]:e.target.checked|| e.target.checked==='true'?true:false})
        }
        if(e.target.id==='sort_order'){
            const sort = e.target.value.split('_')[0]|| 'created_at';
            const order=  e.target.value.split('_')[1]|| 'desc';
            setsidebardata({...sidebardata , sort , order})
        }
    }
    const handleSubmit = (e)=>{
        e.preventDefault();
        const urlParams = new URLSearchParams();
        urlParams.set('searchTerm' , sidebardata.searchTerm);
        urlParams.set('type',sidebardata.type);
        urlParams.set('offer',sidebardata.offer);
        urlParams.set('parking', sidebardata.parking);
        urlParams.set('furnished',sidebardata.furnished);
        urlParams.set('sort',sidebardata.sort);
        urlParams.set('order',sidebardata.order);
        const searchQuery  =urlParams.toString();
        navigate(`/search?${searchQuery}`);

    }
    const onShowMore=async()=>{
        const number = listing.length;
        const startIndex = number;
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('startIndex',startIndex);
        const searchQuery = urlParams.toString();
        const res = await fetch(`/api/listing/get?${searchQuery}`);
        const data = await res.json();
        if(data.length<9){
            setshowmore(false);
        }
        setlisting([...listing, ...data])
    }
  return (
    <div className='flex flex-col md:flex-row'>
        <div className='p-7 border-b-2 md:border-r-2 md:min-h-screen'>
            <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
                <div className='flex items-center gap-2'>
                    <label className='whitespace-nowrap' >Search Term: </label>
                    <input type='text' placeholder='Search...' id='searchTerm' value={sidebardata.searchTerm} onChange={handleChange} className='border rounded-lg p-3 w-full'></input>
                </div>
                <div className=' flex gap-2 flex-wrap items-center '>
                    <label className='font-semibold'>Type: </label>
                    <div className='flex gap-2'>
                        <input type='checkbox' id='all' className='w-5' onChange={handleChange}
                            checked={sidebardata.type==='all'}
                        />
                        <span>rent and sale</span>
                    </div>  
                    <div className='flex gap-2'>
                        <input type='checkbox' id='sale' className='w-5'  onChange={handleChange} checked={sidebardata.type==='sale'} />
                        <span> sale</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type='checkbox' id='rent' className='w-5' onChange={handleChange} checked={sidebardata.type==='rent'}/>
                        <span>rent </span>
                    </div>
                    <div className='flex gap-2'>
                        <input type='checkbox' id='offer' className='w-5' onChange={handleChange} checked={sidebardata.offer}/>
                        <span>offer</span>
                    </div>
                </div>
                <div className=' flex gap-2 flex-wrap items-center  '>
                    <label className='font-semibold'>Amenities: </label>
                    <div className='flex gap-2'>
                        <input type='checkbox' id='parking' className='w-5' onChange={handleChange} checked={sidebardata.parking}/>
                        <span>Parking</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type='checkbox' id='furnished' className='w-5' onChange={handleChange} checked={sidebardata.furnished}/>
                        <span> Furnished</span>
                    </div>
                    
                </div>
                <div className=' flex items-center gap-2 '>
                    <label className='font-semibold' >Sort:</label>
                    <select onChange={handleChange} defaultValue={'created_at_desc'} id='sort_order' className='border rounded-lg p-3'>
                        <option value='regularPrice_desc'> price high to low</option>
                        <option value='regularPrice_asc'>price  low to high</option>
                        <option value='createdAt_desc'>Latest</option>
                        <option value='createdAt_asc'>Oldest</option>

                    </select>
                </div>
                <button className='bg-slate-700 text-white p-3 rounded-lg hover:opacity-95'>Search</button>
            </form>

        </div>


        <div className='p=3 flex-1'>
            <h1 className=' text-slate-700 text-3xl font-semibold border-b p-3 w-full'>Listing Result: </h1>
            <div className='p-7 flex flex-wrap'>{!loading && listing.length===0 &&(
                <p className='text-xl text-slate-700'>No listing found </p>
            )}
            {loading &&(
                <p className='text-xl text-slate-700 text-center'>Loading....</p>
            )}
            {!loading && listing &&listing.map((listing)=>(
                <ListingItem key={listing._id} listing={listing}/>
            ))}
            {showmore &&(
                <button className=' text-green-700 hover:underline p-7' onClick={onShowMore}>Show more</button>
            )}
            </div>  

        </div>
    </div>
  )
}

export default Search