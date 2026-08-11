import React, { useEffect, useState } from "react";
import styles from "../../../utils/styles";
import { BsFillBagFill } from "react-icons/bs";
import { Link } from 'react-router-dom'
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import * as apiClient from '../../../api/api-Client'
import { Loader } from "../../Loader/Loader";


const OrderDetails = () => {

    const [ order, setOrder ] = useState( {} );

    const [ data, setData ] = useState( {
        _id: "1234567890abcdef",
        createdAt: "2024-04-22T12:00:00.000Z",
        cart: [
            {
                _id: "product1",
                name: "Product 1",
                images: [ "https://via.placeholder.com/150" ],
                discountPrice: 20,
                qty: 2,
            },
            {
                _id: "product2",
                name: "Product 2",
                images: [ "https://via.placeholder.com/150" ],
                discountPrice: 30,
                qty: 1,
            }
        ],
        totalPrice: 70,
        shippingAddress: {
            address1: "123 Street",
            address2: "Apt 1",
            country: "United States",
            city: "New York",
        },
        user: {
            phoneNumber: "123-456-7890",
        },
        paymentInfo: {
            status: "Paid",
        },
        status: "Processing",
    } );

    const [ status, setStatus ] = useState( data.status );

    const { id } = useParams()


    // Your logic for fetching order details
    const { data: orderData, isLoading } = useQuery( [ 'order', id ], () => apiClient.getOrder( id ), {
        enabled: !!id
    } );

    useEffect( () => {
        if ( orderData )
        {
            setOrder( orderData )
        }
    }, [ orderData ] )

    console.log( orderData );
    console.log( orderData );
    console.log( "Order details fetched for:", id );


    const orderUpdateHandler = () => {
        // Your logic for updating order status
        console.log( "Order status updated to:", status );
    };

    const refundOrderUpdateHandler = () => {
        // Your logic for updating refund order status
        console.log( "Refund order status updated to:", status );
    };


    if ( isLoading ) return <Loader />


    return (
        <div className={ `py-4 min-h-screen ${ styles.section }` } >
            <div className="w-full flex items-center justify-between">
                <div className="flex items-center">
                    <BsFillBagFill size={ 30 } color="crimson" />
                    <h1 className="pl-2 text-[25px]">Order Details</h1>
                </div>
                <Link to="/profile/orders">
                    <div
                        className={ `${ styles.button } !bg-[#fce1e6] !rounded-[4px] text-[#e94560] font-[600] !h-[45px] text-[18px]` }
                    >
                        Order List
                    </div>
                </Link>
            </div>

            <div className="w-full flex items-center justify-between pt-6">
                <h5 className="text-[#00000084]">
                    Order ID: <span>#{ order?._id?.slice( 0, 8 ) }</span>
                </h5>
                <h5 className="text-[#00000084]">
                    Placed on: <span>{ order?.createdAt?.slice( 0, 10 ) }</span>
                </h5>
            </div>

            {/* order items */ }
            < br />
            <br />
            { order &&
                order?.items?.map( ( item, index ) => (
                    <div className="w-full flex items-start mb-5">
                        <img
                            src={ `${ item._doc.image?.url }` }
                            alt=""
                            className="w-[80x] h-[80px]"
                        />
                        <div className="w-full">
                            <h5 className="pl-3 text-[20px]">{ item._doc.name }</h5>
                            <h5 className="pl-3 text-[20px] text-[#00000091]">
                                Qty: x{ item.quantity }
                            </h5>
                        </div>
                    </div>
                ) ) }

            <div className="border-t w-full text-right">
                <h4 className="pt-3 text-[20px] font-[600]">
                    Total Price: { order?.totalPrice } DZD
                </h4>
            </div>
            <br />
            <br />
            <div className="w-full 800px:flex items-center">
                <div className="w-full 800px:w-[60%]">
                    <h4 className="pt-3 text-[25px] font-[600]">Shipping Address:</h4>
                    <h4 className="pt-3 text-[20px]">
                        {/* { data?.shippingAddress.address1 +
                            " " +
                            data?.shippingAddress.address2 } */}
                    </h4>
                    <h4 className=" text-[20px] my-5">{ order?.shippingAddress?.postalCode } , { order?.shippingAddress?.city } , { order?.shippingAddress?.street } </h4>
                    <h4 className=" text-[20px]"></h4>
                    <h4 className=" text-[20px]">{ order?.userId?.email }</h4>
                </div>
                <div className="w-full 800px:w-[40%]">
                    <h4 className="pt-3 text-[25px] font-[600]">Payment Info:</h4>
                    <h4 className="pt-3 text-[20px]">
                        Status:{ " " }
                        { order?.paymentResult?.status ? order?.paymentResult?.status : "Not Paid" }
                    </h4>
                </div>
            </div>
            <br />
            <br />
            <h4 className="pt-3 text-[25px] font-[600]">Order Status:</h4>

            <h4 className="pt-3 text-[20px]">
                { order?.status === "Processing refund" ? "Refund Success" : order?.status }
            </h4>




            {/* {
                data?.status !== "Processing refund" && data?.status !== "Refund Success" && (
                    <select
                        value={ status }
                        onChange={ ( e ) => setStatus( e.target.value ) }
                        className="w-[200px] mt-2 border h-[35px] rounded-[5px]"
                    >
                        { [
                            "Processing",
                            "Transferred to delivery partner",
                            "Shipping",
                            "Received",
                            "On the way",
                            "Delivered",
                        ]
                            .slice(
                                [
                                    "Processing",
                                    "Transferred to delivery partner",
                                    "Shipping",
                                    "Received",
                                    "On the way",
                                    "Delivered",
                                ].indexOf( data?.status )
                            )
                            .map( ( option, index ) => (
                                <option value={ option } key={ index }>
                                    { option }
                                </option>
                            ) ) }
                    </select>
                )
            }
            {
                data?.status === "Processing refund" || data?.status === "Refund Success" ? (
                    <select value={ status }
                        onChange={ ( e ) => setStatus( e.target.value ) }
                        className="w-[200px] mt-2 border h-[35px] rounded-[5px]"
                    >
                        { [
                            "Processing refund",
                            "Refund Success",
                        ]
                            .slice(
                                [
                                    "Processing refund",
                                    "Refund Success",
                                ].indexOf( data?.status )
                            )
                            .map( ( option, index ) => (
                                <option value={ option } key={ index }>
                                    { option }
                                </option>
                            ) ) }
                    </select>
                ) : null
            } */}

            {/* <div
                className={ `${ styles.button } mt-5 !bg-[#FCE1E6] !rounded-[4px] text-[#E94560] font-[600] !h-[45px] text-[18px]` }
                onClick={ data?.status !== "Processing refund" ? orderUpdateHandler : refundOrderUpdateHandler }
            >
                Update Status
            </div> */}
        </div >
    )
}

export default OrderDetails
