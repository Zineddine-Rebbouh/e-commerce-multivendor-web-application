import React, { useEffect, useState } from 'react'
import Container from '../../layout/Container'
import ProductCard from "../Product/ProductCard"
import FilterSection from '../Filter/FilterSection';
import { Loader } from '../Loader/Loader';
import * as apiClient from '../../api/api-Client';
import { useQuery } from 'react-query';

const Products = () => {
    const [ selectedCategory, setSelectedCategory ] = useState( '' );
    const [ selectedStars, setSelectedStars ] = useState( [] );
    const [ selectedPrice, setSelectedPrice ] = useState( 0 );
    const [ sortOption, setSortOption ] = useState( '' );
    const { data: productData, isLoading } = useQuery( "products", apiClient.getProducts );
    const [ filteredProducts, setFilteredProducts ] = useState( [] );

    const applyFilters = ( products, selectedCategory, selectedStars, selectedPrice ) => {
        let filtered = products;

        // Filter by category
        if ( selectedCategory )
        {
            filtered = filtered.filter( product => product.categoryId.name === selectedCategory );
        }

        // Filter by star ratings
        if ( selectedStars.length > 0 )
        {
            filtered = filtered.filter( product => selectedStars.includes( product.rating.toString() ) );
        }

        // Filter by price
        if ( selectedPrice )
        {
            filtered = filtered.filter( product => product.price <= selectedPrice );
        }

        return filtered;
    };

    const applySorting = ( products, sortOption ) => {
        switch ( sortOption )
        {
            case 'starRating':
                return [ ...products ].sort( ( a, b ) => b.rating - a.rating );
            case 'pricePerNightAsc':
                return [ ...products ].sort( ( a, b ) => a.price - b.price );
            case 'pricePerNightDesc':
                return [ ...products ].sort( ( a, b ) => b.price - a.price );
            default:
                return products;
        }
    };

    useEffect( () => {
        if ( productData )
        {
            let filtered = applyFilters( productData, selectedCategory, selectedStars, selectedPrice );
            filtered = applySorting( filtered, sortOption );
            setFilteredProducts( filtered );
        }
    }, [ productData, selectedCategory, selectedStars, selectedPrice, sortOption ] );

    if ( isLoading ) return <Loader />;

    return (
        <div className='p-8'>
            <Container>
                <div className='grid grid-cols-8 gap-10'>
                    <div className='col-span-2'>
                        <FilterSection
                            selectedCategory={ selectedCategory }
                            setSelectedCategory={ setSelectedCategory }
                            selectedStars={ selectedStars }
                            setSelectedStars={ setSelectedStars }
                            selectedPrice={ selectedPrice }
                            setSelectedPrice={ setSelectedPrice }
                        />
                    </div>
                    <div className='col-span-6'>
                        <div className='flex items-center justify-end mb-10'>
                            <select
                                value={ sortOption }
                                onChange={ ( event ) => setSortOption( event.target.value ) }
                                className="p-2 border rounded-md bg-white"
                            >
                                <option value="" className='bg-white'>Sort By</option>
                                <option value="starRating">Star Rating</option>
                                <option value="pricePerNightAsc">Price Per Night (low to high)</option>
                                <option value="pricePerNightDesc">Price Per Night (high to low)</option>
                            </select>
                        </div>
                        <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-4 xl:gap-[30px] mb-12">
                            { filteredProducts.map( ( product, index ) => (
                                <ProductCard data={ product } key={ index } />
                            ) ) }
                        </div>
                        { filteredProducts.length === 0 ? (
                            <h1 className="text-center w-full pb-[100px] text-[20px]">
                                No products Found!
                            </h1>
                        ) : null }
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default Products;
