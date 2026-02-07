import {useState} from "react";
import {useNavigate} from "react-router-dom";

import Button from "@mui/material/Button";
import Rating from "@mui/material/Rating";

import {TfiFullscreen} from "react-icons/tfi";
import {IoIosHeartEmpty} from "react-icons/io";

import ProductModal from "../ProductModal";

const ProductItem = ({product, itemView}) => {

    const [isOpenProductmodal, setIsOpenProductmodal] = useState(false);
    const navigate = useNavigate();

    if (!product) return null;

    const goToProduct = () => {
        navigate(`/product/${product._id}`);
    };


    return (
        <>
            <div className={`item productItem ${itemView}`}>
                <div className="imgWrapper">
                    <img
                        src={
                            product.images?.[0]?.url
                        }
                        className="w-100"
                        alt={product.name}
                    />

                    {product.discountPercent > 0 && (
                        <span className="badge badge-primary">
                        {product.discountPercent}%
                    </span>
                    )}

                    <div className="actions">
                        <Button onClick={() => setIsOpenProductmodal(true)}>
                            <TfiFullscreen/>
                        </Button>
                        <Button><IoIosHeartEmpty/></Button>
                    </div>
                </div>

                <div className="info" onClick={goToProduct} style={{cursor: "pointer"}}>
                    <h4>{product.name}</h4>

                    <span className={`d-block ${
                        product.countInStock > 0 ? "text-success" : "text-danger"}`}
                    >
                        {product.countInStock > 0 ? "In Stock" : "Out of Stock"}
                    </span>

                    <Rating className="mt-2 mb-2" name="read-only" value={5} size="small" readOnly precision={0.5}/>

                    <div className="d-flex">
                        <span className="price">₹ {product.price}</span>
                        <span
                            className="discountPrice text-danger ml-2">₹ {product.discountedPrice || product.price}</span>
                    </div>

                </div>
            </div>

            {isOpenProductmodal && (
                <ProductModal
                    product={product}
                    isOpenModal={isOpenProductmodal}
                    setIsOpenModal={setIsOpenProductmodal}
                />
            )}
        </>
    )
}

export default ProductItem