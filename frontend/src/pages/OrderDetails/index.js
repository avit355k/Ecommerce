import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {FaStar} from "react-icons/fa";
import {FiDownload, FiHome, FiUser} from "react-icons/fi";
import API from "../../Services/api";

const OrderDetails = () => {

    const {id} = useParams();
    const [order, setOrder] = useState(null);
    const [rating, setRating] = useState(0);
    const [reviewTitle, setReviewTitle] = useState("");
    const [reviewDescription, setReviewDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [alreadyReviewed, setAlreadyReviewed] = useState(false);

    useEffect(() => {
        fetchOrder();
    }, []);

    const fetchOrder = async () => {
        try {
            const res = await API.get(`/api/order/${id}`);
            setOrder(res.data.order);

            const productId = res.data.order.items[0].product._id;
            // After order loads → fetch rating & review
            fetchUserRating(productId);
            fetchUserReview(productId);

        } catch (error) {
            console.error(error);
        }
    };

    // Fetch Existing Rating
    const fetchUserRating = async (productId) => {
        try {
            const res = await API.get(`/api/rating/user/${productId}`);
            if (res.data?.stars) {
                setRating(res.data.stars);
            }
        } catch (err) {
            console.log("No rating found");
        }
    };
    // Fetch Existing Review
    const fetchUserReview = async (productId) => {
        try {
            const res = await API.get(`/api/review/user/${productId}`);
            if (res.data) {
                setReviewTitle(res.data.title || "");
                setReviewDescription(res.data.description || "");
                setAlreadyReviewed(true);
            }
        } catch (err) {
            console.log("No review found");
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

    // Submit/ Update rating Review
    const handleSubmitReview = async () => {
        if (rating === 0) {
            alert("Please select rating");
            return;
        }

        if (!reviewDescription.trim()) {
            alert("Please write review");
            return;
        }

        try {
            setLoading(true);

            const productId = order.items[0].product._id;

            // Rating (Add or Update same API)
            await API.post("/api/rating/add", {
                productId,
                stars: rating
            });

            // Review
            if (alreadyReviewed) {
                // Update review
                await API.put(`/api/review/update/${productId}`, {
                    title: reviewTitle,
                    description: reviewDescription
                });
            } else {
                // Add review
                await API.post("/api/review/add", {
                    productId,
                    title: reviewTitle,
                    description: reviewDescription
                });
            }

            alert(alreadyReviewed ? "Review updated successfully" : "Review submitted successfully");
            setAlreadyReviewed(true);

        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
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
                            <div className="order-tracker">
                                {order.statusHistory?.map((step, index) => (
                                    <div className="tracker-step" key={index}>
                                        <div className="tracker-left">
                                            {/* The Dot */}
                                            <div className="tracker-dot"></div>
                                            {/* The Line (don't show for the last item) */}
                                            {index !== order.statusHistory.length - 1 && (
                                                <div className="tracker-line"></div>
                                            )}
                                        </div>
                                        <div className="tracker-content">
                                            <span className="status-text">{formatStatus(step.status)}</span>
                                            <span className="date-text">{formatDate(step.date || step.data)}</span>
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
                                                             ${rating <= 2 ? "low" :
                                                rating === 3 ? "medium" :
                                                    rating >= 4 ? "high" : ""
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
                                    value={reviewDescription}
                                    onChange={(e) => setReviewDescription(e.target.value)}
                                ></textarea>
                                </div>

                                <div className="mb-3">
                                    <input
                                        type="text"
                                        className="form-control review-title"
                                        placeholder="Title (optional)"
                                        value={reviewTitle}
                                        onChange={(e) => setReviewTitle(e.target.value)}
                                    />
                                </div>

                                <button className="btn btn-warning px-4" onClick={handleSubmitReview}
                                        disabled={loading}
                                >
                                    {loading ? "Submitting..." : alreadyReviewed ? "Update Review" : "Submit"}
                                </button>

                            </div>
                        )}

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

                            {isDelivered && (
                                <button
                                    onClick={downloadInvoice}
                                    className="invoice-btn w-100"
                                >
                                    <FiDownload className="mr-2"/>
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
