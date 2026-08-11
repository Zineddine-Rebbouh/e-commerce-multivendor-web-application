import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Loader } from '../../Loader/Loader';
import { useQuery } from 'react-query';
import { Button, Input, Table } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import * as apiClient from '../../../api/api-Client';

const Refunds = () => {
    const navigate = useNavigate(); // initialize navigate
    const [ searchTerm, setSearchTerm ] = useState( '' );
    const [ orders, setOrders ] = useState( [] );
    const { shop, isLoading } = useSelector( ( state ) => state.shop );

    const { data: ordersData, isLoading: isLoadingOrders } = useQuery( 'orders', () => apiClient.getShopOrdersByShopId( shop?._id ) );
    console.log( ordersData );
    useEffect( () => {
        if ( ordersData )
        {
            setOrders( ordersData );
        }
    }
        , [ ordersData ] );

    const handleSearch = ( e ) => {
        setSearchTerm( e.target.value );
    };

    const statusOptions = [
        { label: 'Pending', value: 'Pending', style: { color: 'blue', fontWeight: 'bold' } },
        { label: 'Processing', value: 'Processing', style: { color: 'orange', fontWeight: 'bold' } },
        { label: 'Shipped', value: 'Shipped', style: { color: 'green', fontWeight: 'bold' } },
        { label: 'Delivered', value: 'Delivered', style: { color: 'purple', fontWeight: 'bold' } },
        { label: 'Cancelled', value: 'Cancelled', style: { color: 'red', fontWeight: 'bold' } },
        { label: 'On Hold', value: 'On Hold', style: { color: 'gray', fontWeight: 'bold' } },
        { label: 'Refunded', value: 'Refunded', style: { color: 'brown', fontWeight: 'bold' } },
        { label: 'Returned', value: 'Returned', style: { color: 'navy', fontWeight: 'bold' } },
        { label: 'Backordered', value: 'Backordered', style: { color: 'teal', fontWeight: 'bold' } },
        { label: 'Partially Shipped', value: 'Partially Shipped', style: { color: 'maroon', fontWeight: 'bold' } },
    ];


    const handleStatusChange = async ( e, orderId ) => {
        const status = e.target.value; // Retrieve the selected status value
        try
        {
            // Make the API call to update the status
            await apiClient.updateOrderStatus( orderId, status );
            // Update the status in the local state
            const updatedOrders = orders.map( order => {
                if ( order.orderId._id === orderId )
                {
                    return {
                        ...order,
                        orderId: {
                            ...order.orderId,
                            status: status
                        }
                    };
                }
                return order;
            } );
            setOrders( updatedOrders );
            // Display success message
            message.success( 'Status updated successfully!' );
        } catch ( error )
        {
            // Display error message if API call fails
            message.error( 'Failed to update status. Please try again.' );
            console.error( 'Error updating status:', error );
        }
    };


    const columns = [
        {
            title: 'Order ID',
            dataIndex: [ 'orderId', '_id' ],
            key: 'orderId',
        },
        {
            title: 'Customer Name',
            dataIndex: [ 'orderId', 'userId', 'name' ],
            key: 'customerName',
        },
        {
            title: 'Price ( DZD)',
            dataIndex: [ 'orderId', 'totalPrice' ],
            key: 'price',
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'Status',
            dataIndex: [ 'orderId', 'status' ],
            key: 'status',
            render: ( text, record ) => (
                <select value={ text } onChange={ ( e ) => handleStatusChange( e, record.orderId._id ) }>
                    { statusOptions.map( ( option ) => (
                        <option key={ option.value } value={ option.value } selected={ option.value === text } style={ option.style }>
                            { option.label }
                        </option>
                    ) ) }
                </select>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: ( text, record ) => (
                <span className='space-x-2'>
                    {/* <Button icon={ <EditOutlined /> } onClick={ () => handleEdit( record ) }></Button> */ }
                    <Button icon={ <DeleteOutlined /> } onClick={ () => deleteOrder( record._id ) }></Button>
                </span>
            ),
        },
    ];

    // const filteredOrders = orders.filter( ( order ) =>
    //     order.items[ 0 ].name.toLowerCase().includes( searchTerm.toLowerCase() )
    // );

    return (
        <div className='p-4' style={ { boxShadow: "2px 4px 16px #0000001c" } }>
            <h1 className='font-medium text-2xl mb-4'>Refunds Management</h1>
            <div className='flex justify-between ' style={ { marginBottom: '1rem' } }>
                <Input
                    placeholder="Search by product name"
                    value={ searchTerm }
                    onChange={ handleSearch }
                    style={ { width: 500, marginRight: '1rem' } }
                />
            </div>
            <Table columns={ columns } dataSource={ orders }
                rowKey={ ( record ) => record._id }
                onClick={ ( row ) => navigate( '/profile/order/' + row.id ) } // Pass the id of the clicked row
                pagination={ { pageSize: 5 } }
                loading={ isLoading }
            />
        </div>
    );
};

export default Refunds;
