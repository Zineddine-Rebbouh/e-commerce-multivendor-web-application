import React, { useState } from 'react'
import { products } from '../../constants/data'
import { Link } from 'react-router-dom'
import styles from '../../utils/styles'
import Container from '../../layout/Container'
import CountDown from './CountDown'

const EventCard = () => {
    const product = products[ 2 ]

    const [ active, setActive ] = useState( false )
    const addToCartHandler = () => {

    }

    return (
        <div>
            < h2 className="text-3xl font-bold text-gray-900 mb-8" > Incoming Events</h2 >
            <div
                className={ `w-full grid grid-col-1 lg:grid-cols-2 gap-10 bg-white rounded-lg shadow-xl ${ active ? "unset" : "mb-12"
                    } p-2` }
            >
                <div className="w-full md:w-[50%] lg:w-[70%] m-auto">
                    <img src={ product.images[ 0 ].image } className='object-contain h-full w-full' alt="" />
                </div>
                <div className="w-full lg:[w-50%] flex flex-col justify-center">
                    <h2 className={ `${ styles.productTitle }` }>{ product.name }</h2>
                    <p>{ product.description }</p>
                    <div className="flex py-2 justify-between">
                        <div className="flex">
                            <h5 className="font-[500] text-[18px] text-[#d55b45] pr-3 line-through">
                                { product.price }$
                            </h5>
                            <h5 className="font-bold text-[20px] text-[#333] font-Roboto">
                                40$
                            </h5>
                        </div>
                        <span className="pr-3 font-[400] text-[17px] text-[#44a55e]">
                            23 sold
                        </span>
                    </div>
                    {/* <h2 className='text-3xl text-blue '>2 days 3 hours 14 minutes 50 seconds</h2> */ }
                    <CountDown data={ product } />

                    <br />
                    <div className="flex items-center">
                        <Link to={ `/product-details/${ product.id }?isEvent=true` }>
                            <div className={ `${ styles.button } text-[#fff]` }>See Details</div>
                        </Link>
                        <div className={ `${ styles.button } text-[#fff] ml-5` } onClick={ () => addToCartHandler( product ) }>Add to cart</div>
                    </div>
                </div>
            </div >
        </div>
    )
}

export default EventCard
