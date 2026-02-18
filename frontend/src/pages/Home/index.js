import {useEffect, useState} from "react";

import Button from "@mui/material/Button";
import {FaAnglesRight} from "react-icons/fa6";

import {Swiper, SwiperSlide} from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import {Navigation} from 'swiper/modules';

import ProductItem from "../../components/ProductItem";
import Homebanner from "../../components/HomeBanner";
import Homecat from "../../components/Homecat";
import API from "../../Services/api";

const Home = () => {

    const [newProducts, setNewProducts] = useState([]);
    const [topDeals, setTopDeals] = useState([]);

    //fetch top deals products
    useEffect(() => {
        const getTopDeals = async () => {
            try {
                const {data} = await API.get("/api/topDeals/");

                if (data.success) {
                    setTopDeals(data.data);
                }
            } catch (error) {
                console.error("To deals Products error", error);
            }
        };
        getTopDeals();
    }, []);

    //fetch new products
    useEffect(() => {
        const fetchNewProducts = async () => {
            try {
                const {data} = await API.get("/api/newProduct/");

                if (data.success) {
                    setNewProducts(data.data);
                }
            } catch (error) {
                console.error("New product error", error);
            }
        };

        fetchNewProducts();
    }, []);

    return (
        <>
            <Homebanner/>
            <Homecat/>

            <section className="homeProducts">
                <div className="container">
                    <div className="row">
                        <div className="col-md-3 ">
                            <div className="sticky">
                                <div className="banner">
                                    <img src="https://api.spicezgold.com/download/file_1734525757507_NewProject(34).jpg"
                                         className="cursor w-100"/>
                                </div>

                                <div className="banner mt-4">
                                    <img src="https://api.spicezgold.com/download/file_1734525767798_NewProject(35).jpg"
                                         className="cursor w-100"/>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-9 productRow">

                            <div className="d-flex align-items-center ">

                                <div className="info w-75">
                                    <h3 className="mb-1 hd">Top Deals For You</h3>
                                    <p className="">Do not miss the current offers</p>
                                </div>

                                <Button className="viewAllBtn ml-auto">
                                    View All
                                    <FaAnglesRight/>
                                </Button>
                            </div>

                            <div className="product_row w-100 mt-2">
                                <Swiper
                                    slidesPerView={4}
                                    spaceBetween={10}
                                    navigation={true}
                                    slidesPerGroup={1}
                                    modules={[Navigation]}
                                    className="mySwiper"
                                >
                                    {topDeals.map(product => (
                                        <SwiperSlide key={product._id}>
                                            <ProductItem product={product}/>
                                        </SwiperSlide>
                                    ))}

                                </Swiper>
                            </div>

                            <div className="d-flex align-items-center">
                                <div className="info w-75 mt-4">
                                    <h3 className="mb-1 hd">New Products</h3>
                                    <p className="">New products with updated stocks.</p>
                                </div>

                                <Button className="viewAllBtn ml-auto">
                                    View All
                                    <FaAnglesRight/>
                                </Button>

                            </div>

                            <div className="product_row w-100 mt-2">
                                <Swiper
                                    slidesPerView={4}
                                    spaceBetween={10}
                                    navigation={true}
                                    slidesPerGroup={1}
                                    modules={[Navigation]}
                                    className="mySwiper"
                                >
                                    {newProducts.map(product => (
                                        <SwiperSlide key={product._id}>
                                            <ProductItem product={product}/>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </div>

                            <div className="product_row product_row2 w-100 mt-4 d-flex">
                                <ProductItem/>
                                <ProductItem/>
                                <ProductItem/>
                                <ProductItem/>
                                <ProductItem/>
                                <ProductItem/>
                                <ProductItem/>
                                <ProductItem/>
                            </div>

                            <div className="d-flex mt-4 mb-5 bannerSec">
                                <div className="banner ">
                                    <img
                                        src="https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=720/layout-engine/2023-07/pharmacy-WEB.jpg"
                                        className="cursor w-100"/>
                                </div>
                                <div className="banner ">
                                    <img
                                        src="https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=720/layout-engine/2023-07/Pet-Care_WEB.jpg"
                                        className="cursor w-100"/>
                                </div>
                            </div>

                        </div>

                    </div>
                </div>
            </section>

            <section className="newsStallerSection mt-3 mb-3">
                <div className="container ">
                    <div className="row  align-items-center">

                        {/* leftText Section */}
                        <div className="col-md-6 text-white d-flex flex-column justify-content-center p-5">
                            <img src="/axis-bank-seeklogo.png" alt="Axis Bank Logo" className="mb-3"
                                 style={{width: '150px'}}/>
                            <h2 className="mb-3 fw-bold">Switch to Axis Bank Credit Card</h2>
                            <p className="mb-4">
                                Discover our latest collection with unbeatable offers.
                                Additional 5% discount on axis band credit card
                            </p>
                            <a href="/" className="btn btn-light fw-semibold px-4 py-2">
                                Check Out
                            </a>
                        </div>

                        {/* right Image Card */}
                        <div className="col-md-6 d-flex flex-column align-items-center justify-content-center p-4">
                            <div className="card border-0" style={{maxWidth: '320px'}}>
                                <img
                                    src="/image (1).png"
                                    alt="Axis Bank Credit Card"
                                    className="img-fluid rounded"
                                />
                            </div>
                            <h5 className="mt-2 fw-semibold">
                                Rewards Styles Ready For you
                            </h5>
                        </div>
                    </div>
                </div>
            </section>


        </>
    );
}

export default Home;
