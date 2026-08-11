import React, { useState } from 'react';
import { Table, Avatar, Modal, Typography, Button } from 'antd';
import { useQuery } from 'react-query';
import * as apiClient from '../api/api-Client';
import { Loader } from '../components/Loader/Loader';
import { EyeOutlined, DeleteOutlined } from '@ant-design/icons';

const Shops = () => {
    const [ visible, setVisible ] = useState( false );
    const [ selectedShop, setSelectedShop ] = useState( {} );
    const { data: shops, isLoading } = useQuery(
        'Shops',
        apiClient.getShops,
        {
            onSuccess: () => {
                console.log( 'Shops fetched successfully' );
            },
            onError: () => {
                console.log( 'Error fetching Shops' );
            },
        }
    );

    const columns = [
        {
            title: 'ID',
            dataIndex: '_id',
            key: '_id',
        },
        {
            title: 'Avatar',
            dataIndex: 'name',
            key: 'name',
            render: ( name, record ) => (
                <Avatar src={ record.avatar } size={ 42 } />
            ),
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Phone Number',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            render: ( description ) => description.slice( 0, 50 ),
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Zip Code',
            dataIndex: 'zipCode',
            key: 'zipCode',
        },
        {
            title: 'Date Created',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: ( createdAt ) => new Date( createdAt ).toLocaleDateString(),
        },
        {
            title: 'Action',
            dataIndex: 'actions',
            key: 'actions',
            render: ( _, record ) => (
                <>
                    <Button
                        type="text"
                        icon={ <EyeOutlined /> }
                        onClick={ () => handleOpenDialog( record ) }
                    />
                    <Button
                        type="text"
                        icon={ <DeleteOutlined /> }
                        onClick={ () => handleDelete( record._id ) }
                    />
                </>
            ),
        },
    ];

    const handleOpenDialog = ( row ) => {
        setSelectedShop( row );
        setVisible( true );
    };

    const handleCloseDialog = () => {
        setSelectedShop( {} );
        setVisible( false );
    };

    const handleDelete = async ( id ) => {
        try
        {
            await apiClient.deleteShop( id );
            console.log( 'Shop deleted successfully' );
        } catch ( error )
        {
            console.error( 'Error deleting Shop', error );
        }
    };

    if ( isLoading ) return <Loader />;

    return (
        <div className="bg-white p-5 rounded-lg mt-5">
            <h2 className="font-bold mb-5 text-xl text-black">List of Shops</h2>
            <Table
                dataSource={ shops }
                columns={ columns }
                rowKey="_id"
                pagination={ false }
            />
            <Modal
                title="Shop Details"
                visible={ visible }
                onCancel={ handleCloseDialog }
                footer={ [
                    <Button key="close" onClick={ handleCloseDialog }>
                        Close
                    </Button>,
                ] }
            >
                <Typography.Paragraph>
                    <strong>ID:</strong> { selectedShop._id }
                </Typography.Paragraph>
                <Typography.Paragraph>
                    <strong>Shop Name:</strong> { selectedShop.name }
                </Typography.Paragraph>
                <Typography.Paragraph>
                    <strong>Email:</strong> { selectedShop.email }
                </Typography.Paragraph>
                <Typography.Paragraph>
                    <strong>Phone Number:</strong> { selectedShop.phoneNumber }
                </Typography.Paragraph>
                <Typography.Paragraph>
                    <strong>Description:</strong> { selectedShop.description }
                </Typography.Paragraph>
                <Typography.Paragraph>
                    <strong>Address:</strong> { selectedShop.address }
                </Typography.Paragraph>
                <Typography.Paragraph>
                    <strong>Zip Code:</strong> { selectedShop.zipCode }
                </Typography.Paragraph>
                <Typography.Paragraph>
                    <strong>Date Created:</strong>{ ' ' }
                    { new Date( selectedShop.createdAt ).toLocaleDateString() }
                </Typography.Paragraph>
            </Modal>
        </div>
    );
};

export default Shops;
