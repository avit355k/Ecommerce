import React from "react";
import {useNavigate} from "react-router-dom";

import {FaStar} from "react-icons/fa";

const MyOrders = () => {
    const navigate = useNavigate();
    return (
        <section className="MyOrderPage py-4">
            <div className="container">
                <h4 className="mb-4">My Orders</h4>

                {/* ================= ORDER 1 ================= */}
                <div className="order-card mb-3 p-3">
                    <div className="row align-items-center cursor"
                         onClick={() => navigate("/my-account/orders/order-details")}>

                        <div className="col-md-2 text-center">
                            <img
                                src="https://rukminim2.flixcart.com/image/1366/1366/xif0q/perfume/r/3/z/100-luxure-oudh-perfume-100ml-eau-de-parfum-la-french-men-original-imah8h9zfgckfthx.jpeg?q=90"
                                alt="Product"
                                className="img-fluid order-img"
                            />
                        </div>

                        <div className="col-md-6">
                            <h6 className="mb-1">
                                CRALOFT Black Sling Bag Mini Sling Bag
                            </h6>
                            <p className="text-muted mb-0">Color: Black</p>
                        </div>

                        <div className="col-md-2 text-md-end">
                            <h6>₹440</h6>
                        </div>

                        <div className="col-md-2 text-md-end">
                            <p className="mb-1 text-success">
                                ● Delivered on Sep 30, 2023
                            </p>
                            <small className="text-primary review-link">
                                <FaStar/> Rate & Review Product
                            </small>
                        </div>

                    </div>
                </div>

                {/* ================= ORDER 2 ================= */}
                <div className="order-card mb-3 p-3">
                    <div className="row align-items-center"
                         onClick={() => navigate("/my-account/orders/order-details")}>

                        <div className="col-md-2 text-center">
                            <img
                                src="https://rukminim2.flixcart.com/image/1366/1366/xif0q/perfume/r/3/z/100-luxure-oudh-perfume-100ml-eau-de-parfum-la-french-men-original-imah8h9zfgckfthx.jpeg?q=90"
                                alt="Product"
                                className="img-fluid order-img"
                            />
                        </div>

                        <div className="col-md-6">
                            <h6 className="mb-1">
                                density Men Multicolor Sandals
                            </h6>
                            <p className="text-muted mb-0">
                                Color: Blue | Size: 8
                            </p>
                        </div>

                        <div className="col-md-2 text-md-end">
                            <h6>₹525</h6>
                        </div>

                        <div className="col-md-2 text-md-end">
                            <p className="mb-1 text-success">
                                ● Delivered on Sep 18, 2023
                            </p>
                            <small className="text-primary review-link">
                                <FaStar/> Rate & Review Product
                            </small>
                        </div>

                    </div>
                </div>

                {/* ================= ORDER 3 ================= */}
                <div className="order-card mb-3 p-3">
                    <div className="row align-items-center"
                         onClick={() => navigate("/my-account/orders/order-details")}>

                        <div className="col-md-2 text-center">
                            <img
                                src="https://rukminim2.flixcart.com/image/1366/1366/xif0q/perfume/r/3/z/100-luxure-oudh-perfume-100ml-eau-de-parfum-la-french-men-original-imah8h9zfgckfthx.jpeg?q=90"
                                alt="Product"
                                className="img-fluid order-img"
                            />
                        </div>

                        <div className="col-md-6">
                            <h6 className="mb-1">
                                WILDAUK Men Black Artificial Leather Wallet
                            </h6>
                            <p className="text-muted mb-0">Color: Black</p>
                        </div>

                        <div className="col-md-2 text-md-end">
                            <h6>₹186</h6>
                        </div>

                        <div className="col-md-2 text-md-end">
                            <p className="mb-0 text-danger">
                                ● Refund completed
                            </p>
                        </div>

                    </div>
                </div>

            </div>
        </section>
    );
};

export default MyOrders;
