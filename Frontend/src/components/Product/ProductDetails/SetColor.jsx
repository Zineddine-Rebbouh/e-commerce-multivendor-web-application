const SetColor = ( { images, cartProduct, handleColorSelection } ) => {

    return (
        <div className='flex gap-4 items-cneter'>
            <span className='font-semibold text-slate-600'>Color :</span>
            <div className='flex items-center gap-2'>
                { images.map( ( i ) => {
                    return (
                        <span
                            key={ i.color }
                            onClick={ () => handleColorSelection( i ) }
                            className={ `flex items-center justify-center w-7 h-7 rounded-full cursor-pointer ${ i.color === cartProduct.SelectedImage.color ? 'border-[2px] w-8 h-8 border-[#68897b]' : 'border-none' }` }
                            style={ { backgroundColor: i.color } }
                        >
                        </span>
                    )
                } ) }
            </div>

        </div>
    )
}

export default SetColor