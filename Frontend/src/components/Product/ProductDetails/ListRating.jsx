import { Avatar, Rating } from '@mui/material'
import React from 'react'
import moment from "moment"

const ListRating = ( { product } ) => {
    return (
        <div>
            <div className=''>
                <h1 className='font-bold text-2xl '>Product Review</h1>
            </div>
            <div className='text-sm mt-4 review-container'> {/* add the class here */ }
                {
                    product.Reviews && product.Reviews.map( ( review, index ) => (
                        <div key={ index } className='review-item'> {/* add the class here */ }
                            <div className='flex items-center gap-2'>
                                <Avatar src={ review.userId.avatar } />
                                <h1 className='flex font-semibold'>{ review?.userId.name }</h1>
                                <div className='font-light ml-2'>{ moment( review?.createdAt ).fromNow() }</div>
                            </div>
                            <div className='mt-2'>
                                <Rating value={ review?.rating } readOnly />
                                <div className='ml-2'>
                                    { review?.comment }
                                </div>
                                <hr className='my-4' />
                            </div>
                        </div>
                    ) )
                }
            </div>
        </div>
    )
}

export default ListRating