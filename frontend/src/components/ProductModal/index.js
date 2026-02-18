import React, {useContext} from "react";

import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Rating from "@mui/material/Rating";

import {IoIosHeart, IoMdClose, IoMdSwap} from "react-icons/io";
import {CiHeart} from "react-icons/ci";
import ProductZoom from "../ProductZoom";
import {mycontext} from "../../App";


const ProductModal = ({product, isOpenModal, setIsOpenModal}) => {

    const context = useContext(mycontext);

    if (!product) return null;
    
    const isWishlisted = context.wishlistItems.includes(product._id);

    return (
        <>
            <Dialog
                open={isOpenModal}
                onClose={() => setIsOpenModal(false)}
                className="productModal"
            >
                <div className="closeWrapper">
                    <IconButton className="Close_" onClick={() => setIsOpenModal(false)}>
                        <IoMdClose/>
                    </IconButton>
                </div>
                <h4 className="mb-1 font-weight-bold"> {product.name} </h4>

                <div className="d-flex align-items-center">

                    <div className="d-flex align-items-center mr-4">
                        <span>Brands:</span>
                        <span className="ml-2"><b>{product.brand}</b></span>
                    </div>

                    <Rating name="read-only" value={5} readOnly size="small" precision={0.5}/>

                </div>

                <hr/>
                <div className="row mt-2 productDetailsModal">
                    <div className="col-md-5">
                        <ProductZoom
                            images={product.images}
                            discountPercent={product.discountPercent}
                        />
                    </div>
                    <div className="col-md-7">
                        <div className="d-flex info align-items-center mb-3">
                            <span className="price">₹ {product.price}</span>
                            {product.discountedPrice && (
                                <span className=" discountPrice text-danger ml-2">
                                ₹ {product.discountedPrice ?? product.price}
                            </span>
                            )}
                        </div>
                        <span className="text-success d-block">In Stock</span>

                        <p className="mt-2">
                            {product.description}
                        </p>


                        <div className="d-flex align-items-center mt-5">
                            <Button
                                onClick={() => context.toggleWishlist(product._id)}
                                className={`btn-round btn-sml actions ${
                                    isWishlisted ? "activeWishlistModal" : ""
                                }`}
                            >
                                {isWishlisted ? (
                                    <>
                                        <IoIosHeart/> &nbsp; Wishlisted
                                    </>
                                ) : (
                                    <>
                                        <CiHeart/> &nbsp; Add to Wishlist
                                    </>
                                )}
                            </Button>

                            <Button className="btn-round btn-sml actions ml-3" variant="outlined">
                                <IoMdSwap/> &nbsp;Compare
                            </Button>
                        </div>
                    </div>
                </div>
            </Dialog>
        </>
    )
}

export default ProductModal