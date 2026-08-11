import { Table } from 'antd';
import React from 'react';
import { Loader } from '../components/Loader/Loader';
import * as apiClient from '../api/api-Client';
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";



const Revenue = () => {
    // Data for the cards
    const [ transactions, setTransactions ] = useState( [] );

    // const { orders, isLoading } = useSelector( ( state ) => state.order );
    const navigate = useNavigate();

    useEffect( () => {
        const fetchTransactions = async () => {
            try
            {
                const response = await apiClient.getOrders();

                const data = response.orders.map( ( order ) => {
                    // Split the ISO string to extract date and time components
                    const parts = order.createdAt.split( 'T' );
                    const datePart = parts[ 0 ];
                    const timePart = parts[ 1 ].split( '.' )[ 0 ]; // Remove milliseconds

                    // Split the date part to extract year, month, and day
                    const dateParts = datePart.split( '-' );
                    const year = dateParts[ 0 ];
                    const month = dateParts[ 1 ];
                    const day = dateParts[ 2 ];

                    // Construct the formatted date string
                    const formattedDate = `${ new Date( year, month - 1, day ).toLocaleDateString( 'en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                    } ) }, ${ timePart }`;

                    return { ...order, createdAt: formattedDate };
                } );

                console.log( data );

                setTransactions( data );
            } catch ( error )
            {
                console.error( error );
            }
        };

        fetchTransactions();

    }, [] );

    const columns = [
        {
            title: 'Amount',
            dataIndex: 'totalPrice',
            key: 'requestDetails',
            render: ( totalPrice ) => <span className="font-bold">{ totalPrice } DZD</span>
            // render: ( details ) => details.avatar, // Assuming avatar is the "amount" you want to display
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: ( status ) => {
                if ( status === 'Delivered' )
                {
                    return <span className="text-green-100 bg-green-500 p-2 rounded-lg">{ status }</span>;
                }
                if ( status === 'Pending' )
                {
                    return <span className="text-green-200 bg-green-600 p-2 rounded-lg">{ status }</span>;
                } else if ( status === 'Processing' )
                {
                    return <span className="text-yellow-100 bg-yellow-500 p-2 rounded-lg">{ status }</span>;
                } else if ( status === 'Cancelled' )
                {
                    return <span className="text-red-100 bg-red-500 p-2 rounded-lg">{ status }</span>;
                } else
                {
                    // Handle other statuses if needed
                    return <span>{ status }</span>;
                }
            },
        },
        {
            title: 'ID',
            dataIndex: '_id',
            key: '_id',
            StyleSheet: {
                // text size
                fontSize: '12px',
            },
        },
        {
            title: 'Payment Result',
            dataIndex: [ 'paymentResult', 'status' ],
            key: 'paymentResultStatus',
            StyleSheet: {
                // text size
                fontSize: '8px',
            },
            render: ( status ) => {
                return <span className="text-red-100 bg-red-500 py-2 px-4 rounded-lg text-center">{ status }</span>;
            }
        },
        {
            title: 'Customer',
            dataIndex: [ 'userId', 'email' ],
            key: 'Customer',
        },
        {
            title: 'Date',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: ( createdAt ) => new Date( createdAt ).toLocaleDateString(),
        },

    ];

    const totalAmount = transactions.reduce( ( acc, order ) => acc + order.totalPrice, 0 );
    const totalOrders = transactions.length;
    const totalDelivered = transactions.filter( ( order ) => order.status === 'Delivered' ).length;
    const totalPending = transactions.filter( ( order ) => order.status === 'Processing' ).length
    const totalCancelled = transactions.filter( ( order ) => order.status === 'Cancelled' ).length
    const totalRefunded = transactions.filter( ( order ) => order.status === 'Refunded' ).length
    const totalSuccessful = totalDelivered + totalRefunded

    const cardData = [
        { title: 'Total Revenue', value: totalAmount, },
        { title: 'All Orders', value: totalOrders, },
        { title: 'Successful Orders', value: totalSuccessful, },
        { title: 'Pending Orders', value: totalPending, },
        { title: 'Refunded', value: totalRefunded, },
        { title: 'Cancelled', value: totalCancelled, }
    ];

    // if ( isLoading ) return <Loader />;

    return (
        <div className={ "bg-white p-5 rounded-lg mt-5" }>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {/* Map through the card data to create cards */ }
                { cardData.map( ( data, index ) => (
                    <div key={ index } className={ `bg-white rounded-lg p-3 border-2 border-gray-200 ${ data.color }` }>
                        <div className="text-sm mb-4 text-gray-500">{ data.title }</div>
                        <div className="text-sm font-bold text-gray-700">{ data.value }</div>
                    </div>
                ) ) }
            </div>
            <div className='mt-5'>
                <h2 className='font-bold mb-5 text-xl text-black'> Latest Transactions</h2>
                <Table
                    columns={ columns }
                    dataSource={ transactions }
                    rowKey={ ( record ) => record._id }
                    onClick={ ( row ) => navigate( '/profile/order/' + row.id ) } // Pass the id of the clicked row
                    pagination={ { pageSize: 5 } }
                />
            </div>
        </div>
    );
};

export default Revenue;
