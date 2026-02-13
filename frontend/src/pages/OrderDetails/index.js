import React from "react";
import {FaCheckCircle, FaStar} from "react-icons/fa";
import {FiDownload, FiHome, FiUser} from "react-icons/fi";

const OrderDetails = () => {
    return (
        <section className="OrderDetailsPage py-4">
            <div className="container">
                <div className="row">

                    {/*left side */}
                    <div className="col-md-8">

                        {/* Product Card */}
                        <div className="details-card p-3 mb-3">
                            <div className="d-flex">
                                <div className="flex-grow-1">
                                    <h6>
                                        Man Matters BeardGro Beard Growth Tonic for Thicker
                                        Aminexil & LashLD Hair Oil
                                    </h6>
                                    <h5>₹324</h5>
                                </div>

                                <div className="product-img me-3">
                                    <img
                                        src="https://rukminim2.flixcart.com/image/1366/1366/xif0q/perfume/r/3/z/100-luxure-oudh-perfume-100ml-eau-de-parfum-la-french-men-original-imah8h9zfgckfthx.jpeg?q=90"
                                        alt="Product"
                                        className="img-fluid"
                                    />
                                </div>

                            </div>
                        </div>

                        {/* Order Timeline */}
                        <div className="details-card p-4 mb-3">
                            <h6 className="mb-4">Track Order</h6>

                            <div className="track-line">

                                {/* Step 1 */}
                                <div className="track-step completed">
                                    <div className="track-icon">
                                        <FaCheckCircle/>
                                    </div>
                                    <div className="track-content">
                                        <p className="mb-0 fw-semibold">Order Confirmed</p>
                                        <small className="text-muted">Mar 18, 2024</small>
                                    </div>
                                </div>

                                {/* Step 2 */}
                                <div className="track-step completed">
                                    <div className="track-icon">
                                        <FaCheckCircle/>
                                    </div>
                                    <div className="track-content">
                                        <p className="mb-0 fw-semibold">Order Shipped</p>
                                        <small className="text-muted">Mar 19, 2024</small>
                                    </div>
                                </div>

                                {/* Step 3 */}
                                <div className="track-step completed">
                                    <div className="track-icon">
                                        <FaCheckCircle/>
                                    </div>
                                    <div className="track-content">
                                        <p className="mb-0 fw-semibold">Out for Delivery</p>
                                        <small className="text-muted">Mar 20, 2024</small>
                                    </div>
                                </div>

                                {/* Step 4 */}
                                <div className="track-step completed last">
                                    <div className="track-icon">
                                        <FaCheckCircle/>
                                    </div>
                                    <div className="track-content">
                                        <p className="mb-0 fw-semibold">Delivered</p>
                                        <small className="text-muted">Mar 22, 2024</small>
                                    </div>
                                </div>

                            </div>
                        </div>


                        {/* Rate Section */}
                        <div className="details-card p-3">
                            <h6>Rate your experience</h6>

                            <div className="rating-box p-3 mt-3">
                                <p className="mb-2">Product ratings</p>
                                <div className="d-flex align-items-center">
                                    <span className="me-3">Good</span>
                                    <FaStar className="text-success me-1"/>
                                    <FaStar className="text-success me-1"/>
                                    <FaStar className="text-success me-1"/>
                                    <FaStar className="text-success me-1"/>
                                    <FaStar className="text-secondary"/>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* right side */}
                    <div className="col-md-4">

                        {/* Delivery Details */}
                        <div className="details-card p-3 mb-3">
                            <h6 className="mb-3">Delivery details</h6>

                            <p className="mb-2">
                                <FiHome className="me-2"/>Aminpur Deganga bhashia road, amin...
                            </p>

                            <p className="mb-0">
                                <FiUser className="me-2"/>
                                AVIJIT RAKSHIT &nbsp; 9641404096
                            </p>
                        </div>

                        {/* Price Details */}
                        <div className="details-card p-3">
                            <h6 className="mb-3">Price details</h6>

                            <div className="d-flex justify-content-between mb-2">
                                <span>Subtotal price</span>
                                <span className="text-decoration-line-through">₹499</span>
                            </div>

                            <div className="d-flex justify-content-between mb-2">
                                <span>Discount price</span>
                                <span>₹399</span>
                            </div>

                            <div className="d-flex justify-content-between mb-2">
                                <span>Delivery</span>
                                <span className="text-success">₹0</span>
                            </div>

                            <hr/>

                            <div className="d-flex justify-content-between fw-bold mb-3">
                                <span>Total amount</span>
                                <span>₹324</span>
                            </div>

                            <button className="btn btn-outline-secondary w-100">
                                <FiDownload className="me-2"/>
                                Download Invoice
                            </button>

                        </div>

                    </div>

                </div>
            </div>
        </section>
    );
};

export default OrderDetails;
