import React, { useState } from 'react'
import CategoriesFilter from './CategoriesFilter';
import PriceFilter from './PriceFilter';
import StarRatingFilter from './StarRatingFilter';
import { useQuery } from 'react-query';
import * as apiClient from "../../api/api-Client"

const FilterSection = ( { selectedCategory, setSelectedCategory, selectedStars, setSelectedStars, selectedPrice, setSelectedPrice } ) => {

    const { data: categories } = useQuery( "categories", apiClient.getCateogries );

    const handleStarsChange = ( event ) => {
        const starRating = event.target.value;

        setSelectedStars( ( prevStars ) =>
            event.target.checked
                ? [ ...prevStars, starRating ]
                : prevStars.filter( ( star ) => star !== starRating )
        );
        console.log( selectedStars );
    };


    return (
        <div className="rounded-lg border border-slate-300 p-5 h-fit sticky top-10 bg-white shadow-lg">
            <div className="space-y-5">
                <h3 className="text-lg font-semibold border-b border-slate-300 pb-5">
                    Filter by:
                </h3>
                <CategoriesFilter
                    categories={ categories }
                    selectedCategory={ selectedCategory }
                    onChange={ ( value ) => setSelectedCategory( value ) }
                />
                <StarRatingFilter
                    selectedStars={ selectedStars }
                    onChange={ handleStarsChange }
                />
                <PriceFilter
                    selectedPrice={ selectedPrice }
                    onChange={ ( value ) => setSelectedPrice( value ) }
                />
            </div>
            <button className=' bg-slate-500 text-white p-2 w-full mt-5 hover:opacity-80   '
                onClick={ () => {
                    setSelectedCategory( "" );
                    setSelectedStars( [] );
                    setSelectedPrice( 0 );
                } }
            >
                Clear
            </button>
        </div>
    )
}

export default FilterSection