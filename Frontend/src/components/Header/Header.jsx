import React, { useState } from 'react'
import Container from '../../layout/Container'
import NavigationBar from './NavBar/NavigationBar'
import NotificationCount from './NavBar/NotificationCount'
import Favourites from './NavBar/Favourties'
import CartCount from './NavBar/CartCount'
import SearchBar from './NavBar/SearchBar'
import Avatar from './NavBar/Avatar'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import Categories from '../Categories/Categories'
import { categoriesData } from '../../constants/data'
import { IoIosArrowDown } from 'react-icons/io'
import { BiMenuAltLeft } from "react-icons/bi"
import { navItems } from '../../constants/data'

const Header = () => {
    const [ active, setActive ] = useState( false )
    const { user } = useSelector( ( state ) => state.user );
    const [ dropDown, setDropDown ] = useState( false )
    return (
        <div className=''>
            <NavigationBar />
            <div className='transition 800px:flex items-center justify-between w-full bg-[#4254fa]'>
                <Container >
                    <div className='flex justify-between items-center py-4 border-b-1 '>
                        {/* <div onClick={ () => setDropDown( !dropDown ) }>
                            <div className="relative h-[50px] w-[280px] hidden lg:block  ">
                                <button
                                    className={ `h-[100%] w-full flex gap-12 items-center bg-white font-sans text-lg font-[500] select-none rounded-t-md` }
                                >
                                    <BiMenuAltLeft size={ 30 } />
                                    Select Categorie
                                    <IoIosArrowDown
                                        size={ 20 }
                                        className="cursor-pointer"
                                        onClick={ () => setDropDown( !dropDown ) }
                                    />
                                </button>
                                {
                                    dropDown ? <Categories categoriesData={ categoriesData }
                                        setDropDown={ setDropDown } /> : null
                                }
                            </div>
                        </div> */}
                        <div className={ 'flex justify-center' }>
                            {
                                navItems && navItems.map( ( i, index ) => (
                                    <div className="flex">
                                        <Link to={ i.url }
                                            className={ ` ${ active === index + 1 ? "text-[#17dd1f]" : "text-white  800px:text-[#fff]" } 800px:pb-0 font-[600] px-6 cursor-pointer }` }
                                        >
                                            { i.title }
                                        </Link>
                                    </div>
                                ) )
                            }
                        </div>
                        <div className='flex items-center gap-3 md:gap-6'>
                            {/* <NotificationCount /> */ }
                            <Link to={ '/whishlist' }>
                                <Favourites />
                            </Link>
                            <Link to={ '/add-to-cart' }>
                                <CartCount />
                            </Link>
                            <NotificationCount />
                            <Link to="/profile">
                                <Avatar src={ user?.avatar } />
                            </Link>
                        </div>
                    </div>
                </Container >
            </div>
        </div >
    )
}

export default Header
