
import Button from "@mui/material/Button";
import Rating from '@mui/material/Rating';
import { TfiFullscreen } from "react-icons/tfi";
import { IoIosHeartEmpty } from "react-icons/io";
import ProductModal from "../ProductModal";
import { useState } from "react";

const ProductItem = (props) => {

    const [isOpenProductmodal, setisOpenProductmodal] = useState(false);

    const viewProductsDetails = (id) => {
        setisOpenProductmodal(true);
    }


    return (
        <>
            <div className= {`item productItem ${props.itemView}`}>
                <div className="imgWrapper">
                    <img src="https://api.spicezgold.com/download/file_1734528708304_apple-iphone-13-128-gb-midnight-black-digital-o491997699-p590798548-0-202208221207.webp" className="w-100" />

                    <span className="badge badge-primary">28%</span>
                    <div className="actions">
                        <Button onClick={() => viewProductsDetails(1)}><TfiFullscreen /></Button>
                        <Button><IoIosHeartEmpty /></Button>
                    </div>
                </div>
                <div className="info">
                    <h4>Apple iPhone 15 256GB Black</h4>
                    <span className="text-success d-block">In Stock</span>
                    <Rating className="mt-2 mb-2" name="read-only" value={5} size="small" readOnly precision={0.5} />

                    <div className="d-flex">
                        <span className="discountPrice">₹ 49,999</span>
                        <span className="price text-danger ml-2">₹ 44,999</span>
                    </div>

                </div>
            </div>
            {
                isOpenProductmodal === true &&
                <ProductModal
                    isOpenModal={isOpenProductmodal}
                    setIsOpenModal={setisOpenProductmodal}
                />
            }
        </>
    )
}

export default ProductItem