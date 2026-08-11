import React, { useEffect, useState } from 'react';
import { IoSearchSharp } from "react-icons/io5";
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

const SearchBar = () => {
    const [ searchTerm, setSearchTerm ] = useState( "" );
    const [ searchData, setSearchData ] = useState( null );
    const navigate = useNavigate()

    const { products, isLoading } = useSelector( state => state.products );

    const handleSearchChange = ( e ) => {
        const term = e.target.value;
        setSearchTerm( term );

        if ( products )
        {
            const filteredProducts = products.filter( product =>
                product.name.toLowerCase().includes( term.toLowerCase() )
            );
            setSearchData( filteredProducts );
        }
    };


    const handleProductClick = ( id ) => {
        navigate( "/product-details/" + id )
        window.location.reload()
    }

    return (
        <div className='relative flex items-center w-full px-10'>
            <input
                type="text"
                autoComplete='off'
                placeholder='Search your product'
                value={ searchTerm }
                onChange={ handleSearchChange }
                className='p-2 border border-gray-300 focus:outline-none focus:border-[0.5px] focus:border-slate-500 w-full'
            />
            {
                searchData && searchData.length !== 0 && (
                    <div className="absolute top-[42px] bg-slate-50 shadow-sm  rounded-b-lg w-full mr-10"> {/* Added w-full */ }
                        { searchData.map( ( product, index ) => (
                            <div key={ product._id } onClick={ () => handleProductClick( product._id ) }>
                                <div className="w-full flex items-start py-3" key={ index }>
                                    <img
                                        src={ product.image.url }
                                        alt=""
                                        className="w-[40px] h-[40px] mr-[10px]"
                                    />
                                    <h1>{ product.name }</h1>
                                </div>
                            </div>
                        ) ) }
                    </div>
                ) }
            <button className='bg-white hover:opacity-80 text-white p-2 '>
                <IoSearchSharp size={ 26 } color='#222' />
            </button>
        </div>
    );
};

export default SearchBar;
