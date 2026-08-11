import React, { useEffect, useState } from "react";
import {
    AiFillHeart,
    AiOutlineEye,
    AiOutlineHeart,
    AiOutlineShoppingCart,
} from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import styles from "../../utils/styles";
import Rating from '@mui/material/Rating';
import { Avatar, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { addToWishlist, removeFromWishlist } from "../../redux/actions/wishlist";
import { MdReportProblem } from "react-icons/md";
import { useMutation } from "react-query"; // assuming you're using react-query for API requests
import * as apiClient from '../../api/api-Client';
import { LucideBarChartHorizontalBig } from "lucide-react";
import { addTocart } from "../../redux/actions/cart";

const ProductCard = ( { data, key } ) => {
    const { wishlist } = useSelector( ( state ) => state.wishlist );
    const { cart } = useSelector( ( state ) => state.cart );
    const { user } = useSelector( ( state ) => state.user );
    const [ click, setClick ] = useState( false );
    const [ open, setOpen ] = useState( false );
    const [ reportOpen, setReportOpen ] = useState( false ); // State for opening/closing report dialog
    const [ reportText, setReportText ] = useState( "" ); // State for report text
    const [ screenshots, setScreenshots ] = useState( [] ); // State for holding screenshots
    const [ imagePreviews, setImagePreviews ] = useState( [] ); // State for holding image previews
    const dispatch = useDispatch()

    const navigate = useNavigate()

    const removeFromWishlistHandler = ( data ) => {
        setClick( false );
        const userId = user ? user._id : null; // Retrieve userId from user state
        dispatch( removeFromWishlist( data._id, userId ) );
    };

    const addToWishlistHandler = ( data ) => {
        setClick( true );
        const userId = user ? user._id : null; // Retrieve userId from user state
        dispatch( addToWishlist( data, userId ) );
    };

    const addToCartHandler = ( data ) => {
        console.log( data )
        data.quantity = 1;
        if ( data.isHavingDiscount )
        {
            data.price = data.discountedPrice;
        }
        const userId = user ? user._id : null; // Retrieve userId from user state
        dispatch( addTocart( data, userId ) );
    };

    const checkWishlist = ( data ) => {
        return wishlist.some( ( item ) => item._id === data._id );
    };

    const checkCart = ( data ) => {
        return cart.some( ( item ) => item._id === data._id );
    };

    const { mutate } = useMutation( ( formData ) => apiClient.createReport( formData ) );

    const handleReport = () => {
        const formData = new FormData();
        formData.append( "productId", data._id );
        formData.append( "reason", reportText );
        screenshots.forEach( file => {
            formData.append( "screenshots", file );
        } );
        mutate( formData );
        setReportOpen( false ); // Close the report dialog after submitting
        // Clear report form fields and screenshots after submission
        setReportText( "" );
        setScreenshots( [] );
        setImagePreviews( [] );
    }

    const handleScreenshotChange = ( event ) => {
        const files = Array.from( event.target.files );
        setScreenshots( files );

        const previews = files.map( ( file ) => URL.createObjectURL( file ) );
        setImagePreviews( previews );
    };

    useEffect( () => {
        if ( checkWishlist( data ) )
        {
            setClick( true );
        } else
        {
            setClick( false );
        }
    }, [ wishlist ] );


    return (
        <>
            <div key={ key } className="w-full h-[380px] bg-white rounded-lg shadow-xl p-3 relative cursor-pointer">
                <div className="flex justify-end"></div>
                <Link to={ '/product-details/' + data._id }>
                    <img
                        src={ `${ data.image && data.image?.url }` }
                        alt=""
                        className="w-full h-[170px] object-contain mb-2"
                    />
                </Link>
                <Link to={ '/shop/' + data.shopId._id } className="flex items-center gap-2">
                    <Avatar widthImage={ 20 } heightImage={ 20 } src={ data?.shopId?.avatar } />
                    <h5 className={ `${ styles.shop_name }` }>{ data?.shopId?.name }</h5>
                </Link>
                <Link to={ '/product-details/' + data._id }>
                    <h4 className="pb-3 font-[500]">
                        { data.name.length > 40 ? data.name.slice( 0, 40 ) + "..." : data.name }
                    </h4>
                    <div className="flex">
                        <Rating
                            value={ data.rating }
                            readOnly
                        />
                    </div>
                    <div className="py-2 flex items-center justify-between">
                        <div className="flex">
                            <h5 className={ `${ styles.productDiscountPrice }` }>
                                { data.isHavingDiscount
                                    ? data.discountedPrice
                                    : data.price
                                }
                                { " " + "DZD" }
                            </h5>
                            <h4 className={ `${ styles.price }` }>
                                { data.isHavingDiscount ? data.price + " DZD" : null }
                            </h4>
                        </div>
                        <span className="font-[400] text-[17px] text-[#68d284]">
                            { data?.total_sell } sold
                        </span>
                    </div>
                </Link>
                <div>
                    { click ? (
                        <AiFillHeart
                            size={ 22 }
                            className="cursor-pointer absolute right-2 top-5"
                            onClick={ () => removeFromWishlistHandler( data ) }
                            color={ click ? "red" : "#333" }
                            title="Remove from wishlist"
                        />
                    ) : (
                        <AiOutlineHeart
                            size={ 22 }
                            className="cursor-pointer absolute right-2 top-5"
                            onClick={ () => addToWishlistHandler( data ) }
                            color={ click ? "red" : "#333" }
                            title="Add to wishlist"
                        />
                    ) }
                    <AiOutlineEye
                        size={ 22 }
                        className="cursor-pointer absolute right-2 top-14"
                        onClick={ () => navigate( '/product-details/' + data._id ) }
                        color="#333"
                        title="Quick view"
                    />
                    <AiOutlineShoppingCart
                        size={ 25 }
                        className="cursor-pointer absolute right-2 top-24"
                        onClick={ () => addToCartHandler( data ) }
                        color="#444"
                        title="Add to cart"
                    />
                    {
                        user?.shopId !== data?.shopId._id ? (
                            <MdReportProblem
                                size={ 25 }
                                className="cursor-pointer absolute right-2 top-36 text-red-500"
                                onClick={ () => {
                                    if ( !user )
                                    {
                                        navigate( '/sign-in' );
                                    }
                                    setReportOpen( true );

                                } } // Open report dialog on click
                                title="Report this product"
                            />
                        ) : null
                    }

                    {/* Report Dialog */ }
                    <Dialog open={ reportOpen } onClose={ () => setReportOpen( false ) }>
                        <DialogTitle>Report Product</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Please provide details for the report:
                            </DialogContentText>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="report-text"
                                label="Report"
                                type="text"
                                fullWidth
                                value={ reportText }
                                onChange={ ( e ) => setReportText( e.target.value ) }
                            />
                            <input
                                type="file"
                                id="screenshot"
                                multiple
                                onChange={ handleScreenshotChange }
                            />
                            { imagePreviews.length > 0 && (
                                <div>
                                    <Typography variant="subtitle1">Screenshots:</Typography>
                                    <div className="flex">
                                        { imagePreviews.map( ( preview, index ) => (
                                            <img
                                                key={ index }
                                                src={ preview }
                                                alt={ `Screenshot ${ index }` }
                                                className="w-20 h-20 mr-2"
                                            />
                                        ) ) }
                                    </div>
                                </div>
                            ) }
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={ () => setReportOpen( false ) }>Cancel</Button>
                            <Button onClick={ handleReport } variant="contained" color="primary">Submit</Button>
                        </DialogActions>
                    </Dialog>
                </div>
            </div>
        </>
    );
};

export default ProductCard;
