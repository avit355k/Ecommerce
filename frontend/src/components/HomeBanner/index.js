import React, {useEffect, useState} from "react";
import Slider from "react-slick";
import {Link} from "react-router-dom";
import API from "../../Services/api";


const Homebanner = () => {
    const [banners, setBanners] = useState([]);

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const res = await API.get(
                    "/api/banner/position/homepage"
                );

                if (res.data.success) {
                    setBanners(res.data.banners);
                }
            } catch (error) {
                console.error("Error fetching banners:", error);
            }
        };

        fetchBanners();
    }, []);

    var settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        spaceBetween: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        arrows: true,
    };

    return (
        <div className="container mt-2">
            <div className="homeBannerSection">
                <Slider {...settings}>
                    {banners.map((banner, index) => (
                        <div className="item" key={banner._id}>
                            <Link
                                to={`/${banner.redirect?.type}/${banner.redirect?.value}`}
                            >
                                <img
                                    src={banner.image?.url}
                                    className="w-100"
                                    alt={banner.title}
                                />
                            </Link>
                        </div>
                    ))}

                </Slider>
            </div>
        </div>
    )
}

export default Homebanner; 