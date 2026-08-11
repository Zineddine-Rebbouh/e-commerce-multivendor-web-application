import React, { useState, useEffect } from 'react';
import { Table, Input, Button } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import AddProduct from '../components/Forms/AddProduct';
import * as apiClient from '../api/api-Client'
const Events = () => {
    const navigate = useNavigate();
    const [ searchTerm, setSearchTerm ] = useState( '' );
    const [ showAddForm, setShowAddForm ] = useState( false );
    const { shop } = useSelector( ( state ) => state.shop );
    const [ products, setProducts ] = useState( [] );
    const [ productToEdit, setProductToEdit ] = useState( null );

    const handleHideForm = () => {
        setShowAddForm( false );
        setProductToEdit( null );
    };

    const handleAddProduct = () => {
        setProductToEdit( null );
        setShowAddForm( true );
    };

    const { data: productsData } = useQuery( 'products', () => apiClient.getProdutctsByShopId( shop._id ) );

    useEffect( () => {
        if ( productsData )
        {
            setProducts( productsData );
        }
    }, [ productsData ] );

    const handleSearch = ( e ) => {
        setSearchTerm( e.target.value );
    };

    const deleteProduct = async ( id ) => {
        try
        {
            await apiClient.deleteProduct( id );
            setProducts( products.filter( ( product ) => product._id !== id ) );
        } catch ( error )
        {
            console.error( 'Error deleting product:', error );
        }
    };

    const handleEdit = ( product ) => {
        setProductToEdit( product );
        setShowAddForm( true );
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            sorter: ( a, b ) => a.name.localeCompare( b.name ),
        },
        {
            title: 'Price ( DZD)',
            dataIndex: 'price',
            key: 'price',
            sorter: ( a, b ) => Number( a.price.slice( 1 ) ) - Number( b.price.slice( 1 ) ),
        },
        {
            title: 'Image',
            dataIndex: [ 'image', 'url' ],
            key: 'image',
            render: ( text ) => <img src={ text } alt="Product" style={ { width: '2.5rem', height: '2.5rem' } } />,
        },
        {
            title: 'Category',
            dataIndex: [ 'categoryId', 'name' ],
            key: 'categoryName',
            sorter: ( a, b ) => a.categoryId.name.localeCompare( b.categoryId.name ),
        },
        {
            title: 'Stock',
            dataIndex: 'available_quantity',
            key: 'available_quantity',
            sorter: ( a, b ) => a.stock - b.stock,
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            ellipsis: {
                showTitle: false,
            },
        },
        {
            title: 'Action',
            key: 'action',
            render: ( text, record ) => (
                <span className='space-x-2'>
                    <Button icon={ <EditOutlined /> } onClick={ () => handleEdit( record ) } />
                    <Button icon={ <DeleteOutlined /> } onClick={ () => deleteProduct( record._id ) } />
                </span>
            ),
        },
    ];

    const filteredProducts = products
        .filter( ( product ) =>
            product.name.toLowerCase().includes( searchTerm.toLowerCase() )
        )
        .map( ( product ) => ( { ...product, key: product._id } ) );

    return (
        <div className='bg-white p-5 rounded-lg mt-5' style={ { boxShadow: "2px 4px 16px #0000001c" } }>
            <h1 className='font-medium text-2xl mb-4'>Events Management</h1>
            { showAddForm && (
                <AddProduct onClose={ handleHideForm } product={ productToEdit } />
            ) }
            <div className='flex justify-between ' style={ { marginBottom: '1rem' } }>
                <Input
                    placeholder="Search by product name"
                    value={ searchTerm }
                    onChange={ handleSearch }
                    style={ { width: 500, marginRight: '1rem' } }
                />
                <Button onClick={ handleAddProduct }>Add Events</Button>
            </div>
            <Table columns={ columns } dataSource={ filteredProducts }
                rowKey={ ( record ) => record._id }
            />
        </div>
    );
};

export default Events;
