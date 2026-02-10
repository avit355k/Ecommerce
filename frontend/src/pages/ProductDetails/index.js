import React, {useContext, useEffect, useState} from "react";
import {useParams} from "react-router-dom";

import Button from "@mui/material/Button";
import Rating from '@mui/material/Rating';
import LinearProgress from "@mui/material/LinearProgress";

import {CiHeart} from "react-icons/ci";
import {IoMdSwap} from "react-icons/io";

import ProductZoom from '../../components/ProductZoom';
import QuantityBox from '../../components/QuantityBox';
import RelatedProducts from "./Relatedproducts";

import API from '../../Services/api';
import {mycontext} from "../../App";

const ProductDetails = () => {
    const {id} = useParams();

    const {setIsLogin, cartData, setCartData} = useContext(mycontext);


    const [loading, setLoading] = useState(true);
    const [product, setProduct] = useState(null);
    const [variants, setVariants] = useState([]);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [selectedAttributes, setSelectedAttributes] = useState({});
    const [quantity, setQuantity] = useState(1);


    const [activeTabs, setActiveTabs] = useState(0);

    //fetch product details
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const {data} = await API.get(`/api/catalog/product/${id}`);
                if (data.success) {
                    setProduct(data.data.product);
                    console.log(data.data.product);
                    setVariants(data.data.variants);
                    console.log(data.data.variants);

                    // auto select first variant
                    if (data.data.variants.length > 0) {
                        setSelectedVariant(data.data.variants[0]);
                        const firstVariant = data.data.variants[0];
                        setSelectedVariant(firstVariant);
                        setSelectedAttributes(firstVariant.attributes || {});

                    }
                }
            } catch (error) {
                console.error("Failed to load product", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    //group attributes
    const getAttributeMap = () => {
        const attrMap = {};

        variants.forEach((variant) => {
            Object.entries(variant.attributes || {}).forEach(([key, value]) => {
                if (!attrMap[key]) attrMap[key] = new Set();
                attrMap[key].add(value);
            });
        });

        Object.keys(attrMap).forEach(
            (key) => (attrMap[key] = Array.from(attrMap[key]))
        );

        return attrMap;
    };
    // check if attribute option is valid with current selection
    const isOptionCompatible = (attrName, attrValue) => {
        return variants.some((variant) => {

            return Object.entries(selectedAttributes).every(([key, value]) => {
                if (key === attrName) return variant.attributes[key] === attrValue;
                return variant.attributes[key] === value;
            });
        });
    };
    //handle attributes click
    const handleAttributeSelect = (attrName, attrValue) => {
        const targetAttrs = {
            ...selectedAttributes,
            [attrName]: attrValue
        };

        let matchedVariant = variants.find((variant) =>
            Object.entries(targetAttrs).every(
                ([key, value]) => variant.attributes?.[key] === value
            )
        );

        // fallback to closest valid variant
        if (!matchedVariant) {
            matchedVariant = variants.find(
                (variant) => variant.attributes?.[attrName] === attrValue
            );
        }

        if (matchedVariant) {
            setSelectedVariant(matchedVariant);
            setSelectedAttributes(matchedVariant.attributes);
        }
    };

    //reset quantity
    useEffect(() => {
        setQuantity(1);
    }, [selectedVariant]);
    //handel add to cart
    const handleAddToCart = async () => {
        try {
            const token = sessionStorage.getItem("token");

            if (!token) {
                setIsLogin(false); // open login modal
                return;
            }

            if (!selectedVariant) {
                alert("Please select a variant");
                return;
            }

            const payload = {
                productId: product._id,
                variantId: selectedVariant._id,
                quantity
            };

            const {data} = await API.post(
                "/api/cart/add-to-cart",
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (data.success) {
                const price =
                    selectedVariant.discountedPrice ??
                    selectedVariant.price;

                setCartData({
                    totalItems: cartData.totalItems + quantity,
                    totalPrice: cartData.totalPrice + price * quantity
                });
                alert("Added to cart 🛒");
            }
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "Failed to add to cart");
        }
    };

    //review array
    const [reviewsArr, setReviewsArr] = useState([
        {review: "Amazing phone with smooth performance!", rating: 5},
        {review: "Battery life could have been better.", rating: 3.5},
        {review: "The camera quality is outstanding.", rating: 4.5},
    ]);

    const [newReview, setNewReview] = useState("");
    const [newRating, setNewRating] = useState(0);

    //  Submit review handler
    const submitReview = (e) => {
        e.preventDefault();
        if (newReview.trim() === "" || newRating === 0) {
            alert("Please enter review text and rating.");
            return;
        }

        const reviewObj = {
            review: newReview,
            rating: newRating,
        };

        setReviewsArr([...reviewsArr, reviewObj]);
        setNewReview("");
        setNewRating(0);
    };

    if (loading) return <p className="text-center mt-5">Loading...</p>;
    if (!product) return <p className="text-center mt-5">Product not found</p>;

    return (
        <section className="product_details section">
            <div className='container'>

                <div className='row'>
                    <div className='col-md-4 pl-5'>
                        <ProductZoom
                            images={product.images}
                            discountPercent={selectedVariant?.discountPercent}
                        />
                    </div>

                    <div className='col-md-7 pl-5 pr-5'>
                        <h2 className='hd text-capitalize'>{product.name}</h2>
                        <ul className='list list-inline d-flex align-items-center mt-2 '>
                            <li className='list-inline-item'>
                                <div className='d-flex align-items-center mr-4'>
                                    <span className=''>Brands:</span>
                                    <span className='text-dark ml-2'>{product.brand}</span>
                                </div>
                            </li>
                            <li className='list-inline-item'>
                                <div className='d-flex align-items-center'>
                                    <Rating name="read-only" value={5} readOnly size="small" precision={0.5}/>
                                    <span className='ml-2 cursor'>6 Review</span>
                                </div>
                            </li>
                        </ul>

                        <div className="d-flex info align-items-center mb-3">
                            <span
                                className="discountPrice">₹ {selectedVariant?.discountedPrice ?? selectedVariant?.price}</span>
                            {selectedVariant?.discountedPrice && (
                                <span className="price text-danger ml-2">₹ {selectedVariant.price}</span>
                            )}
                        </div>

                        <span
                            className={`d-block ${selectedVariant?.countInStock > 0
                                ? "text-success"
                                : "text-danger"
                            }`}
                        >
                            {selectedVariant?.countInStock > 0
                                ? "In Stock"
                                : "Out of Stock"}
                        </span>

                        <p className="mt-2">{product.description} </p>

                        {/* VARIANTS */}
                        {Object.entries(getAttributeMap()).map(([attrName, values]) => (
                            <div key={attrName} className="productVarient d-flex align-items-center mb-3">
                                <span className="text-dark" style={{minWidth: "80px"}}>
                                    {attrName}:
                                </span>

                                <ul className="list list-inline mb-0 pl-4">
                                    {values.map((value) => {
                                        const isSelected = selectedAttributes[attrName] === value;
                                        const isCompatible = isOptionCompatible(attrName, value);

                                        return (
                                            <li key={value} className="list-inline-item mr-3">
                                                <Button
                                                    size="small"
                                                    // We REMOVE 'disabled' so it's always clickable
                                                    variant={isSelected ? "contained" : "outlined"}
                                                    onClick={() => handleAttributeSelect(attrName, value)}
                                                    sx={{
                                                        borderRadius: "20px",
                                                        minWidth: "70px",
                                                        textTransform: "none",
                                                        // Visual hint: if it's not compatible with current
                                                        // selection, we make it look faded.
                                                        opacity: isCompatible ? 1 : 0.4,
                                                        fontWeight: isSelected ? "bold" : "normal",
                                                        border: isSelected ? "2px solid #0858f7" : "1px solid #ccc",
                                                        "&:hover": {
                                                            opacity: 1
                                                        }
                                                    }}
                                                >
                                                    {value}
                                                </Button>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        ))}


                        <div className="d-flex align-items-center mt-4">
                            <QuantityBox
                                value={quantity}
                                setValue={setQuantity}
                                max={selectedVariant?.countInStock}
                            />
                            <Button
                                className={`btn-blue btn-lg btn-big btn-round ml-3 ${
                                    selectedVariant?.countInStock === 0 ? "btn-disabled" : ""
                                }`}
                                disabled={selectedVariant?.countInStock === 0}
                                onClick={handleAddToCart}
                            >
                                Add to Cart
                            </Button>


                        </div>

                        <div className="d-flex align-items-center mt-5">
                            <Button className="btn-round btn-sml actions" variant="outlined">
                                <CiHeart/>&nbsp;Add to Wishlist
                            </Button>
                            <Button className="btn-round btn-sml actions ml-3" variant="outlined">
                                <IoMdSwap/> &nbsp;Compare
                            </Button>
                        </div>
                    </div>
                </div>

                <br/>
                <div className="card mt-5 p-5 detailspageTabs">
                    <div className="customTabs">
                        <ul className="list list-inline">
                            <li className="list-inline-item">
                                <Button
                                    className={activeTabs === 0 ? "active" : ""}
                                    onClick={() => setActiveTabs(0)}
                                >
                                    Description
                                </Button>
                            </li>
                            <li className="list-inline-item">
                                <Button
                                    className={activeTabs === 1 ? "active" : ""}
                                    onClick={() => setActiveTabs(1)}
                                >
                                    Additional Info
                                </Button>
                            </li>
                            <li className="list-inline-item">
                                <Button
                                    className={activeTabs === 2 ? "active" : ""}
                                    onClick={() => setActiveTabs(2)}
                                >
                                    Review (6)
                                </Button>
                            </li>
                        </ul>
                        <br/>
                        {activeTabs === 0 && (
                            <div className="tabContent">
                                <p>{product.description}</p>
                            </div>
                        )}

                        {activeTabs === 1 && (
                            <div className="tabContent">
                                <div className="table-responsive">
                                    <table className="table table-bordered">
                                        <tbody>
                                        {Object.entries(product.productDetails || {}).map(
                                            ([key, value]) => (
                                                <tr key={key}>
                                                    <th>{key}</th>
                                                    <td>{value}</td>
                                                </tr>
                                            )
                                        )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* REVIEWS TAB */}
                        {activeTabs === 2 && (
                            <div className="tabContent">
                                <div className="row">
                                    {/* LEFT SIDE: Reviews */}
                                    <div className="col-md-8">
                                        <h3>Customer Reviews</h3>
                                        <br/>

                                        {/* EXISTING REVIEWS */}
                                        {reviewsArr.map((item, index) => (
                                            <div className="reviewsCard" key={index}>
                                                <div className="image">
                                                    <div className="rounded-circle">
                                                        <img
                                                            src="https://secure.gravatar.com/avatar/6b9c65833b765410a0a2b10d37a4dd3e5e552d84ebf8b50a540e389ad270fea8?s=60&d=mm&r=g"
                                                            alt="user"
                                                        />
                                                    </div>
                                                    <span className="text-g d-block text-center font-weight-bold">
                                                        User {index + 1}
                                                    </span>
                                                </div>

                                                <div className="info pl-5">
                                                    <div className="d-flex align-items-center w-100">
                                                        <h5 className="text-light">25/08/2025</h5>
                                                        <div className="ml-auto">
                                                            <Rating
                                                                name="half-rating-read"
                                                                value={item.rating}
                                                                precision={0.5}
                                                                readOnly
                                                            />
                                                        </div>
                                                    </div>
                                                    <p>{item.review}</p>
                                                </div>
                                            </div>
                                        ))}

                                        {/* ADD REVIEW FORM */}
                                        <form className="reviewForm mt-4" onSubmit={submitReview}>
                                            <h4>Add a review</h4>
                                            <Rating
                                                name="user-rating"
                                                value={newRating}
                                                precision={0.5}
                                                onChange={(e, newValue) => setNewRating(newValue)}
                                            />
                                            <textarea
                                                className="form-control mt-2"
                                                placeholder="Write your review..."
                                                value={newReview}
                                                onChange={(e) => setNewReview(e.target.value)}
                                            ></textarea>
                                            <Button
                                                type="submit"
                                                className="btn-blue btn-round mt-3"
                                                variant="contained"
                                            >
                                                Submit Review
                                            </Button>
                                        </form>
                                    </div>

                                    {/* RIGHT SIDE: Rating Summary */}
                                    <div className="col-md-4">
                                        <br/>
                                        <br/>
                                        <div className="rating-summary">
                                            <h4>Customer Rating</h4>
                                            <div className="overall-rating d-flex align-items-center">
                                                <Rating value={4.8} precision={0.1} readOnly/>
                                                <span className="ml-2">4.8 out of 5</span>
                                            </div>

                                            <ul className="rating-bars list-unstyled mt-3">
                                                {[5, 4, 3, 2, 1].map((star, index) => (
                                                    <li key={index} className="d-flex align-items-center mb-2">
                                                        <span className="star-label">{star} star</span>
                                                        <LinearProgress
                                                            variant="determinate"
                                                            value={
                                                                star === 5 ? 75 :
                                                                    star === 4 ? 50 :
                                                                        star === 3 ? 55 :
                                                                            star === 2 ? 35 :
                                                                                25
                                                            }
                                                            sx={{
                                                                flex: 1,
                                                                height: 10,
                                                                borderRadius: 5,
                                                                margin: "0 10px",
                                                                "& .MuiLinearProgress-bar": {
                                                                    backgroundColor: "#28a745"
                                                                }
                                                            }}
                                                        />
                                                        <span className="percent-label">
                                                            {star === 5 ? "75%" :
                                                                star === 4 ? "50%" :
                                                                    star === 3 ? "55%" :
                                                                        star === 2 ? "35%" :
                                                                            "25%"}
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                </div>

                <br/>
                {/* RELATED PRODUCTS */}
                <RelatedProducts title="Related Products"/>

                <RelatedProducts title="Recently Viewed"/>
            </div>
        </section>
    )
}

export default ProductDetails