import { Link } from "react-router-dom";
import Search from "../components/Search/search";
import Pagination from "../components/pagination";
import * as apiClient from '../api/api-Client'
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Loader } from "../components/Loader/Loader";
import { useQuery } from "react-query";




const ProductsPage = () => {
    const [ productsData, setProductsData ] = useState( [] );
    const { products, isLoading } = useSelector( state => state.products );
    // const { data: categories } = useQuery( "categories", apiClient.getCateogries );
    // console.log( categories )
    useEffect( () => {
        if ( products )
        {
            const data = products.map( ( product ) => { return { ...product, createdAt: new Date( product.createdAt ).toLocaleDateString() } } );
            setProductsData( data );
        }
    }, [ productsData ] );


    const handleDeleteProduct = async id => {
        setProductsData( productsData.filter( product => product._id !== id ) );
        await apiClient.removeProduct( id );

        console.log( "Product deleted" );
    }

    console.log( products );

    const count = products.length;

    if ( isLoading ) return <Loader />
    return (
        <div className={ "bg-white p-5 rounded-lg mt-5" }>
            <div className={ "" }>
                <Search placeholder="Search for a product..." />
            </div>
            <table className={ "w-full" }>
                <thead>
                    <tr>
                        <td className="p-5 font-semibold">Title</td>
                        <td className="p-5 font-semibold">Description</td>
                        <td className="p-5 font-semibold">Price</td>
                        <td className="p-5 font-semibold">Created At</td>
                        <td className="p-5 font-semibold">Stock</td>
                        <td className="p-5 font-semibold">Action</td>
                    </tr>
                </thead>
                <tbody>
                    { products.map( ( product ) => (
                        <tr key={ product._id }>
                            <td className="py-2">
                                <div className={ "flex items-center gap-2" }>
                                    <img
                                        src={ product.image.url || "/noproduct.jpg" }
                                        alt=""
                                        width={ 40 }
                                        height={ 40 }
                                        className={ "object-cover rounded-full" }
                                    />
                                    <span className="text-wrap text-ellipsis">
                                        { product.name }
                                    </span>
                                </div>
                            </td>
                            <td className="p-5" style={ { maxWidth: "500px" } }>
                                <span className="truncate block">
                                    { product.description }
                                </span>
                            </td>
                            <td className="p-5">{ product.price } DZD</td>
                            <td className="p-5">{ product.createdAt?.toString().slice( 4, 16 ) }</td>
                            <td className="p-5">{ product.available_quantity }</td>
                            <td className="p-5">
                                <div className={ "flex gap-2" }>
                                    <Link to={ `/dashboard/products/${ product._id }` }>
                                        <button className={ "border-none py-1 px-2 rounded-md text-white bg-green-400 cursor-pointer" }>
                                            View
                                        </button>
                                    </Link>
                                    <form >
                                        <input type="hidden" name="id" value={ product._id } />
                                        <button onClick={ () => handleDeleteProduct( product._id ) } className={ "border-none py-1 px-2 rounded-md text-white bg-red-400 cursor-pointer" }>
                                            Delete
                                        </button>
                                    </form>
                                </div>
                            </td>
                        </tr>
                    ) ) }
                </tbody>
            </table>
            <Pagination count={ count } />
        </div >
    );
};

export default ProductsPage;