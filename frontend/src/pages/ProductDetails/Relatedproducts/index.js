import React, {useEffect, useState} from 'react';
import {Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import {Navigation} from 'swiper/modules';

import ProductItem from '../../../components/ProductItem';
import API from "../../../Services/api";


const RelatedProducts = ({title, productId}) => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchRelatedProducts = async () => {
            try {
                if (!productId) return;

                const {data} = await API.get(
                    `/api/relatedProducts/${productId}`
                );

                if (data.success) {
                    setProducts(data.data);
                }
            } catch (error) {
                console.error("Related products error", error);
            }
        };

        fetchRelatedProducts();

    }, [productId]);

    if (!products || products.length === 0) return null;

    return (
        <>
            <div className="d-flex align-items-center mt-4">
                <div className="info w-75">
                    <h3 className="mb-0 hd">{title}</h3>
                </div>
            </div>

            <div className="product_row w-100 mt-4">
                <Swiper
                    slidesPerView={5}
                    spaceBetween={10}
                    navigation={true}
                    slidesPerGroup={1}
                    modules={[Navigation]}
                    className="mySwiper"
                >
                    {products.map((product) => (
                        <SwiperSlide key={product._id}>
                            <ProductItem product={product}/>
                        </SwiperSlide>
                    ))}

                </Swiper>
            </div>
        </>
    )
}

export default RelatedProducts;