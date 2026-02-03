import React from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";


const Homebanner = () => {
    var settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        spaceBetween:1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        arrows: true,
    };
    return (
     <div className="container mt-2">
           <div className="homeBannerSection">
            <Slider {...settings}>
                 <div className="item">
                    <img src="/Banner/smartphone_banner.jpg" className="w-100" />
                </div>
                <div className="item">
                    <img src="/Banner/banner1.png" className="w-100" />
                </div>
                <div className="item">
                    <img src="/Banner/banner2.png" className="w-100" />
                </div>
                <div className="item">
                    <img src="/Banner/Furniture.png" className="w-100" />
                </div>
                <div className="item">
                    <img src="/Banner/banner4.png" className="w-100" />
                </div>
                <div className="item">
                     <Link to="/fashion">
                        <img src="/Banner/banner5.png" className="w-100" alt="Fashion" />
                    </Link>
                </div>
                 <div className="item">
                     <Link to="/Grocery">
                        <img src="/Banner/Grocery.jpg" className="w-100" alt="Grocery" />
                    </Link>
                </div>
            </Slider>
        </div>
     </div>
    )
}

export default Homebanner 