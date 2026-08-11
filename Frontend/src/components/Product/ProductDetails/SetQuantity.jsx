import React from 'react'

const SetQuantity = ( {
    cartProduct,
    cartCounter,
    IncreaseQuantity,
    DecreaseQuantity,
} ) => {



    return (
        <div className='flex gap-8 items-center '>
            {
                cartCounter ?
                    null :
                    <div className='font-semibold text-slate-600'> Quantity :</div>
            }
            <div className='flex gap-4 items-center text-base'>
                <button
                    className='border border-slate-500 px-2 rounded flex items-center justify-center'
                    onClick={ DecreaseQuantity }
                >
                    -
                </button>
                <div>{ cartProduct.quantity }</div>
                <button
                    className='border border-slate-500 px-2 rounded flex items-center justify-center'
                    onClick={ IncreaseQuantity }
                >
                    +
                </button>
            </div>

        </div>
    )
}

export default SetQuantity
