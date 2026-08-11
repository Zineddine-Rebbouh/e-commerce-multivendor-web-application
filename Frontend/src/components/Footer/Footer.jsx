import React from 'react'
import { Link } from 'react-router-dom'
import Container from '../../layout/Container'
import { MdFacebook } from 'react-icons/md'
import { AiFillInstagram, AiFillTwitterCircle, AiFillYoutube } from 'react-icons/ai'

const Footer = () => {
    return (
        <footer className='bg-[#222]
        text-slate-200 text-sm mt-16
        '>
            <Container>
                <div className='flex flex-col md:flex-row justify-between pt-16 pb-8 gap-8'>
                    <div className='w-full sm:w-1/2 md:w-1/4 lg:w-1/5 flex flex-col gap-3'>
                        <h3 className='text-xl font-bold text-white mb-1'>
                            TechHub
                        </h3>
                        <p className='leading-relaxed'>
                            TechHub is a multi-vendor marketplace where trusted sellers
                            offer electronics, fashion, home goods and more — all in one place.
                            Shop securely, track your orders and get doorstep delivery
                            anywhere in the country.
                        </p>
                        <p className='mt-2'>&copy; { new Date().getFullYear() } TechHub. All rights reserved.</p>
                    </div>
                    <div className='w-full sm:w-1/2 md:w-1/4 lg:w-1/6 flex flex-col gap-2'>
                        <h3 className='text-base font-bold text-white mb-2'>
                            Shop Categories
                        </h3>
                        <Link to="/products">Electronics</Link>
                        <Link to="/products">Fashion &amp; Clothing</Link>
                        <Link to="/products">Sports &amp; Outdoors</Link>
                        <Link to="/products">Home &amp; Kitchen</Link>
                        <Link to="/products">Beauty &amp; Health</Link>
                        <Link to="/products">Books &amp; Stationery</Link>
                    </div>
                    <div className='w-full sm:w-1/2 md:w-1/4 lg:w-1/6 flex flex-col gap-2'>
                        <h3 className='text-base font-bold text-white mb-2'>
                            Customer Services
                        </h3>
                        <Link to="/faq">FAQs</Link>
                        <Link to="/whishlist">My Wishlist</Link>
                        <Link to="/add-to-cart">My Cart</Link>
                        <Link to="/events">Hot Deals</Link>
                        <Link to="/sign-in">Track My Order</Link>
                        <Link to="/sign-in">Returns &amp; Refunds</Link>
                    </div>
                    <div className='w-full sm:w-1/2 md:w-1/4 lg:w-1/6 flex flex-col gap-2'>
                        <h3 className='text-base font-bold text-white mb-2'>
                            For Sellers
                        </h3>
                        <Link to="/create-shop">Open Your Shop</Link>
                        <Link to="/sign-up">Become a Seller</Link>
                        <Link to="/faq">Selling Guide</Link>
                        <Link to="/sign-in">Shipping Policy</Link>
                        <Link to="/sign-in">Payments</Link>
                    </div>
                    <div className='w-full sm:w-1/2 md:w-1/4 lg:w-1/6 flex flex-col gap-2'>
                        <h3 className='text-base font-bold text-white mb-2'>
                            Follow Us
                        </h3>
                        <div className='flex gap-2'>
                            <a href="https://www.facebook.com" target="_blank" rel="noreferrer">
                                <MdFacebook size={ 24 } />
                            </a>
                            <a href="https://www.instagram.com" target="_blank" rel="noreferrer">
                                <AiFillInstagram size={ 24 } />
                            </a>
                            <a href="https://www.twitter.com" target="_blank" rel="noreferrer">
                                <AiFillTwitterCircle size={ 24 } />
                            </a>
                            <a href="https://www.youtube.com" target="_blank" rel="noreferrer">
                                <AiFillYoutube size={ 24 } />
                            </a>
                        </div>
                    </div>
                </div>
            </Container>
        </footer>
    )
}

export default Footer