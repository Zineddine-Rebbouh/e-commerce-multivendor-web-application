import React, { useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { BsCartPlus } from "react-icons/bs";
import { AiOutlineHeart } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import Container from "../../layout/Container";
import { removeFromWishlist } from "../../redux/actions/wishlist";
import { addTocart } from "../../redux/actions/cart";
const Wishlist = () => {


    const { wishlist } = useSelector( ( state ) => state.wishlist );
    const { user } = useSelector( ( state ) => state.user );
    const dispatch = useDispatch();

    const WhishlistCounter = wishlist.length
    const removeFromWishlistHandler = ( data ) => {
        console.log( data );
        const userId = user ? user._id : null; // Retrieve userId from user state
        dispatch( removeFromWishlist( data._id, userId ) );
    };

    return (

        <Container>
            <div className=' flex gap-10 py-16 px-10 flex-col md:flex-row '>
                <div className='w-full md:w-2/3'>
                    <p className='font-bold text-2xl'>Wishlist ({ WhishlistCounter } items )  </p>
                    <hr className='my-6' />
                    {
                        wishlist.length === 0 ? <p className='text-heading4'>Your cart is empty</p>
                            :
                            <div>
                                { wishlist.map( ( product, index ) => (
                                    <div key={ index } className='w-full flex hover:bg-grey-1 px06 py-5 items-center justify-between'>
                                        <div className='flex items-center'>
                                            <img src={ product.image.url } alt={ product.name } width={ 100 } height={ 100 } className='rounded-lg w-32 h-32 object-contain' />
                                            <div className='flex flex-col gap-3 ml-4'>
                                                <p className='text-body-bold'>{ product.name }</p>
                                                <div className='flex flex-col justify-center gap-2'>
                                                    <div>

                                                    </div>
                                                    <div className='w-[70px]'>
                                                        <button className='text-slate-500 underline' onClick={ () => removeFromWishlistHandler( product ) }>Remove</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) ) }
                            </div>
                    }
                </div>
            </div>
        </Container >
    );
};

export default Wishlist;
