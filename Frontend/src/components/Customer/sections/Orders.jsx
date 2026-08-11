import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { format, differenceInDays } from "date-fns";
import { useNavigate } from 'react-router-dom';
import { Table, Button, notification } from 'antd';
import { useMutation } from 'react-query';
import * as apiClient from "../../../api/api-Client";

const Orders = () => {
  const [ ordersList, setOrdersList ] = useState( [] );
  const { orders } = useSelector( ( state ) => state.order );
  const navigate = useNavigate();
  const { mutate } = useMutation( 'orders', apiClient.refundOrder );

  useEffect( () => {
    if ( orders )
    {
      const formattedOrders = orders
        .filter( ( o ) => !o.refunded )
        .map( ( o ) => ( {
          key: o._id,
          name: o.userId.name,
          status: o.status,
          createdAt: format( new Date( o.createdAt ), "yyyy-MM-dd" ),
        } ) );
      setOrdersList( formattedOrders );
    }
  }, [ orders ] );

  const handleRefund = async ( orderId ) => {
    const order = orders.find( ( o ) => o._id === orderId );
    const daysSinceOrder = differenceInDays( new Date(), new Date( order.createdAt ) );
    if ( daysSinceOrder > 7 )
    {
      notification.error( {
        message: 'Refund Error',
        description: 'Cannot refund after 7 days of shipment',
      } );
    } else
    {
      try
      {
        await mutate( orderId );
        console.log( `Refund for order ${ orderId }` );
        notification.success( {
          message: 'Refund Successful',
          description: `Order refunded successfully: ${ orderId }`,
        } );
      } catch ( error )
      {
        console.error( error );
        notification.error( {
          message: 'Refund Error',
          description: 'Error refunding order',
        } );
      }
    }
  };

  const columns = [
    { title: "ID", dataIndex: "key", key: "key", width: 420 },
    { title: "Name", dataIndex: "name", key: "name", width: 300 },
    { title: "Status", dataIndex: "status", key: "status", width: 250 },
    { title: "Created Date", dataIndex: "createdAt", key: "createdAt", width: 250 },
    {
      title: "Refund",
      key: "refund",
      width: 150,
      render: ( text, record ) => {
        const order = orders.find( ( o ) => o._id === record.key );
        return order.status !== 'Refunded' ? (
          <Button type="primary" danger onClick={ () => handleRefund( record.key ) }>
            Refund
          </Button>
        ) : null;
      },
    },
  ];

  return (
    <div style={ { height: "100%", width: "100%" } }>
      <Table
        className="w-full h-full border bprder-gray-200"
        columns={ columns }
        dataSource={ ordersList }
        pagination={ { pageSize: 5 } }
        onRow={ ( record ) => ( {
          onClick: ( event ) => {
            if ( !event.target.closest( '.ant-table-cell' )?.getAttribute( 'data-col' ) )
            {
              navigate( '/profile/order/' + record.key );
            }
          },
        } ) }
        rowKey="key"
      />
    </div>
  );
};

export default Orders;
