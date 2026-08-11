import React from 'react'
import ProductCard from '../ProductCard'
import { productData } from '../../../constants/data'
import { useQuery } from 'react-query'
import * as apiClient from '../../../api/api-Client'
import { Loader } from '../../Loader/Loader'
import { useParams } from 'react-router-dom'

const RelatedProduct = ( { categoryId } ) => {
    const { id } = useParams();
    const { data: products, isLoading, isError, error } = useQuery( [ "product" ], () => apiClient.getProductByCategory( id ), {
        onSuccess: ( data ) => console.log( "Product data:", data ),
        onError: ( error ) => console.error( "Error fetching product:", error ),
    } );



    // products = products.slice( 0, 5 )

    if ( isLoading ) return <Loader />

    return (
        <div className='' >
            <h1 className='font-bold text-2xl py-2'> RelatedProduct</h1>
            <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12 border-0 px-2 py-2">
                { products?.slice( 0, 5 ).map( ( item, index ) => <ProductCard data={ item } key={ index } /> ) }
            </div>
        </div >
    )
}

export default RelatedProduct
