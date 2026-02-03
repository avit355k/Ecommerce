import React, { useState } from "react";
import Button from "@mui/material/Button";
import Rating from '@mui/material/Rating';
import { CiHeart } from "react-icons/ci";
import { IoMdSwap } from "react-icons/io";
import ProductZoom from '../../components/ProductZoom';
import QuantityBox from '../../components/QuantityBox';
import RelatedProducts from "./Relatedproducts";
import LinearProgress from "@mui/material/LinearProgress";


const ProductDetails = () => {

    const currentProduct = {
        size: ["4GB", "8GB", "12GB"],
        description: "Dynamic Island bubbles up alerts and Live Activities — so you don’t miss them while you’re doing something else. You can track your next ride, see who’s calling, check your flight status, and so much more."
    };

    const [activeTabs, setActiveTabs] = useState(0);
    // State for selected size
    const [selectedSize, setSelectedSize] = useState(null);

    const [reviewsArr, setReviewsArr] = useState([
        { review: "Amazing phone with smooth performance!", rating: 5 },
        { review: "Battery life could have been better.", rating: 3.5 },
        { review: "The camera quality is outstanding.", rating: 4.5 },
    ]);


    const [newReview, setNewReview] = useState("");
    const [newRating, setNewRating] = useState(0);

    // ✅ Submit review handler
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

    return (
        <section className="product_details section">
            <div className='container'>

                <div className='row'>
                    <div className='col-md-4 pl-5'>
                        <ProductZoom />
                    </div>
                    <div className='col-md-7 pl-5 pr-5'>
                        <h2 className='hd text-capitalize'>Apple iPhone 15 256GB Black</h2>
                        <ul className='list list-inline d-flex align-items-center mt-2 '>
                            <li className='list-inline-item'>
                                <div className='d-flex align-items-center mr-4'>
                                    <span className='text-light'>Brands:</span>
                                    <span className='text-dark ml-2'>Apple</span>
                                </div>
                            </li>
                            <li className='list-inline-item'>
                                <div className='d-flex align-items-center'>
                                    <Rating name="read-only" value={5} readOnly size="small" precision={0.5} />
                                    <span className='ml-2 cursor'>6 Review</span>
                                </div>
                            </li>
                        </ul>

                        <div className="d-flex info align-items-center mb-3">
                            <span className="discountPrice">₹ 49,999</span>
                            <span className="price text-danger ml-2">₹ 44,999</span>
                        </div>

                        <span className="text-success d-block">In Stock</span>

                        <p className="mt-2">Dynamic Island bubbles up alerts and Live Activities —
                            so you don’t miss them while you’re doing something else. You can track your next ride,
                            see who’s calling, check your flight status, and so much more.
                        </p>

                        {/* RAM Selection */}
                        <div className="productSize d-flex align-items-center">
                            <span className="text-dark">RAM:</span>
                            <ul className="list list-inline mb-0 pl-4">
                                {currentProduct.size.map((size, index) => (
                                    <li key={index} className="list-inline-item mr-3">
                                        <Button
                                            variant={selectedSize === size ? "contained" : "outlined"}
                                            size="small"
                                            onClick={() =>
                                                setSelectedSize(selectedSize === size ? null : size)
                                            }
                                            sx={{ borderRadius: "20px", minWidth: "60px" }}
                                        >
                                            {size}
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        </div>



                        <div className="d-flex align-items-center mt-4">
                            <QuantityBox />
                            <Button className="btn-blue btn-lg btn-big btn-round ml-3">Add to Cart</Button>

                        </div>

                        <div className="d-flex align-items-center mt-5">
                            <Button className="btn-round btn-sml actions" variant="outlined">
                                <CiHeart />&nbsp;Add to Wishlist
                            </Button>
                            <Button className="btn-round btn-sml actions ml-3" variant="outlined">
                                <IoMdSwap /> &nbsp;Compare
                            </Button>
                        </div>
                    </div>
                </div>

                <br />
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
                        <br />
                        {activeTabs === 0 && (
                            <div className="tabContent">
                                <p>{currentProduct.description}</p>
                            </div>
                        )}

                        {activeTabs === 1 && (
                            <div className="tabContent">
                                <div className="table-responsive">
                                    <table className="table table-bordered">
                                        <tbody>
                                            <tr className="stand-up">
                                                <th>Stand Up</th>
                                                <td><p>35″L x 24″W x 37-45″H (front to back wheel)</p></td>
                                            </tr>
                                            <tr className="folded">
                                                <th>Folded</th>
                                                <td><p>32″L x 24″W x 14″H (front to back wheel)</p></td>
                                            </tr>
                                            <tr className="stand-up">
                                                <th>Stand Up</th>
                                                <td><p>35″L x 24″W x 37-45″H (front to back wheel)</p></td>
                                            </tr>
                                            <tr className="stand-up">
                                                <th>Stand Up</th>
                                                <td><p>35″L x 24″W x 37-45″H (front to back wheel)</p></td>
                                            </tr>
                                            <tr className="stand-up">
                                                <th>Stand Up</th>
                                                <td><p>35″L x 24″W x 37-45″H (front to back wheel)</p></td>
                                            </tr>
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
                                        <br />

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
                                        <br />
                                        <br />
                                        <div className="rating-summary">
                                            <h4>Customer Rating</h4>
                                            <div className="overall-rating d-flex align-items-center">
                                                <Rating value={4.8} precision={0.1} readOnly />
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

                <br />
                {/* RELATED PRODUCTS */}
                <RelatedProducts title="Related Products" />

                <RelatedProducts title="Recently Viewed" />
            </div>
        </section >
    )
}

export default ProductDetails