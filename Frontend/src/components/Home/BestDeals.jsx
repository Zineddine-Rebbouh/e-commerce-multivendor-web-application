import React, { useEffect, useState } from "react";
import styles from "../../utils/styles";
import ProductCard from "../Product/ProductCard";
import * as apiClient from "../../api/api-Client";
import { useQuery } from "react-query";

const BestDeals = () => {
    const { data: productData } = useQuery( "products", apiClient.getBestProducts );

    console.log( productData );
    const [ firstFive, setData ] = useState( [] );
    useEffect( () => {
        const products = productData?.sort( ( a, b ) => b.total_sell - a.total_sell && b.price - a.price );
        setData( products );
    }, [] );


    return (
        <div>
            <div className={ `${ styles.heading }` }>
                < h1 className="text-3xl font-bold text-gray-900 mb-8" >Best Deals</h1>
            </div>
            <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12 border-0">
                {
                    productData && productData.map( ( item, index ) => <ProductCard data={ item } key={ index } /> )
                }
            </div>
        </div>
    );
};

export default BestDeals;
