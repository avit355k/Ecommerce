import React from 'react'
import {Link} from 'react-router-dom'

const Footer = () => {
    return (
        <footer>
            <div className='container'>
                <h4 className="text-center mb-4">
                    Our Unique <span style={{fontWeight: 'bold', color: '#a3a3a3'}}>Offerings</span>
                </h4>
                <div className='topInfo row'>
                    <div className='col d-flex align-items-center'>
                        <span><img src='/Footer/free_alterations.png' alt="Free Alterations"/></span>
                        <span className='ml-2'>Free Alterations</span>
                    </div>
                    <div className='col d-flex align-items-center'>
                        <span><img src='/Footer/exchange_return.png' alt="Easy Exchange and Return"/></span>
                        <span className='ml-2'>Easy Exchange & Return</span>
                    </div>
                    <div className='col d-flex align-items-center'>
                        <span><img src='/Footer/truck.png' alt="Express Delivery"/></span>
                        <span className='ml-2'>Express Delivery</span>
                    </div>
                    <div className='col d-flex align-items-center'>
                        <span><img src='/Footer/white_glove.png' alt="Personalized Engraving"/></span>
                        <span className='ml-2'>Personalized Engraving</span>
                    </div>
                    <div className='col d-flex align-items-center'>
                        <span> <img src='/Footer/stylishadvace.png' alt='Curated Styling '/></span>
                        <span className='ml-2'>Curated Styling Advance</span>
                    </div>
                    <div className='col d-flex align-items-center'>
                        <span><img src='/Footer/CLICK.png' alt="Click & Collect"/></span>
                        <span className='ml-2'>Click & Collect</span>
                    </div>
                </div>

                <div className='row mt-5 linkWrap'>
                    <div className='col'>
                        <h5>ABOUT</h5>
                        <ul>
                            <li><Link to="#">Contact Us</Link></li>
                            <li><Link to="#">About Us</Link></li>
                            <li><Link to="#">Press Release</Link></li>
                            <li><Link to="#">Store Locator</Link></li>
                            <li><Link to="#">Careers</Link></li>
                        </ul>
                    </div>
                    <div className='col'>
                        <h5>TOP CATEGORIES</h5>
                        <ul>
                            <li><Link to="/category/fashion">Fashion</Link></li>
                            <li><Link to="/category/electronics">Electronics</Link></li>
                            <li><Link to="/category/grocery">Grocery</Link></li>
                            <li><Link to="/category/smartphones">Smartphone</Link></li>
                            <li><Link to="/category/tvs-and-appliances">Home Appliances</Link></li>
                            <li><Link to="/category/beauty-and-health">Beauty & Luxury</Link></li>
                        </ul>
                    </div>
                    <div className='col'>
                        <ul>
                            <h5>CUSTOMER</h5>
                            <li><Link to="#">Facebook</Link></li>
                            <li><Link to="#">Instagram</Link></li>
                            <li><Link to="#">Gift Voucher</Link></li>
                            <li><Link to="#">FAQs</Link></li>
                        </ul>
                    </div>
                    <div className='col'>
                        <ul>
                            <h5>HELP</h5>
                            <li><Link to="#">Payment</Link></li>
                            <li><Link to="#">Shipping</Link></li>
                            <li><Link to="#">Cancellation</Link></li>
                            <li><Link to="#">Returns</Link></li>
                        </ul>
                    </div>
                    <div className='col'>
                        <ul>
                            <h5>CONSUMER POLICY</h5>
                            <li><Link to="#">Cancellation & Returns</Link></li>
                            <li><Link to="#">Terms & Use</Link></li>
                            <li><Link to="#">Security</Link></li>
                            <li><Link to="#">Privacy</Link></li>
                            <li><Link to="#">EPR Compliance</Link></li>
                            <li><Link to="#">Grievance Redress</Link></li>
                            <li><Link to="#">Connect App</Link></li>
                        </ul>
                    </div>
                </div>

                <div className='copywright mt3 pt-3 pb-3 d-flex'>
                    <p className='mb-0'>© Click&Collect. 2025. All Rights Reserved.</p>
                    <span className='mb-0 ml-auto'><img src='/Footer/copywright.svg' alt="Copyright logo"/></span>
                </div>
            </div>
        </footer>
    )
}

export default Footer