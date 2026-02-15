import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {FaCheckCircle} from "react-icons/fa";
import {FiDownload, FiHome, FiUser} from "react-icons/fi";
import API from "../../Services/api";

const OrderDetails = () => {

    const {id} = useParams();
    const [order, setOrder] = useState(null);

    useEffect(() => {
        fetchOrder();
    }, []);

    const fetchOrder = async () => {
        try {
            const res = await API.get(`/api/order/${id}`);
            setOrder(res.data.order);
        } catch (error) {
            console.error(error);
        }
    };

    // DOWNLOAD INVOICE FUNCTION
    const downloadInvoice = async () => {
        try {
            const response = await API.get(
                `/api/order/${id}/invoice`,
                {
                    responseType: "blob"
                }
            );

            const url = window.URL.createObjectURL(
                new Blob([response.data])
            );

            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `invoice-${id}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();

        } catch (error) {
            console.error("Invoice download failed", error);
            console.log(error);
        }
    };

    if (!order) return <p>Loading...</p>;

    const item = order.items[0];

    return (
        <section className="OrderDetailsPage py-4">
            <div className="container">
                <div className="row">

                    {/* LEFT SIDE */}
                    <div className="col-md-8">

                        <div className="details-card p-3 mb-3">
                            <div className="d-flex">

                                <div className="flex-grow-1">
                                    <h6>{item.product?.name}</h6>

                                    <p className="text-muted">
                                        {Object.entries(item.variant?.attributes || {}).map(
                                            ([key, value], index) => (
                                                <span key={index} className="me-2">
                                                    {key}: {value}
                                                </span>
                                            )
                                        )}
                                    </p>

                                    <h5>₹{order.totalAmount}</h5>
                                </div>

                                <div className="product-img me-3">
                                    <img
                                        src={item.product?.images[0]?.url}
                                        alt="Product"
                                        className="img-fluid"
                                    />
                                </div>

                            </div>
                        </div>

                        {/* Timeline */}
                        <div className="details-card p-4 mb-3">
                            <h6 className="mb-4">Track Order</h6>

                            <p>
                                <FaCheckCircle className="text-success me-2"/>
                                Order Placed ({new Date(order.createdAt).toDateString()})
                            </p>

                            {order.orderStatus !== "processing" && (
                                <p>
                                    <FaCheckCircle className="text-success me-2"/>
                                    Shipped
                                </p>
                            )}

                            {order.orderStatus === "delivered" && (
                                <p>
                                    <FaCheckCircle className="text-success me-2"/>
                                    Delivered
                                </p>
                            )}

                            {order.orderStatus === "cancelled" && (
                                <p className="text-danger">
                                    Order Cancelled
                                </p>
                            )}
                        </div>

                    </div>

                    {/* RIGHT SIDE */}
                    <div className="col-md-4">

                        {/* Delivery Details */}
                        <div className="details-card p-4 mb-4">
                            <h6 className="section-title mb-3">Delivery Details</h6>

                            <div className="delivery-info">

                                <p className="mb-2 text-muted">
                                    <FiHome className="mr-2 icon"/>
                                    {order.shippingAddress?.addressLine}, {order.shippingAddress?.city}
                                </p>
                                <p className="mb-2">
                                    <FiUser className="mr-2 icon"/>
                                    <strong className="mr-2">{order.shippingAddress?.fullName}</strong>
                                    {order.shippingAddress?.phone}
                                </p>
                            </div>
                        </div>

                        {/* Price Details */}
                        <div className="details-card p-4">
                            <h6 className="section-title mb-3">Price details</h6>

                            <div className="price-box p-3 mb-3">
                                <div className="d-flex justify-content-between">
                                    <span>Total amount</span>
                                    <span className="fw-bold">₹{order.totalAmount}</span>
                                </div>
                            </div>

                            <button
                                onClick={downloadInvoice}
                                className="invoice-btn w-100"
                            >
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
