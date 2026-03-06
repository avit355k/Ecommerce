import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

import {Swiper, SwiperSlide} from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import {Navigation} from 'swiper/modules';

import API from "../../Services/api"


const Homecat = () => {
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchFeaturedCategories();
    }, []);

    //fetched featured categories
    const fetchFeaturedCategories = async () => {
        try {
            const res = await API.get("/api/category/featured/");
            if (res.data.success) {
                setCategories(res.data.data);
            }
        } catch (error) {
            console.error("Error fetching featured categories", error);
        }
    };


    return (
        <section className="homecat">
            <div className="container">
                <h3 className='mb-4 hd'>Featured Category</h3>
                <Swiper
                    slidesPerView={10}
                    spaceBetween={15}
                    navigation={true}
                    slidesPerGroup={1}
                    modules={[Navigation]}
                    className="mySwiper"
                    breakpoints={{
                        320: { // small phones
                            slidesPerView: 3,
                            spaceBetween: 10,
                        },
                        480: { // larger phones
                            slidesPerView: 4,
                            spaceBetween: 12,
                        },
                        768: { // tablets
                            slidesPerView: 6,
                            spaceBetween: 15,
                        },
                        1024: { // desktops
                            slidesPerView: 8,
                            spaceBetween: 15,
                        },
                        1280: { // large desktops
                            slidesPerView: 10,
                            spaceBetween: 15,
                        },
                    }}
                >
                    {categories.map((cat) => (
                        <SwiperSlide key={cat._id}>
                            <div className="item text-center cursor" style={{backgroundColor: cat.color || "#f5f5f5"}}
                                 onClick={() => navigate(`/category/${cat.slug}`)}
                            >
                                <img src={cat.image.url} alt={cat.name}/>

                            </div>
                            <h6>{cat.name}</h6>
                        </SwiperSlide>
                    ))}
                </Swiper>

            </div>
        </section>
    )
}

export default Homecat