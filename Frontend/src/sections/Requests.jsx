import React, { useState } from 'react';
import { Table, Avatar, Button, Modal, Typography, Space, Input } from 'antd';
import { useQuery } from 'react-query';
import * as apiClient from '../api/api-Client';
import { Loader } from '../components/Loader/Loader';
import { CheckCircleOutlined, CloseOutlined } from '@ant-design/icons';

const Requests = () => {
    const [ open, setOpen ] = useState( false );
    const [ request, setRequest ] = useState( {} );
    const [ rejectReason, setRejectReason ] = useState( '' );
    const [ rejectPopup, setRejectPopup ] = useState( false );
    const { data: transactions, isLoading, isError } = useQuery(
        'Requests',
        apiClient.getRequestsShop,
        {
            onSuccess: () => {
                console.log( 'Requests fetched successfully' );
            },
            onError: () => {
                console.log( 'Error fetching Requests' );
            },
        }
    );

    console.log( transactions );

    const columns = [
        {
            title: 'ID',
            dataIndex: '_id',
            key: '_id',
        },
        {
            title: 'User',
            dataIndex: [ 'userId', 'name' ],
            key: 'name',
            render: ( name, record ) => (
                <Space>
                    <Avatar src={ record.userId.avatar } />
                    <span>{ name }</span>
                </Space>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'requestStatus',
            key: 'requestStatus',
            render: ( status ) => (
                <span className="rounded-lg p-1 text-sm text-white bg-green-500">
                    { status }
                </span>
            ),
        },
        {
            title: 'Date',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: ( createdAt ) =>
                new Date( createdAt ).toLocaleDateString(),
        },
        {
            title: 'Action',
            key: 'action',
            render: ( _, record ) => (
                <Button type="link" onClick={ () => handleOpenDialog( record ) }>
                    View
                </Button>
            ),
        },
    ];

    const handleOpenDialog = ( row ) => {
        setRequest( row );
        setOpen( true );
    };

    const handleCloseDialog = () => {
        setRequest( {} );
        setOpen( false );
    };

    const handleAccept = async ( id ) => {
        console.log( 'Accept' );
        try
        {
            await apiClient.approveShopRequest( id );
        } catch ( error )
        {
            console.error( 'Error accepting request', error );
        }
        handleCloseDialog();
    };

    const OpenrejectRequest = async ( id ) => {
        console.log( 'Reject' );
        setRejectPopup( true );
    };

    const closeRejectPopup = () => {
        setRejectPopup( false );
    };

    const handleReject = async ( id ) => {
        console.log( 'Reject with Reason:', rejectReason );
        try
        {
            await apiClient.rejectShopRequest( id, rejectReason );
        } catch ( error )
        {
            console.error( 'Error rejecting request', error );
        }
        handleCloseDialog();
    };

    if ( isLoading ) return <Loader />;

    return (
        <div className="bg-white p-5 rounded-lg mt-5">
            <h2 className="font-bold mb-5 text-xl text-black">
                Request Applayment
            </h2>
            <Table
                dataSource={ transactions }
                columns={ columns }
                rowKey="_id"
                pagination={ false }
            />
            <RequestsDetails
                request={ request ? request : null }
                handleClose={ handleCloseDialog }
                open={ open }
                handleReject={ handleReject }
                handleAccept={ handleAccept }
                setRejectReason={ setRejectReason }
                rejectReason={ rejectReason }
                rejectPopup={ rejectPopup }
                OpenrejectRequest={ OpenrejectRequest }
                closeRejectPopup={ closeRejectPopup }
            />
        </div>
    );
};

export default Requests;

const RequestsDetails = ( {
    request,
    open,
    handleClose,
    handleReject,
    handleAccept,
    rejectReason,
    setRejectReason,
    rejectPopup,
    OpenrejectRequest,
    closeRejectPopup,
} ) => {
    console.log( request );

    const handleRejectConfirm = () => {
        // Call handleReject function with request ID
        handleReject( request._id );
        // Close the reject reason modal
        closeRejectPopup();
    };

    return (
        <>
            <Modal
                title="Request Details"
                visible={ open }
                onCancel={ handleClose }
                footer={ [
                    <Button
                        key="accept"
                        type="primary"
                        onClick={ () => handleAccept( request._id ) }
                        icon={ <CheckCircleOutlined /> }
                    >
                        Accept
                    </Button>,
                    <Button
                        key="reject"
                        danger
                        onClick={ OpenrejectRequest }
                        icon={ <CloseOutlined /> }
                    >
                        Reject
                    </Button>,
                ] }
            >
                <Typography.Paragraph>
                    <strong>Name: </strong>
                    { request?.requestDetails?.name }
                </Typography.Paragraph>
                <Typography.Paragraph>
                    <strong>Status: </strong>
                    { request?.requestStatus }
                </Typography.Paragraph>
                <Typography.Paragraph>
                    <strong>Date: </strong>
                    { new Date( request?.createdAt ).toLocaleDateString() }
                </Typography.Paragraph>
                <Typography.Paragraph>
                    <strong>Description: </strong>
                    { request?.requestDetails?.description }
                </Typography.Paragraph>
                <Typography.Paragraph>
                    <strong>Address: </strong>
                    { request?.requestDetails?.address }
                </Typography.Paragraph>
                <Typography.Paragraph>
                    <strong>Email: </strong>
                    { request?.requestDetails?.email }
                </Typography.Paragraph>
                <Typography.Paragraph>
                    <strong>Phone Number: </strong>
                    { request?.requestDetails?.phoneNumber }
                </Typography.Paragraph>
                <Typography.Paragraph>
                    <strong>Zip Code: </strong>
                    { request?.requestDetails?.zipCode }
                </Typography.Paragraph>
            </Modal>
            <Modal
                title="Enter Reason for Rejection"
                visible={ rejectPopup }
                onOk={ handleRejectConfirm } // Call handleRejectConfirm when OK button is clicked
                onCancel={ closeRejectPopup }
            >
                <Input.TextArea
                    rows={ 4 }
                    value={ rejectReason }
                    required
                    onChange={ ( e ) => setRejectReason( e.target.value ) }
                    placeholder="Enter reason for rejection"
                />
            </Modal>
        </>
    );
};

