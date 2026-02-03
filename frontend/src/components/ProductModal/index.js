import React, { useRef } from "react";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Rating from '@mui/material/Rating';
import { IoMdClose } from "react-icons/io";
import QuantityBox from "../QuantityBox";
import { CiHeart } from "react-icons/ci";
import { IoMdSwap } from "react-icons/io";
import ProductZoom from "../ProductZoom";


const ProductModal = ({ isOpenModal, setIsOpenModal }) => {

    return (
        <>
            <Dialog
                open={isOpenModal}
                onClose={() => setIsOpenModal(false)}
                className="productModal"
            >
                <div className="closeWrapper">
                    <IconButton className="Close_" onClick={() => setIsOpenModal(false)}>
                        <IoMdClose />
                    </IconButton>
                </div>
                <h4 className="mb-1 font-weight-bold">Apple iPhone 15 256GB Black </h4>

                <div className="d-flex align-items-center">

                    <div className="d-flex align-items-center mr-4">
                        <span>Brands:</span>
                        <span className="ml-2"><b>Apple</b></span>
                    </div>

                    <Rating name="read-only" value={5} readOnly size="small" precision={0.5} />

                </div>

                <hr />
                <div className="row mt-2 productDetailsModal">
                    <div className="col-md-5">
                        <ProductZoom />
                    </div>
                    <div className="col-md-7">
                        <div className="d-flex info align-items-center mb-3">
                            <span className="discountPrice">₹ 49,999</span>
                            <span className="price text-danger ml-2">₹ 44,999</span>
                        </div>
                        <span className="text-success d-block">In Stock</span>
                        <p className="mt-2">Dynamic Island bubbles up alerts and Live Activities —
                            so you don’t miss them while you’re doing something else. You can track your next ride,
                            see who’s calling, check your flight status, and so much more.
                        </p>
                        <div className="d-flex align-items-center mt-3">
                            <QuantityBox />
                            <Button className="btn-blue btn-lg btn-big btn-round ml-3">Add to Cart</Button>
                        </div>

                        <div className="d-flex align-items-center mt-5">
                            <Button className="btn-round btn-sml actions" variant="outlined">
                                <CiHeart />&nbsp;Add to Wishlist
                            </Button>
                             <Button className="btn-round btn-sml actions ml-3" variant="outlined">
                                <IoMdSwap  /> &nbsp;Compare
                            </Button>
                        </div>
                    </div>
                </div>
            </Dialog>
        </>
    )
}

export default ProductModal