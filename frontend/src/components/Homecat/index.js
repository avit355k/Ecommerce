import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';


const Homecat = () => {
    const categories = [
        { name: "Fruits & Vegetables", img: "/FeaturedProducts/fruits.png" },
        { name: "Atta, Rice &Oil ", img: "/FeaturedProducts/atta.png" },
        { name: "Masala & Dry Fruits", img: "/FeaturedProducts/masala.png" },
        { name: "Snacks", img: "/FeaturedProducts/snacks.png" },
        { name: "Sweet Cravings", img: "/FeaturedProducts/chocolate.png" },
        { name: "Toys & Sports", img: "/FeaturedProducts/fruits.png" },
        { name: "Apparel & Lifestyle", img: "/FeaturedProducts/fruits.png" },
        { name: "Jewellery & Accessories", img: "/FeaturedProducts/fruits.png" },
        { name: "Frozen Food", img: "/FeaturedProducts/fruits.png" },
        { name: "Ice Creams & More", img: "/FeaturedProducts/fruits.png" },
        { name: "Frozen Food", img: "/FeaturedProducts/fruits.png" },
        { name: "Ice Creams & More", img: "/FeaturedProducts/fruits.png" },
    ];
    return (
        <section className="homecat">
            <div className="container">
                <h3 className='mb-4 hd'>Featured Category</h3>
                <Swiper
                    slidesPerView={10}
                    spaceBetween={5}
                    navigation={true}
                    slidesPerGroup={1}
                    modules={[Navigation]}
                    className="mySwiper"
                >
                    {categories.map((cat, index) => (
                        <SwiperSlide key={index}>
                            <div className="item text-center cursor">
                                <img src={cat.img} alt={cat.name} />
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