import React from 'react';

const RecentOrder = ({recentOrders}) => {
    const truncate = (text, max = 25) =>
        text.length > max ? text.substring(0, max) + "..." : text;

    const getStatusColor = (status) => {
        switch (status) {
            case "processing": return "#ff9800";
            case "shipped": return "#2196f3";
            case "out_for_delivery": return "#9c27b0";
            case "delivered": return "#4caf50";
            case "cancelled": return "#f44336";
            default: return "#999";
        }
    };

    return (
        <div className="card recentOrderCard shadow border-0 p-3">
            <div className="recentOrderHeader mb-3">
                <h6>Recent Orders</h6>
                <span>Showing latest 5</span>
            </div>
            <div className="recentOrderList">
                {recentOrders.map((order) => {

                    const item = order.items[0];
                    const product = item?.product;

                    return (
                        <div className="recentOrderItem  mb-3" key={order._id}>

                            {/* LEFT */}
                            <div className="recentOrderLeft ">

                                <img
                                    src={product?.images?.[0]?.url}
                                    alt="product"
                                />

                                <div className="ms-3">
                                    <h6 className="mb-1">
                                        #{order._id}
                                    </h6>

                                    <p className="mb-0 text-muted">
                                        {truncate(product?.name)} • ₹{order.totalAmount}
                                    </p>
                                </div>
                            </div>

                            {/* RIGHT */}
                            <div className="recentOrderRight">
                                <div
                                    className="statusBadge"
                                    style={{
                                        background: getStatusColor(order.orderStatus)
                                    }}
                                >
                                    {order.orderStatus}
                                </div>
                            </div>

                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default RecentOrder;