import React from 'react'
import { CiHeart } from "react-icons/ci";
import { useSelector } from 'react-redux';

const Favourites = () => {
    const { wishlist } = useSelector( ( state ) => state.wishlist )
    const FavouritesCounter = wishlist.length
    return (
        <div
            className='relative cursor-pointer'
            onClick={ () => {
            } }
        >
            <div className='text-3xl'>
                <CiHeart size={ 32 } color='white' fontWeight={ 700 } />
            </div>
            <span className={ `${ FavouritesCounter === 0 ? "" : "bg-[#fff]" }  absolute
                top-[-10px] right-[-10px] text-black h-6 w-6 rounded-full flex items-center justify-center text-sm ` }>
                { FavouritesCounter === 0 ? '' : FavouritesCounter }
            </span>

        </div>
    )
}

export default Favourites
