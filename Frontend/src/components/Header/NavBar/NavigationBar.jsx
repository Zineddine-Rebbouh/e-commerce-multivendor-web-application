import React, { useState } from 'react'
import Container from '../../../layout/Container'
import SearchBar from './SearchBar'
import Avatar from './Avatar'
import CartCount from './CartCount'
import NotificationCount from './NotificationCount'
import Favourites from './Favourties'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import styles from '../../../utils/styles'
import { navItems } from '../../../constants/data'
import { FaUserAlt } from "react-icons/fa";


const NavigationBar = () => {
    const { isAuthenticated, user } = useSelector( ( state ) => state.user );

    return (
        <div className='
        sticky top-0 w-full bg-[#222] z-30 shadow-sm'>
            <div className='py-3 border-b-1 '>
                <Container>
                    <div className='flex items-center  gap-3 md-g ap-0'>
                        <a href="/" className='text-white font-bold text-3xl'>TechHub</a>
                        <div className='hidden md:flex flex-grow '>
                            <SearchBar />
                        </div>
                        <div className='flex items-center gap-3 md:gap-6'>
                            { isAuthenticated ? (
                                <div>
                                    {
                                        user?.role === 'Seller' ? (
                                            <Link
                                                to={ `/shop` }
                                                className="text-[18px] text-white border-1 border-[#000000b7] px-4 py-2 rounded-md bg-black"
                                            >
                                                Shop
                                            </Link>
                                        ) : user?.role === 'Admin' ? (
                                            <Link
                                                to="/dashboard"
                                                className="text-[18px] text-white border-1 border-[#000000b7] px-4 py-2 rounded-md bg-black"
                                            >
                                                Admin Dashboard
                                            </Link>
                                        ) : (
                                            <Link
                                                to="/create-shop"
                                                className="text-[18px] text-white border-1 border-[#000000b7] px-4 py-2 rounded-md bg-black"
                                            >
                                                &raquo; Create Your Shop
                                            </Link>
                                        )
                                    }
                                </div>
                            ) : (
                                <div className='flex gap-4 items-center '>
                                    <FaUserAlt size={ 24 } color='white' />
                                    <div>
                                        <span className='font-semibold text-white text-md'>Account</span>
                                        <div className='flex gap-2'>
                                            <Link to="/sign-in" className='text-gray-400 text-sm hover:text-white'>Login</Link>
                                            <span className='text-gray-400 text-sm'>or</span>
                                            <Link to="/sign-up" className='text-gray-400 text-sm hover:text-white'>Register</Link>
                                        </div>
                                    </div>
                                </div>
                            ) }
                        </div>
                    </div>
                </Container>
            </div >
        </div >
    )
}

export default NavigationBar
