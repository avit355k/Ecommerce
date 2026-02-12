import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '@mui/material/Button';
import { IoShieldCheckmarkOutline } from "react-icons/io5";

import { mycontext } from '../../App';
import QuantityBox from "../../components/QuantityBox";
import API from '../../Services/api';

const Cart = () => {
    const { setIsHeaderFooterVisible } = useContext(mycontext);
    const navigate = useNavigate();

    const [cartData, setCartData] = useState({
        items: [],
        subtotal: 0,
        discount: 0,
        totalPrice: 0
    });

    useEffect(() => {
        setIsHeaderFooterVisible(false);
        fetchCart();
        return () => setIsHeaderFooterVisible(true);
    }, []);

    // Fetch cart
    const fetchCart = async () => {
        try {
            const token = sessionStorage.getItem("token");

            const { data } = await API.get("/api/cart", {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (data.success) {
                setCartData({
                    items: data.cart.items,
                    subtotal: data.subtotal,
                    discount: data.discount,
                    totalPrice: data.totalPrice
                });
            }
            console.log(data);
        } catch (err) {
            console.error("Cart error", err);
        }
    };

    // Update quantity
    const updateQty = async (variantId, qty) => {
        try {
            const token = sessionStorage.getItem("token");

            const { data } = await API.put(
                "/api/cart/update",
                { variantId, quantity: qty },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (data.success) {
                fetchCart();
            }
        } catch (error) {
            console.error("Update qty error", error);
        }
    };

    // Delete item
    const deleteItem = async (variantId) => {
        try {
            const token = sessionStorage.getItem("token");

            const { data } = await API.delete(
                `/api/cart/remove/${variantId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (data.success) {
                fetchCart();
            }
        } catch (error) {
            console.error("Delete cart item error", error);
            console.log(error.response?.data);
        }
    };


    return (
        <section className='cartPage'>
            <div className="cartHeader">
                <h2 className="hd">
                    Shopping Cart <span className="text-red">({cartData.items.length} Items)</span>
                </h2>
            </div>

            {cartData.items.length === 0 ? (
                <div className="emptyCart">
                    <IoShieldCheckmarkOutline size={80} color="#555" />
                    <h3>Your cart is empty</h3>
                    <p>Add items to your cart to see them here.</p>
                    <Button variant="contained" color="primary" href="/">
                        Start Shopping
                    </Button>
                </div>
            ) : (
                <div className='row'>
                    {/* LEFT */}
                    <div className="col-md-8">
                        <div className="cartList">
                            {cartData.items.map(item => (
                                <div className="cartItem" key={item._id}>
                                    <div className="d-flex">
                                        <div className="cartImg">
                                            <img src={item.product.images[0]?.url} alt={item.product.name} />
                                        </div>

                                        <div className="cartInfo pl-3 flex-grow-1">
                                            <h6 className="product-title">{item.product.name}</h6>

                                            {Object.entries(item.variant.attributes || {}).map(([k, v]) => (
                                                <p key={k} className="mb-1 text-muted">
                                                    {k}: <strong>{v}</strong>
                                                </p>
                                            ))}

                                            <div className="d-flex align-items-center mt-2">
                                                <QuantityBox
                                                    value={item.quantity}
                                                    max={item.variant.countInStock}
                                                    setValue={(q) => updateQty(item.variant._id, q)}
                                                />
                                                <span
                                                    className="action-link ml-3"
                                                    onClick={() => deleteItem(item.variant._id)}
                                                >
                                                    Delete
                                                </span>

                                            </div>
                                        </div>

                                        <div className="cartPrice">
                                            <span className="price">₹{item.price}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div className='col-md-4'>
                        <div className='card shadow-sm p-3 cartDetails'>
                            <h4>Price details</h4>

                            <div className='d-flex'>
                                <span>Subtotal</span>
                                <span className='ml-auto text-red'>₹{cartData.subtotal}</span>
                            </div>

                            <div className='d-flex mt-2'>
                                <span>Discount</span>
                                <span className='ml-auto text-success'>₹{cartData.discount}</span>
                            </div>

                            <div className='d-flex mt-2'>
                                <span>Delivery</span>
                                <span className='ml-auto'>Free</span>
                            </div>

                            <div className='total-price d-flex mt-3'>
                                <strong>Total</strong>
                                <strong className='ml-auto text-red'>₹{cartData.totalPrice}</strong>
                            </div>

                            <Button className="mt-3" onClick={() => navigate("/checkout")}>
                                <IoShieldCheckmarkOutline />
                                <span className="ml-1">Check Out</span>
                            </Button>
                        </div>
                    </div>
                </div>
            )
            }
        </section>
    );
};

export default Cart;
