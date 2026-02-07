import React, {useRef} from 'react';
import Slider from "react-slick";
import InnerImageZoom from 'react-inner-image-zoom';
import 'react-inner-image-zoom/lib/InnerImageZoom/styles.css';


const ProductZoom = ({images = [], discountPercent = 0}) => {

    const zoomSliderBig = useRef();
    const zoomSlider = useRef();

    if (!images || images.length === 0) return null;

    const imageList = images.map(img => ({
        thumb: img.url,
        large: img.url
    }));

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

                {discountPercent > 0 && (
                    <span className="badge badge-primary">
                        {discountPercent}%
                    </span>
                )}

                <Slider {...Settings} className='zoomSliderBig' ref={zoomSliderBig}>
                    {/* BIG ZOOM SLIDER */}
                    {imageList.map((img, i) => (
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
                {imageList.map((img, i) => (
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