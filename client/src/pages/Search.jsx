import React from 'react'

const Search = () => {
  return (
    <div className='flex flex-col md:flex-row'>
        <div className='p-7 border-b-2 md:border-r-2 md:min-h-screen'>
            <form className='flex flex-col gap-8'>
                <div className='flex items-center gap-2'>
                    <label className='whitespace-nowrap' >Search Term: </label>
                    <input type='text' placeholder='Search...' id='searchTerm' className='border rounded-lg p-3 w-full'></input>
                </div>
                <div className=' flex gap-2 flex-wrap items-center'>
                    <labl>Type: </labl>
                    <div className='flex gap-2'>
                        <input type='checkbox' id='all' className='w-5'/>
                        <span>rent and sale</span>
                    </div>  
                    <div className='flex gap-2'>
                        <input type='checkbox' id='sale' className='w-5'/>
                        <span> sale</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type='checkbox' id='rent' className='w-5'/>
                        <span>rent </span>
                    </div>
                    <div className='flex gap-2'>
                        <input type='checkbox' id='offer' className='w-5'/>
                        <span>offer</span>
                    </div>
                </div>
                <div className=' flex gap-2 flex-wrap items-center'>
                    <labl>Amenities: </labl>
                    <div className='flex gap-2'>
                        <input type='checkbox' id='parking' className='w-5'/>
                        <span>Parking</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type='checkbox' id='furnished' className='w-5'/>
                        <span> Furnished</span>
                    </div>
                    
                </div>
                <div className=' flex items-center gap-2'>
                    <lable>Sort:</lable>
                    <select id='sort_order' className='border rounded-lg p-3'>
                        <option>price high to low</option>
                        <option>price  low to high</option>
                        <option>Latest</option>
                        <option>Oldest</option>

                    </select>
                </div>
                <button className='bg-slate-700 text-white p-3 rounded-lg hover:opacity-95'>Search</button>
            </form>

        </div>


        <div>
            <h1 className=' text-slate-700 text-3xl font-semibold border-b p-3 w-full'>Listing Result: </h1>
        </div>
    </div>
  )
}

export default Search