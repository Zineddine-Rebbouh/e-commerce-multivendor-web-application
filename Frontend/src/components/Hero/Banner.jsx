import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// Import your banner images
import BannerImage2 from '../../assets/20142503_Black-Friday-Facebook-Cover-Banner-12.png';
import BannerImage3 from '../../assets/Chinese.jpeg';
import BannerImage4 from '../../assets/Night.jpeg';

const Banner = () => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        arrows: true

    };

    return (
        <section className="w-full flex items-center h-[500px] mb-5">
            <div className=" w-full h-full">
                <div className="w-full">
                    <Slider { ...settings }>
                        <div className="">
                            <div style={ { backgroundImage: `url(${ BannerImage2 })` } } className="bg-no-repeat bg-cover bg-center h-[500px] w-full" />
                        </div>
                        <div className="">
                            <div style={ { backgroundImage: `url(${ BannerImage3 })` } } className="bg-no-repeat bg-cover bg-center h-[500px] w-full" />
                        </div>
                        <div className="">
                            <div style={ { backgroundImage: `url(${ BannerImage4 })` } } className="bg-no-repeat bg-cover bg-center h-[500px] w-full" />
                        </div>
                    </Slider>
                </div>
            </div>
        </section>
    );
};

export default Banner;
