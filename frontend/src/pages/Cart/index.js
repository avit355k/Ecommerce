import React, {useContext, useEffect, useState} from 'react'
import Button from '@mui/material/Button';
import {IoShieldCheckmarkOutline} from "react-icons/io5";
import {mycontext} from '../../App';

import QuantityBox from "../../components/QuantityBox";
import API from '../../Services/api';

const Cart = () => {
    const {setIsHeaderFooterVisible} = useContext(mycontext);
    const [cart, setCart] = useState({items: []});


    useEffect(() => {
        setIsHeaderFooterVisible(false);
        fetchCart();

        return () => setIsHeaderFooterVisible(true);
    }, [setIsHeaderFooterVisible]);

    //fetch cart data
    const fetchCart = async () => {
        try {
            const token = sessionStorage.getItem("token");
            const {data} = await API.get("/api/cart", {
                headers: {Authorization: `Bearer ${token}`}
            });
            if (data.success) setCart(data.cart);
            console.log(data.cart);
        } catch (err) {
            console.error("Cart error", err);
            console.log(err);
        }
    }


    return (
        <section className='cartPage'>
            <div className="cartHeader">
                <h2 className="hd">
                    Shopping Cart <span className="text-red">({cart.items.length} Items)</span>
                </h2>
            </div>

            <div className='row'>
                {/*left side*/}
                <div className="col-md-8">
                    <div className="cartList">
                        {/*rendering cart items*/}
                        {
                            cart.items.map(item => (
                                <div className="cartItem" key={item.variant._id}>
                                    <div className="d-flex">
                                        <div className="cartImg">
                                            <img
                                                src={item.product.images[0]?.url}
                                                alt={item.product.name}
                                            />
                                        </div>
                                        <div className="cartInfo pl-3 flex-grow-1">
                                            <h6 className="product-title"> {item.product.name} </h6>

                                            {
                                                item.variant.attributes &&
                                                Object.entries(item.variant.attributes).map(([key, value]) => (
                                                    <p className="mb-1 text-muted">
                                                        {key}: <strong>{value}</strong>
                                                    </p>
                                                ))
                                            }

                                            <div className="d-flex align-items-center mt-2">
                                                <QuantityBox
                                                    value={item.quantity}
                                                />
                                                <span className="action-link ml-3">Delete</span>
                                                <span className="action-link ml-3">Save for later</span>
                                                <span className="action-link ml-3">Share</span></div>
                                        </div>
                                        <div className="cartPrice "><span className="price">₹{item.price}</span></div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
                {/*right side*/}
                <div className='col-md-4'>
                    <div className='card shadow-sm p-3 cartDetails'>
                        <h4>Price details</h4>

                        <div className='d-flex align-items-center'><span>Subtotal</span> <span
                            className='ml-auto text-red'><strong>₹{cart.subtotal}</strong></span>
                        </div>
                        <div className='d-flex align-items-center mt-2'>
                            <span>Discount</span>
                            <span className='ml-auto text-success'><strong>₹{cart.discount}</strong></span>
                        </div>
                        <div className='d-flex align-items-center mt-2'>
                            <span>Delivery Charge</span>
                            <span className='ml-auto'><strong>free</strong></span>
                        </div>
                        <div className='total-price d-flex align-items-center mt-2 mb-3'><span>Total Amount</span>
                            <span className='ml-auto text-red'><strong>₹{cart.totalPrice}</strong></span>
                        </div>
                        <Button>
                            <IoShieldCheckmarkOutline/>
                            <span>Check Out</span>
                        </Button>
                    </div>
                </div>
            </div>
        </section>)
}
export default Cart;