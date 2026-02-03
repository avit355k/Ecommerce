import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer>
      <div className='container'>
        <h4 className="text-center mb-4">
          Our Unique <span style={{ fontWeight: 'bold', color: '#a3a3a3' }}>Offerings</span>
        </h4>
        <div className='topInfo row'>
          <div className='col d-flex align-items-center'>
            <span> <img src='/Footer/free_alterations.png' /></span>
            <span className='ml-2'>Free Alterations</span>
          </div>
          <div className='col d-flex align-items-center'>
            <span> <img src='/Footer/exchange_return.png' /></span>
            <span className='ml-2'>Easy Exchange & Return</span>
          </div>
          <div className='col d-flex align-items-center'>
            <span> <img src='/Footer/truck.png' /></span>
            <span className='ml-2'>Express Delivery</span>
          </div>
          <div className='col d-flex align-items-center'>
            <span> <img src='/Footer/white_glove.png' /></span>
            <span className='ml-2'>Personalized Engraving</span>
          </div>
          <div className='col d-flex align-items-center'>
            <span> <img src='/Footer/stylishadvace.png' /></span>
            <span className='ml-2'>Curated Styling Advance</span>
          </div>
          <div className='col d-flex align-items-center'>
            <span> <img src='/Footer/CLICK.png' /></span>
            <span className='ml-2'>Click & Collect</span>
          </div>
        </div>

        <div className='row mt-5 linkWrap'>
          <div className='col'>
            <h5>FRUIT & VEGETABLES</h5>
            <ul>
              <li> <Link to="#">Fresh Vegetables</Link> </li >
              <li> <Link to="#">Fresh Vegetables</Link> </li >
              <li> <Link to="#">Fresh Vegetables</Link> </li >
              <li> <Link to="#">Fresh Vegetables</Link> </li >
              <li> <Link to="#">Fresh Vegetables</Link> </li >
              <li> <Link to="#">Fresh Vegetables</Link> </li >
              <li> <Link to="#">Fresh Vegetables</Link> </li >
            </ul>
          </div>
          <div className='col'>
            <h5>FRUIT & VEGETABLES</h5>
            <ul>
              <li> <Link to="#">Fresh Vegetables</Link> </li >
              <li> <Link to="#">Fresh Vegetables</Link> </li >
              <li> <Link to="#">Fresh Vegetables</Link> </li >
              <li> <Link to="#">Fresh Vegetables</Link> </li >
              <li> <Link to="#">Fresh Vegetables</Link> </li >
              <li> <Link to="#">Fresh Vegetables</Link> </li >
              <li> <Link to="#">Fresh Vegetables</Link> </li >
            </ul>
          </div>
          <div className='col'>
            <ul>
              <h5>FRUIT & VEGETABLES</h5>
              <li> <Link to="#">Fresh Vegetables</Link> </li >
              <li> <Link to="#">Fresh Vegetables</Link> </li >
              <li> <Link to="#">Fresh Vegetables</Link> </li >
              <li> <Link to="#">Fresh Vegetables</Link> </li >
              <li> <Link to="#">Fresh Vegetables</Link> </li >
              <li> <Link to="#">Fresh Vegetables</Link> </li >
              <li> <Link to="#">Fresh Vegetables</Link> </li >
            </ul>
          </div>
          <div className='col'>
            <ul>
              <h5>FRUIT & VEGETABLES</h5>
              <li> <Link to="#">Fresh Vegetables</Link> </li >
              <li> <Link to="#">Fresh Vegetables</Link> </li >
              <li> <Link to="#">Fresh Vegetables</Link> </li >
              <li> <Link to="#">Fresh Vegetables</Link> </li >
              <li> <Link to="#">Fresh Vegetables</Link> </li >
              <li> <Link to="#">Fresh Vegetables</Link> </li >
              <li> <Link to="#">Fresh Vegetables</Link> </li >
            </ul>
          </div>
          <div className='col'>
            <ul>
              <h5>FRUIT & VEGETABLES</h5>
              <li> <Link to="#">Fresh Vegetables</Link> </li >
              <li> <Link to="#">Fresh Vegetables</Link> </li >
              <li> <Link to="#">Fresh Vegetables</Link> </li >
              <li> <Link to="#">Fresh Vegetables</Link> </li >
              <li> <Link to="#">Fresh Vegetables</Link> </li >
              <li> <Link to="#">Fresh Vegetables</Link> </li >
              <li> <Link to="#">Fresh Vegetables</Link> </li >
            </ul>
          </div>
        </div>

        <div className='copywright mt3 pt-3 pb-3 d-flex'>
          <p className='mb-0'>© Click&Collect. 2025. All Rights Reserved.</p>
          <span className='mb-0 ml-auto'><img src='/Footer/copywright.svg' /></span>
        </div>
      </div>
    </footer>
  )
}

export default Footer