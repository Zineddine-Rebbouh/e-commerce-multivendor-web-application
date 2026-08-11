import React, { useState } from 'react';
import { Table, Avatar } from 'antd';
import { useQuery } from 'react-query';
import * as apiClient from '../api/api-Client';
import { Loader } from '../components/Loader/Loader';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import { CheckCircleOutline, CancelOutlined } from '@mui/icons-material';

const BootstrapDialog = styled( Dialog )( ( { theme } ) => ( {
    '& .MuiDialogContent-root': {
        padding: theme.spacing( 2 ),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing( 1 ),
    },
} ) );

const Reports = () => {
    const [ open, setOpen ] = useState( false );
    const [ report, setReport ] = useState( {} );
    const { data: reports, isLoading, isError } = useQuery(
        'Reports',
        apiClient.getReports,
        {
            onSuccess: () => {
                console.log( 'Reports fetched successfully' );
            },
            onError: () => {
                console.log( 'Error fetching Reports' );
            },
        }
    );

    console.log( reports );

    const columns = [
        {
            title: 'ID',
            dataIndex: '_id',
            key: '_id',

        },
        {
            title: 'Reported User',
            dataIndex: [ 'reportedUserId', 'name' ],
            key: 'reportedUserId',

        },
        {
            title: 'Reporter User',
            dataIndex: [ 'reporterUserId', 'name' ],
            key: 'reporterUserId',

        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: ( status ) => (
                <span className="rounded-lg p-1 text-sm text-white bg-green-500">
                    { status }
                </span>
            ),
        },
        {
            title: 'Reason',
            dataIndex: 'reason',
            key: 'reason',

        },
        {
            title: 'Date',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: ( createdAt ) => new Date( createdAt ).toLocaleDateString(),
        },
    ];

    const handleOpenDialog = ( row ) => {
        setReport( row );
        setOpen( true );
    };

    const handleCloseDialog = () => {
        setReport( {} );
        setOpen( false );
    };

    if ( isLoading ) return <Loader />;

    return (
        <div className="bg-white p-5 rounded-lg mt-5">
            <h2 className="font-bold mb-5 text-xl text-black">Latest Reports</h2>
            <Table
                dataSource={ reports }
                columns={ columns }
                rowKey="_id"
                pagination={ false }
            />
            <ReportDetails
                report={ report ? report : null }
                handleClose={ handleCloseDialog }
                open={ open }
            />
        </div>
    );
};

export default Reports;

const ReportDetails = ( { report, open, handleClose } ) => {
    console.log( report );

    return (
        <React.Fragment>
            <BootstrapDialog
                onClose={ handleClose }
                aria-labelledby="customized-dialog-title"
                open={ open }
            >
                <DialogTitle sx={ { m: 0, p: 2 } } id="customized-dialog-title">
                    Report Details
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={ handleClose }
                    sx={ {
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: ( theme ) => theme.palette.grey[ 500 ],
                    } }
                >
                    <CloseIcon />
                </IconButton>
                <DialogContent dividers>
                    <Typography gutterBottom>{ report?.reportId }</Typography>
                    <Typography gutterBottom>{ report?.userId }</Typography>
                    <Typography gutterBottom>{ report?.status }</Typography>
                    <Typography gutterBottom>{ report?.createdAt }</Typography>
                    <Typography gutterBottom>{ report?.description }</Typography>
                    <Typography gutterBottom>{ report?.address }</Typography>
                    <Typography gutterBottom>{ report?.email }</Typography>
                    <Typography gutterBottom>{ report?.phoneNumber }</Typography>
                    <Typography gutterBottom>{ report?.zipCode }</Typography>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={ handleClose }>
                        {/* give icon for accept */ }
                        <CheckCircleOutline /> Accept
                    </Button>
                    <Button autoFocus onClick={ handleClose }>
                        <CancelOutlined />
                    </Button>
                </DialogActions>
            </BootstrapDialog>
        </React.Fragment>
    );
};

