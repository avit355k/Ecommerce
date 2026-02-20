import React, {useEffect, useState} from 'react';
import Button from "@mui/material/Button";
import {MdDelete} from "react-icons/md";
import {useNavigate} from "react-router-dom";

import API from "../../Services/api";


const MyWishlist = () => {
    const [wishlist, setWishlist] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchWishlist();
    }, []);

    //fetch user wishlists
    const fetchWishlist = async () => {
        try {
            const res = await API.get("/api/wishlist/");
            setWishlist(res.data);
            console.log(res.data);
        } catch (error) {
            console.log(error);
            console.error(error);
        }
    }

    //remove from wishlist
    const handleRemove = async (productId) => {
        try {
            await API.delete(`/api/wishlist/remove/${productId}`);

            // Update UI without refetch (better UX)
            setWishlist(prev => ({
                ...prev,
                items: prev.items.filter(
                    item => item.product._id !== productId
                )
            }));

        } catch (error) {
            console.error(error);
        }
    };


    return (
        <section className="MyWishlistPage py-4">
            <div>
                <div className="Titlebar">
                    <h4 className="mb-4"> My Wishlist ({wishlist?.items?.length || 0})</h4>
                </div>

                {wishlist?.items?.map((item) => (
                    <div key={item._id} className="wishlist-card mb-3 p-3">
                        <div className="row">

                            {/* Image */}
                            <div className="col-md-3 text-left">
                                <img
                                    src={item?.product?.images[0]?.url}
                                    alt="Product"
                                    className="img-fluid wishlist-img"
                                />
                            </div>

                            {/* Name */}
                            <div className="col-md-4 ps-2 wishlist-product-name">
                                <h6 className="mb-1">
                                    {item?.product?.name}
                                </h6>

                                <p className="text-muted mb-0">
                                    {item?.variant?.attributes &&
                                        Object.entries(item.variant.attributes).map(
                                            ([key, value], index) => (
                                                <span key={index} className="me-2">
                                    {key}: {value}
                                </span>
                                            )
                                        )}
                                </p>
                            </div>

                            {/* Price */}
                            <div className="col-md-2 text-md-end">
                                <h6>₹{item?.variant?.discountedPrice}</h6>
                            </div>

                            {/* Delete */}
                            <div className="col-md-3 remove-button">
                                <Button onClick={() => handleRemove(item.product._id)}>
                                    <MdDelete size={20}/>
                                </Button>
                            </div>

                        </div>
                    </div>
                ))}


            </div>
        </section>
    );
};

export default MyWishlist;