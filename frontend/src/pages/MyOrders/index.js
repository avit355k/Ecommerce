import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import API from "../../Services/api";

const MyOrders = () => {

    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await API.get("/api/order/my-orders");
            setOrders(res.data.orders);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <section className="MyOrderPage py-4">
            <div>
                <div className="Titlebar">
                    <h4 className="mb-4">My Orders</h4>
                </div>

                {orders.map((order) => (
                    <div key={order._id} className="order-card mb-3 p-3" style={{cursor: "pointer"}}
                         onClick={() => navigate(`/my-account/orders/order-details/${order._id}`)}
                    >
                        <div className="row ">

                            {/* Image */}
                            <div className="col-md-3 text-left">
                                <img
                                    src={order.items[0]?.product?.images[0].url}
                                    alt="Product"
                                    className="img-fluid order-img"
                                />
                            </div>

                            {/* Name */}
                            <div className="col-md-4 ps-2 order-product-name">
                                <h6 className="mb-1 ">
                                    {order.items[0]?.product?.name}
                                </h6>

                                <p className="text-muted mb-0">
                                    {order.items[0]?.variant?.attributes && Object.entries(order.items[0].variant.attributes).map(([key, value], index) => (
                                        <span key={index} className="me-2">
                                           {key}: {value}
                                         </span>))
                                    }
                                </p>

                            </div>

                            {/* Price */}
                            <div className="col-md-2 text-md-end">
                                <h6>₹{order.totalAmount}</h6>
                            </div>

                            {/* Status */}
                            <div className="col-md-3 text-left">
                                {order.orderStatus === "delivered" && (<p className="text-success mb-0">
                                    ● Delivered
                                </p>)}

                                {order.orderStatus === "refund" && (<p className="text-danger mb-0">
                                    ● Refund completed
                                </p>)}

                                {order.orderStatus === "processing" && (<p className="text-warning mb-0">
                                    ● Processing
                                </p>)}
                            </div>

                        </div>
                    </div>))}

            </div>
        </section>);
};

export default MyOrders;
