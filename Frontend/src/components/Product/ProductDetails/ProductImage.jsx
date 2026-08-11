import React from 'react'

const ProductImage = ( {
    cartProduct,
    handleColorSelection,
    product
} ) => {

    return (
        <div className='grid grid-cols-6 gap-2 h-full max-h-[500px] min-h-[300px] sm:min-h-[400px] ' >
            <div className='flex flex-col items-center justify-center gap04 cursor-pointer border h0full max-h-[500px] min-h-[300px] sm:min-h-[400px]'>
                {/* {
                    product.images.map( ( image ) => {
                        return
                    } )
                } */}
                {/* <div className={ `relative w-[80%] aspect-square rounded border-teal-300 ${ cartProduct.SelectedImage.color === image.color } ? "border-[1.2px]" : "border-none"` } onClick={ () => handleColorSelection( image ) } key={ image.color }> */ }
                <div className={ `relative w-[80%] aspect-square rounded border-teal-300 border-none"` } key={ product?.image?.url }>
                    <img src={ product?.image?.url } alt="image-product" className='py-2 object-top' />
                </div>
            </div>
            <div className='col-span-5 relative aspect-square '>
                <img src={ product?.image?.url } alt="product" className='w-full object-contain max-h-[500px] min-h-[300px] sm:min-h-[400px] ' />
            </div>

        </div>
    )
}

export default ProductImage
