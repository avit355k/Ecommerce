import React from 'react'
import { Link } from 'react-router-dom'
import QuantityBox from '../../components/QuantityBox'
import { IoMdClose } from "react-icons/io";
import Button from '@mui/material/Button';
import { IoShieldCheckmarkOutline } from "react-icons/io5";

const Cart = () => {
    return (
        <section className='section cartPage'>
            <div className='container'>
                <h2 className='hd'>My Cart</h2>
                <p>There are <b className='text-red'>3</b> products in your cart</p>

                <div className='row'>

                    <div className='col-md-8'>
                        <table className='table'>
                            <thead>
                                <tr>
                                    <th style={{ width: "35%" }}>Product</th>
                                    <th style={{ width: "20%" }}>Unit Price</th>
                                    <th style={{ width: "20%" }}>Quantity</th>
                                    <th style={{ width: "15%" }}>Subtotal</th>
                                    <th style={{ width: "10%" }}>Remove</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td width="45%">
                                        <Link to="/product/1">
                                            <div className='d-flex align-items-center cartItemWrapper'>
                                                <div className='imgWrapper'>
                                                    <img
                                                        src='https://api.spicezgold.com/download/file_1734528708304_apple-iphone-13-128-gb-midnight-black-digital-o491997699-p590798548-0-202208221207.webp'
                                                        className='w-100'
                                                        alt="Apple iPhone 15"
                                                    />
                                                </div>
                                                <div className='info px-3'>
                                                    <h6>Apple iPhone 15 256GB Black</h6>
                                                </div>
                                            </div>
                                        </Link>
                                    </td>
                                    <td width="15%"><strong>₹44,999</strong></td>
                                    <td width="20%"><QuantityBox /></td>
                                    <td width="15%"><strong>₹44,999</strong></td>
                                    <td width="10%"><span className='remove'><IoMdClose /></span></td>
                                </tr>
                                <tr>
                                    <td width="35%">
                                        <Link to="/product/1">
                                            <div className='d-flex align-items-center cartItemWrapper'>
                                                <div className='imgWrapper'>
                                                    <img
                                                        src='https://api.spicezgold.com/download/file_1734528708304_apple-iphone-13-128-gb-midnight-black-digital-o491997699-p590798548-0-202208221207.webp'
                                                        className='w-100'
                                                        alt="Apple iPhone 15"
                                                    />
                                                </div>
                                                <div className='info px-3'>
                                                    <h6>Apple iPhone 15 256GB Black</h6>
                                                </div>
                                            </div>
                                        </Link>
                                    </td>
                                    <td width="20%"><strong>₹44,999</strong></td>
                                    <td width="20%"><QuantityBox /></td>
                                    <td width="15%"><strong>₹44,999</strong></td>
                                    <td width="10%"><span className='remove'><IoMdClose /></span></td>
                                </tr>
                            </tbody>
                        </table>

                    </div>
                    <div className='col-md-4'>
                        <div className='card shadow-sm p-3 cartDetails'>
                            <h4>CART TOTALS</h4>
                            <div className='d-flex align-items-center'>
                                <span>Subtotal</span>
                                <span className='ml-auto text-red'><strong>₹44,999</strong></span>
                            </div>
                            <div className='d-flex align-items-center mt-2'>
                                <span>Shipping</span>
                                <span className='ml-auto'><strong>Free</strong></span>
                            </div>
                            <div className='d-flex align-items-center mt-2'>
                                <span>Estimate for</span>
                                <span className='ml-auto'><strong>India</strong></span>
                            </div>
                            <div className='d-flex align-items-center mt-2 mb-3'>
                                <span>Total</span>
                                <span className='ml-auto text-red'><strong>₹44,999</strong></span>
                            </div>
                            <Button> <IoShieldCheckmarkOutline/><span>Check Out</span></Button>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    )
}

export default Cart