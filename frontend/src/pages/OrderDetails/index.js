import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { FiDownload, FiHome, FiUser } from "react-icons/fi";
import API from "../../Services/api";

const OrderDetails = () => {

    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [rating, setRating] = useState(0);

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
    // date formatting function
    const formatDate = (date) => {
        if (!date) return "";
        return new Date(date).toLocaleString("en-IN", {
            day: "numeric",
            month: "short",
            year: "2-digit",
            hour: "2-digit",
            minute: "2-digit"
        });
    };
    // status formatting function
    const formatStatus = (status) => {
        if (!status) return "";
        return status
            .replaceAll("_", " ")
            .replace(/\b\w/g, (char) => char.toUpperCase());
    };

    // Download invoice function
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
    // Check if order is delivered
    const isDelivered =
        order.orderStatus?.toLowerCase() === "delivered";

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

                            <div className="timeline">

                                {order.statusHistory?.map((step, index) => (
                                    <div className="timeline-item" key={index}>

                                        <div className="timeline-icon" />

                                        <div className="timeline-content">
                                            <strong>
                                                {formatStatus(step.status)}
                                            </strong>
                                            <span className="timeline-date">
                                                {formatDate(step.date || step.data)}
                                            </span>
                                        </div>

                                    </div>
                                ))}

                            </div>
                        </div>

                        {/* Rating & Review (Only if Delivered) */}
                        {isDelivered && (
                             <div className="details-card p-4 mb-3">

                            <h6 className="mb-3">Rate Your Experience</h6>

                            {/* Stars */}
                            <div className="rating-stars mb-4">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <FaStar
                                        key={star}
                                        className={`star 
                                                        ${star <= rating ? "active" : ""} 
                                                             ${rating <= 2  ? "low" :
                                                              rating === 3 ? "medium" : 
                                                              rating >= 4  ? "high" : ""
                                                    }`}
                                        onClick={() => setRating(star)}
                                    />
                                ))}
                            </div>

                            <h6 className="mb-3">Review this product</h6>

                            <div className="mb-3">
                                <textarea
                                    className="form-control review-textarea"
                                    rows="4"
                                    placeholder="Write your review here..."
                                ></textarea>
                            </div>

                            <div className="mb-3">
                                <input
                                    type="text"
                                    className="form-control review-title"
                                    placeholder="Title (optional)"
                                />
                            </div>

                            <button className="btn btn-warning px-4">
                                Submit
                            </button>

                        </div>
                        ) }

                    </div>

                    {/* RIGHT SIDE */}
                    <div className="col-md-4">

                        {/* Delivery Details */}
                        <div className="details-card p-4 mb-4">
                            <h6 className="section-title mb-3">Delivery Details</h6>

                            <div className="delivery-info">

                                <p className="mb-2 text-muted">
                                    <FiHome className="mr-2 icon" />
                                    {order.shippingAddress?.addressLine}, {order.shippingAddress?.city}
                                </p>
                                <p className="mb-2">
                                    <FiUser className="mr-2 icon" />
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

                            {isDelivered && (
                                <button
                                    onClick={downloadInvoice}
                                    className="invoice-btn w-100"
                                >
                                    <FiDownload className="me-2" />
                                    Download Invoice
                                </button>
                            )}

                        </div>

                    </div>

                </div>
            </div>
        </section>
    );
};

export default OrderDetails;
