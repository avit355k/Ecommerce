import React from 'react';

const OrderStatus = ({ orderStatus = {} }) => {
    const data = [
        { label: "Delivered", key: "delivered", color: "green" },
        { label: "Shipped", key: "shipped", color: "blue" },
        { label: "Processing", key: "processing", color: "orange" },
        { label: "Out for Delivery", key: "out_for_delivery", color: "darkorange" },
        { label: "Cancelled", key: "cancelled", color: "red" },
    ];
    return (
        <div className="order-card card shadow border-0 p-3">
            <h3 className="order-title">Order Status</h3>

            {data.map((item, index) => (
                <div className="order-row" key={index}>
                    <div className="left">
                        <span className={`dot ${item.color}`}></span>
                        <span className="label">{item.label}</span>
                    </div>
                    <div className="value">
                        {orderStatus[item.key] || 0}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default OrderStatus;