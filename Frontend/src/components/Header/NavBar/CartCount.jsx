import React from 'react'
import { CiShoppingCart } from "react-icons/ci";
import { useSelector } from 'react-redux';

const CartCount = () => {
    const { cart } = useSelector( ( state ) => state.cart )
    const CartCounter = cart.length
    return (
        <div
            className='relative cursor-pointer'
            onClick={ () => {

            } }
        >
            <div className='text-3xl'>
                <CiShoppingCart size={ 32 } color='white' style={ { fontWeight: 'bold' } } />
            </div>
            <span className={ `${ CartCounter === 0 ? "" : "bg-[#fff]" }  absolute
                top-[-10px] right-[-10px] text-black h-6 w-6 rounded-full flex items-center justify-center text-sm ` }>
                { CartCounter === 0 ? '' : CartCounter }
            </span>

        </div >
    )
}

export default CartCount
