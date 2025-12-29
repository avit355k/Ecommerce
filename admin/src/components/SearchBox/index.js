import React from 'react'
import { CiSearch } from "react-icons/ci";

const SearchBox = () => {
  return (
    <div className='searchBox position-relative d-flex align-items-center'>
      <CiSearch style={{ marginRight: '0.5rem' }} />
      <input
        type='text'
        placeholder='Search for products'
        aria-label='Search input'
      />
    </div>
  )
}

export default SearchBox