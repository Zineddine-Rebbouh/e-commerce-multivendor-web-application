import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import { useNavigate } from 'react-router-dom';
import { Table } from 'antd';

const Refund = () => {
    const [ ordersList, setOrdersList ] = useState( [] );
    const { orders } = useSelector( ( state ) => state.order );
    const navigate = useNavigate();

    useEffect( () => {
        if ( orders )
        {
            console.log( orders );
            // Filter refunded orders
            const refundedOrders = orders.filter( o => o.status === 'Refunded' );
            // Format the filtered orders
            const formattedOrders = refundedOrders.map( ( o ) => ( {
                key: o._id,
                name: o.userId.name,
                status: o.status,
                createdAt: format( new Date( o.createdAt ), "yyyy-MM-dd" ),
            } ) );
            setOrdersList( formattedOrders );
        }
    }, [ orders ] );

    const columns = [
        { title: "ID", dataIndex: "key", key: "key", width: 420 },
        { title: "Name", dataIndex: "name", key: "name", width: 300 },
        { title: "Status", dataIndex: "status", key: "status", width: 250 },
        { title: "Created Date", dataIndex: "createdAt", key: "createdAt", width: 250 },
    ];

    return (
        <div style={ { height: "100%", width: "100%" } }>
            <Table
                className="w-full h-full border border-gray-200"
                columns={ columns }
                dataSource={ ordersList }
                pagination={ { pageSize: 5 } }
                onRow={ ( record ) => ( {
                    onClick: () => {
                        navigate( '/profile/order/' + record.key );
                    },
                } ) }
                rowKey="key"
            />
        </div>
    );
};

export default Refund;
