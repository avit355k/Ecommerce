import React, {useRef} from "react";
import {emphasize, styled} from "@mui/material/styles";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Chip from "@mui/material/Chip";
import Rating from '@mui/material/Rating';
import Button from '@mui/material/Button';

import {MdBrandingWatermark, MdPublishedWithChanges,} from "react-icons/md";
import {TbBasketUp, TbCategoryFilled, TbCoinRupeeFilled,} from "react-icons/tb";
import {FaReply, FaStar, FaTag, FaTextWidth} from "react-icons/fa";
import {IoMdColorPalette} from "react-icons/io";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import UserAvatar from "../../components/UserAvatar";

const StyledBreadcrumb = styled(Chip)(({theme}) => ({
    backgroundColor: theme.palette.grey[100],
    height: theme.spacing(3),
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightRegular,
    "&:hover, &:focus": {
        backgroundColor: emphasize(theme.palette.grey[100], 0.06),
    },
    "&:active": {
        boxShadow: theme.shadows[1],
        backgroundColor: emphasize(theme.palette.grey[100], 0.12),
    },
}));

const images = [
    "https://assets.myntassets.com/h_720,q_90,w_540/v1/assets/images/2025/JUNE/3/QgH2Akno_ac25b2519e434be6ac5afc8a8ec91c1d.jpg",
    "https://assets.myntassets.com/h_720,q_90,w_540/v1/assets/images/2025/JUNE/3/bzmL4tPE_ce20e0069c5a4898a58398964135c66e.jpg",
    "https://assets.myntassets.com/h_720,q_90,w_540/v1/assets/images/2025/JUNE/3/U7o1paRm_33e77e1a85a745ddaf90538d596cb934.jpg",
    "https://assets.myntassets.com/h_720,q_90,w_540/v1/assets/images/2025/JUNE/3/QRtuLiGT_337fe86857f746c4806a0ca9964bbc25.jpg",
];

const ProductDetails = () => {

    const bigSlider = useRef(null);
    const smallSlider = useRef(null);

    const productSliderOptions = {
        arrows: false,
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        asNavFor: smallSlider.current,
    };

    const productSmlSliderOptions = {
        arrows: false,
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        focusOnSelect: true,
        asNavFor: bigSlider.current,
        responsive: [
            {breakpoint: 992, settings: {slidesToShow: 3}},
            {breakpoint: 576, settings: {slidesToShow: 2}},
        ],
    };

    return (
        <div className="right-content w-100">

            {/* Header */}
            <div className="card  border-0 w-100 d-flex flex-row align-items-center p-4">
                <h5 className="mb-0">Product View</h5>

                <Breadcrumbs className="ms-auto breadcrumb_">
                    <StyledBreadcrumb label="Dashboard"/>
                    <StyledBreadcrumb label="Product"/>
                    <StyledBreadcrumb label="Product View"/>
                </Breadcrumbs>
            </div>

            {/* Product Details */}
            <div className="card mt-3 p-3 productDetailsSection">
                <div className="row">
                    <div className="col-md-5">
                        <div className="sliderWrapper pt-3 pb-3 pl-3 pr-3">
                            <h4 className="mb-3">Product Gallery</h4>
                            <Slider {...productSliderOptions} ref={bigSlider} className="sliderBig">
                                {images.map((img, i) => (
                                    <div className="item" key={i}>
                                        <img src={img} alt={`product-${i}`}/>
                                    </div>
                                ))}
                            </Slider>


                            <Slider
                                {...productSmlSliderOptions}
                                ref={smallSlider}
                                className="sliderSm mt-3"
                            >
                                {images.map((img, i) => (
                                    <div className="item" key={i}>
                                        <img src={img} alt={`thumb-${i}`}/>
                                    </div>
                                ))}
                            </Slider>
                        </div>
                    </div>

                    <div className="col-md-7 ">
                        <div className="sliderWrapper pt-3 pb-3 pl-3 pr-3">
                            <h4 className="mb-3">Product Details</h4>

                            <p className="text-muted">Zari Sequence Thread Cording Embroidered Flared Maxi Gown</p>

                            <div className="productInfo">
                                <div className="row mb-2">
                                    <div className="col-sm-3 d-flex align-items-center">
                                        <span className="icon"><MdBrandingWatermark/></span>
                                        <span className="name">Brand</span>
                                    </div>
                                    <div className="col-sm-9">
                                        <span> Sangaria </span>
                                    </div>
                                </div>
                                <div className="row mb-2">
                                    <div className="col-sm-3 d-flex align-items-center">
                                        <span className="icon"><TbCategoryFilled/></span>
                                        <span className="name">Category</span>
                                    </div>
                                    <div className="col-sm-9">
                                        <span> Womens </span>
                                    </div>
                                </div>
                                <div className="row mb-2">
                                    <div className="col-sm-3 d-flex align-items-center">
                                        <span className="icon"><FaTag/></span>
                                        <span className="name">Tag</span>
                                    </div>
                                    <div className="col-sm-9">
                                        <span>
                                            <ul className="list list-inline tags sml">
                                                <li className="list-inline-item"> <span>Silk</span></li>
                                                <li className="list-inline-item"> <span>Festive</span></li>
                                                <li className="list-inline-item"> <span>Embroidered</span></li>
                                                <li className="list-inline-item"> <span>Ethnic</span></li>
                                            </ul>
                                        </span>
                                    </div>
                                </div>
                                <div className="row mb-2">
                                    <div className="col-sm-3 d-flex align-items-center">
                                        <span className="icon"><IoMdColorPalette/></span>
                                        <span className="name">Colour</span>
                                    </div>
                                    <div className="col-sm-9">
                                        <span>
                                             <ul className="list list-inline tags sml">
                                                <li className="list-inline-item"> <span>Orange</span></li>
                                                <li className="list-inline-item"> <span>Red</span></li>
                                            </ul>
                                        </span>
                                    </div>
                                </div>
                                <div className="row mb-2">
                                    <div className="col-sm-3 d-flex align-items-center">
                                        <span className="icon"><FaTextWidth/></span>
                                        <span className="name">Size</span>
                                    </div>
                                    <div className="col-sm-9">
                                        <span>
                                            <ul className="list list-inline tags sml">
                                                <li className="list-inline-item"> <span>S</span></li>
                                                <li className="list-inline-item"> <span>M</span></li>
                                                <li className="list-inline-item"> <span>L</span></li>
                                                <li className="list-inline-item"> <span>Xl</span></li>
                                            </ul>
                                        </span>
                                    </div>
                                </div>
                                <div className="row mb-2">
                                    <div className="col-sm-3 d-flex align-items-center">
                                        <span className="icon"><TbCoinRupeeFilled/></span>
                                        <span className="name">Price</span>
                                    </div>
                                    <div className="col-sm-9">
                                        <span>
                                            <ul className="list list-inline price">
                                                <li className="list-inline-item">
                                                    <span className="newPrice text-success">999</span>
                                                </li>
                                                <li className="list-inline-item">
                                                    <span className="oldPrice ">1199</span>
                                                </li>
                                            </ul>
                                        </span>
                                    </div>
                                </div>
                                <div className="row mb-2">
                                    <div className="col-sm-3 d-flex align-items-center">
                                        <span className="icon"><TbBasketUp/></span>
                                        <span className="name">Stock</span>
                                    </div>
                                    <div className="col-sm-9">
                                        <span> 238</span>
                                    </div>
                                </div>
                                <div className="row mb-2">
                                    <div className="col-sm-3 d-flex align-items-center">
                                        <span className="icon"><FaStar/></span>
                                        <span className="name">Review</span>
                                    </div>
                                    <div className="col-sm-9">
                                        <span> (103) Review</span>
                                    </div>
                                </div>
                                <div className="row mb-2">
                                    <div className="col-sm-3 d-flex align-items-center">
                                        <span className="icon"><MdPublishedWithChanges/></span>
                                        <span className="name">Published</span>
                                    </div>
                                    <div className="col-sm-9">
                                        <span> 02 Feb 2022</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                <div className="p-4">
                    <h4 className="mt-4 mb-2">Product Description</h4>
                    <p>
                        Orange-colored ethnic Dress
                        Embroidered
                        Fit and Flared Shaped
                        Round neck
                        Three-quarter regular sleeves
                        Flared hem
                        Slip-on closure
                        Size & Fit
                        The model (height 5'8") is wearing a size S
                        Material & Care
                        Silk clean only
                    </p>

                    <br/>
                    <h4 className="mt-4 ">Rating Analysis</h4>
                    <div className="ratingSection mt-2">
                        <div className="ratingRow d-flex align-items-center">
                            <span className="col-1">5 Star</span>
                            <div className="col-2">
                                <div className="progress">
                                    <div className="progress-bar" style={{width: '80%'}}></div>
                                </div>
                            </div>
                            <span className="col-3 p-5">(22)</span>
                        </div>

                    </div>
                    <div className="ratingSection mt-2">
                        <div className="ratingRow d-flex align-items-center">
                            <span className="col-1">4 Star</span>
                            <div className="col-2">
                                <div className="progress">
                                    <div className="progress-bar" style={{width: '70%'}}></div>
                                </div>
                            </div>
                            <span className="col-3 p-5">(50)</span>
                        </div>

                    </div>
                    <div className="ratingSection mt-2">
                        <div className="ratingRow d-flex align-items-center">
                            <span className="col-1">3 Star</span>
                            <div className="col-2">
                                <div className="progress">
                                    <div className="progress-bar" style={{width: '20%'}}></div>
                                </div>
                            </div>
                            <span className="col-3 p-5">(30)</span>
                        </div>

                    </div>
                    <div className="ratingSection mt-2">
                        <div className="ratingRow d-flex align-items-center">
                            <span className="col-1">2 Star</span>
                            <div className="col-2">
                                <div className="progress">
                                    <div className="progress-bar" style={{width: '30%'}}></div>
                                </div>
                            </div>
                            <span className="col-3 p-5">(12)</span>
                        </div>

                    </div>
                    <div className="ratingSection mt-2">
                        <div className="ratingRow d-flex align-items-center">
                            <span className="col-1">1 Star</span>
                            <div className="col-2">
                                <div className="progress">
                                    <div className="progress-bar" style={{width: '70%'}}></div>
                                </div>
                            </div>
                            <span className="col-3 p-5">(2)</span>
                        </div>

                    </div>
                </div>

                <div className="p-4">
                    <h4 className="mt-4 mb-3">Customer's Reviews</h4>
                    <div className="reviewSection">
                        <div className="reviewRow">
                            <div className="row align-items-start">

                                {/* LEFT SIDE */}
                                <div className="col-sm-9">
                                    <div className="d-flex align-items-center mb-2">
                                        <div className="userInfo">
                                            <UserAvatar/>

                                            <div className="info px-2">
                                                <h6>Anand Bagchi</h6>
                                                <span>25 min ago</span>
                                            </div>
                                        </div>
                                    </div>

                                    <Rating
                                        name="half-rating-read"
                                        defaultValue={4.5}
                                        precision={0.5}
                                        readOnly
                                    />

                                    <p>
                                        Product is also too good but price is very very good
                                    </p>
                                </div>

                                {/* RIGHT SIDE */}
                                <div className="col-sm-3 d-flex justify-content-end">
                                    <Button className="replyBtn" variant="contained">
                                        <FaReply className="me-2"/> Reply
                                    </Button>
                                </div>

                            </div>
                        </div>

                        <div className="reviewRow reply">
                            <div className="row align-items-start">

                                {/* LEFT SIDE */}
                                <div className="col-sm-9">
                                    <div className="d-flex align-items-center mb-2">
                                        <div className="userInfo">
                                            <UserAvatar/>

                                            <div className="info px-2">
                                                <h6>Anand Bagchi</h6>
                                                <span>25 min ago</span>
                                            </div>
                                        </div>
                                    </div>

                                    <Rating
                                        name="half-rating-read"
                                        defaultValue={4.5}
                                        precision={0.5}
                                        readOnly
                                    />

                                    <p>
                                        Product is also too good but price is very very good
                                    </p>
                                </div>

                                {/* RIGHT SIDE */}
                                <div className="col-sm-3 d-flex justify-content-end">
                                    <Button className="replyBtn" variant="contained">
                                        <FaReply className="me-2"/> Reply
                                    </Button>
                                </div>

                            </div>
                        </div>
                    </div>
                    <br/>

                </div>

                <div className="p-4">
                    <h4 className="mt-4 mb-3">Review Form</h4>

                    <form className="reviewForm">
                        <textarea className="mb-3">
                           Write Here..
                        </textarea>
                        <Button className="w-100" variant="contained">Drop Your Review</Button>
                    </form>
                </div>
            </div>

        </div>);
}

export default ProductDetails;
