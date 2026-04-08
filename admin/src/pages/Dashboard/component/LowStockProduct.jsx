import React from 'react';

const LowStockProduct = ({ lowStockProducts }) => {
    const truncate = (text, max = 25) =>
        text.length > max ? text.substring(0, max) + "..." : text;

    return (
        <div className="lowStockCard card shadow border-0 p-3">
            <div className="lowStockHeader mb-3">
                <h6>Low Stock Products</h6>
                <span>Showing latest 5</span>
            </div>

            <div className="lowStockList">
                {lowStockProducts.map((product) => (
                    <div className="lowStockItem" key={product._id}>

                         <div className="lowStockLeft">
                             <img src={product.product.images?.[0]?.url} alt="" />
                             <div>
                                 <h6>{product.sku}</h6>
                                 <p>
                                     {truncate(product.product?.name)} • ₹{product.price}
                                 </p>
                             </div>
                         </div>
                        <div className="lowStockRight">
                            {product.countInStock}
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
};

export default LowStockProduct;