import React, { useRef } from 'react';
import Slider from "react-slick";
import InnerImageZoom from 'react-inner-image-zoom';
import 'react-inner-image-zoom/lib/InnerImageZoom/styles.css';


const ProductZoom = () => {

    const zoomSliderBig = useRef();
    const zoomSlider = useRef();

    const images = [
        {
            thumb:
                "https://api.spicezgold.com/download/file_1734528708304_apple-iphone-13-128-gb-midnight-black-digital-o491997699-p590798548-0-202208221207.webp",
            large:
                "https://api.spicezgold.com/download/file_1734528708304_apple-iphone-13-128-gb-midnight-black-digital-o491997699-p590798548-0-202208221207.webp",
        },
        {
            thumb:
                "https://api.spicezgold.com/download/file_1734528708305_apple-iphone-13-128-gb-midnight-black-digital-o491997699-p590798548-2-202208221207.webp",
            large:
                "https://api.spicezgold.com/download/file_1734528708305_apple-iphone-13-128-gb-midnight-black-digital-o491997699-p590798548-2-202208221207.webp",
        },
        {
            thumb:
                "https://api.spicezgold.com/download/file_1734528708305_apple-iphone-13-128-gb-midnight-black-digital-o491997699-p590798548-3-202208221207.webp",
            large:
                "https://api.spicezgold.com/download/file_1734528708305_apple-iphone-13-128-gb-midnight-black-digital-o491997699-p590798548-3-202208221207.webp",
        },
    ];
    var Settings = {
        dots: false,
        infinite: false,
        speed: 700,
        slidesToShow: 1,
        slidesToScroll: 1,
        fade: false,
        arrows: false,
    };
    var Settings2 = {
        dots: false,
        infinite: false,
        speed: 700,
        slidesToShow: 5,
        slidesToScroll: 1,
        fade: false,
        arrows: true,
    };

    const goto = (index) => {
        zoomSliderBig.current.slickGoTo(index);
        zoomSlider.current.slickGoTo(index);
    }
    return (
        <div className='productZoom'>
            <div className="productZoom1 position-relative">
                <span className="badge badge-primary">28%</span>
                <Slider {...Settings} className='zoomSliderBig' ref={zoomSliderBig}>
                    {/* BIG ZOOM SLIDER */}
                    {images.map((img, i) => (
                        <div className="item" key={i}>
                            <InnerImageZoom
                                zoomType="hover"
                                zoomScale={1.2}
                                src={img.thumb} // preview image
                                zoomSrc={img.large} // high res for zoom
                            />
                        </div>
                    ))}

                </Slider>
            </div>
            {/* THUMBNAIL SLIDER */}
            <Slider {...Settings2} className='zoomSlider' ref={zoomSlider}>
                {images.map((img, i) => (
                    <div className="item" key={i}>
                        <img
                            src={img.thumb}
                            className="w-100"
                            onClick={() => goto(i)}
                        />
                    </div>
                ))}
            </Slider>
        </div>
    )
}

export default ProductZoom