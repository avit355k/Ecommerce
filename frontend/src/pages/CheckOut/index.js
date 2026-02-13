import React, {useContext, useEffect, useState} from 'react';

import {Button, Radio} from '@mui/material';
import {FaChevronDown, FaPlus} from "react-icons/fa";

import {mycontext} from '../../App';
import API from "../../Services/api";
import AddressModal from "../../components/AddressModal";

const Checkout = () => {
    const {setIsHeaderFooterVisible} = useContext(mycontext);

    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [cartSummary, setCartSummary] = useState({subtotal: 0, discount: 0, totalPrice: 0,});
    const [loading, setLoading] = useState(false);

    const [openModal, setOpenModal] = useState(false);
    const [editAddress, setEditAddress] = useState(null);

    const [showAll, setShowAll] = useState(false);


    useEffect(() => {
        setIsHeaderFooterVisible(false);
        fetchAddresses();
        fetchCartSummary();
        return () => setIsHeaderFooterVisible(true);
    }, []);

    //fetch Address
    const fetchAddresses = async () => {
        try {
            const res = await API.get("/api/address/");
            const data = res.data.addresses;

            setAddresses(data);

            // Auto select default
            const defaultAddress = data.find(a => a.isDefault);
            if (defaultAddress) {
                setSelectedAddress(defaultAddress._id);
            } else if (data.length > 0) {
                setSelectedAddress(data[0]._id);
            }

        } catch (error) {
            console.log(error);
        }
    };

    //fetch cart summary
    const fetchCartSummary = async () => {
        try {
            const res = await API.get("/api/cart/");
            if (res.data.success) {
                setCartSummary({
                    subtotal: res.data.subtotal,
                    discount: res.data.discount,
                    totalPrice: res.data.totalPrice,
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    //set default address
    const handleSetDefault = async (id) => {
        try {
            await API.put(`/api/address/set-default/${id}`);
            fetchAddresses();
        } catch (error) {
            console.log(error);
        }
    };

    // Razorpay Script Loader
    const loadRazorpay = () => {
        return new Promise((resolve) => {
            if (window.Razorpay) {
                resolve(true);
                return;
            }

            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };
    // Handle Payment
    const handlePayment = async () => {
        if (!selectedAddress) {
            alert("Please select an address");
            return;
        }
        if (!process.env.REACT_APP_RAZORPAY_KEY) {
            alert("Razorpay Key missing in .env file");
            return;
        }
        setLoading(true);

        const loaded = await loadRazorpay();
        if (!loaded) {
            alert("Razorpay SDK failed to load");
            setLoading(false);
            return;
        }

        try {
            //Load Razorpay SDK
            const loaded = await loadRazorpay();
            if (!loaded) {
                alert("Failed to load Razorpay SDK");
                setLoading(false);
                return;
            }
            // Create Razorpay Order
            const {data} = await API.post(
                "/api/order/create-razorpay-order",
                {shippingAddressId: selectedAddress}
            );

            if (!data.success) {
                alert("Failed to create order");
                setLoading(false);
                return;
            }

            const {razorpayOrder} = data;
            //Configure Razorpay options
            const options = {
                key: process.env.REACT_APP_RAZORPAY_KEY,
                amount: razorpayOrder.amount,
                currency: "INR",
                name: "Click And Collect",
                description: "Order Payment",
                order_id: razorpayOrder.id,

                handler: async function (response) {
                    try {
                        // Verify Payment
                        const verifyRes = await API.post(
                            "/api/order/verify-payment",
                            {
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                shippingAddressId: selectedAddress,
                            }
                        );

                        if (verifyRes.data.success) {
                            window.location.href = "/order-success";
                        }
                    } catch (error) {
                        console.log(error);
                    }
                },

                theme: {
                    color: "#1976d2",
                },
            };

            const paymentObject = new window.Razorpay(options);

            paymentObject.on("payment.failed", function (response) {
                console.log(response.error);
                alert("Payment failed. Please try again.");
            });
            
            paymentObject.open();
        } catch (error) {
            console.log("Payment Error:", error);
        } finally {
            setLoading(false);
        }
    };


    //modal control
    const handleOpen = () => {
        setEditAddress(null);
        setOpenModal(true);
    };

    const handleEdit = (address) => {
        setEditAddress(address);
        setOpenModal(true);
    };

    const handleClose = () => {
        setOpenModal(false);
        setEditAddress(null);
    };

    return (
        <div className='checkoutPage'>

            <div className='row'>
                {/*left bar*/}
                <div className='col-md-8'>
                    <div className='address-container'>
                        <div className='address-header-blue'>
                            <span className='step-box'>2</span>
                            DELIVERY ADDRESS
                        </div>

                        {(showAll ? addresses : addresses.slice(0, 2)).map((address) => (
                            <div key={address._id} className="address-item">
                                <div className="d-flex align-items-start p-3">

                                    <Radio
                                        checked={selectedAddress === address._id}
                                        onChange={() => setSelectedAddress(address._id)}
                                        size="small"
                                    />

                                    <div className='address-info ml-2 w-100'>

                                        <div className="d-flex align-items-center">
                                            <span className="user-name">{address.fullName}</span>
                                            <span className='user-phone ml-3'>{address.phone}</span>
                                            <Button className="ml-auto edit-btn"
                                                    onClick={() => handleEdit(address)}>
                                                EDIT
                                            </Button>
                                        </div>

                                        <p className='address-text mt-1'>{address.addressLine}, {address.city}, {address.state} - {address.pincode}</p>

                                        <Button variant="contained" className="deliver-here-btn mt-2"
                                                onClick={() => handleSetDefault(address._id)}
                                        >
                                            DELIVER HERE
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {addresses.length > 2 && (
                            <div className="address-footer-actions p-2">
                                <Button
                                    startIcon={
                                        <FaChevronDown style={{fontSize: "16px"}}/>
                                    }
                                    className="view-all-btn"
                                    onClick={() => setShowAll(!showAll)}
                                >
                                    {showAll
                                        ? "Show less"
                                        : `View all ${addresses.length} addresses`}
                                </Button>
                            </div>
                        )}

                    </div>

                    <div className='newAddress'>
                        <Button onClick={handleOpen}>
                            <FaPlus className='mr-3'/> Add New Address
                        </Button>
                    </div>
                </div>

                {/*right bar*/}
                <div className='col-md-4'>
                    <div className='shadow-sm p-3 cartDetails'>
                        <h4>Price details</h4>

                        <div className='d-flex'>
                            <span>Subtotal</span>
                            <span className='ml-auto text-red'>₹{cartSummary.subtotal}</span>
                        </div>

                        <div className='d-flex mt-2'>
                            <span>Discount</span>
                            <span className='ml-auto text-success'>₹{cartSummary.discount}</span>
                        </div>

                        <div className='d-flex mt-2'>
                            <span>Delivery</span>
                            <span className='ml-auto'>Free</span>
                        </div>

                        <div className='total-price d-flex mt-3'>
                            <strong>Total</strong>
                            <strong className='ml-auto text-red'>₹{cartSummary.totalPrice}</strong>
                        </div>

                        <Button variant="contained"
                                color="primary"
                                fullWidth
                                className="mt-3"
                                onClick={handlePayment}
                                disabled={loading}
                        >
                            <span className="ml-1">{loading ? "Processing..." : "Proceed to Payment"}</span>
                        </Button>
                    </div>
                </div>
            </div>

            <AddressModal
                open={openModal}
                handleClose={handleClose}
                fetchAddresses={fetchAddresses}
                editData={editAddress}
            />

        </div>
    );
};

export default Checkout;