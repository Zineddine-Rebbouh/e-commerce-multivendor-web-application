import * as apiClient from '../api/api-Client'
import { useEffect, useState } from "react";
import { Loader } from '../components/Loader/Loader'

const Transactions = () => {
    const [ transactions, setTransactions ] = useState( [] );

    // const { data: orders, isLoading, isError } = useQuery( "transactions", apiClient.getOrders,
    //     {
    //         onSuccess: () => {
    //             console.log( "Data fetched successfully" );
    //         },
    //         onError: () => {
    //             console.log( "Error fetching data" );
    //         }
    //     }
    // );

    useEffect( () => {
        const fetchTransactions = async () => {
            try
            {
                const response = await apiClient.getOrders();

                const data = response.orders.map( ( order ) => { return { ...order, createdAt: new Date( order.createdAt ).toLocaleDateString() } } );
                setTransactions( data );
            } catch ( error )
            {
                console.error( error );
            }
        };
        fetchTransactions();
    }, [] );

    console.log( transactions );
    if ( !transactions ) return <Loader />

    return (
        <div className="bg-white p-5 rounded-lg mt-5">
            <h2 className={ "font-bold mb-5 text-xl text-black" }> Latest Transactions</h2>
            <table className={ "w-full" }>
                <thead>
                    <tr>
                        <td className="font-semibold">ID</td>
                        <td className="font-semibold">Status</td>
                        <td className="font-semibold">Date</td>
                        <td className="font-semibold">Amount</td>
                    </tr>
                </thead>
                <tbody>
                    { transactions.map( ( order, index ) => (
                        <tr key={ index }>
                            <td className="py-4">
                                <div className={ "flex gap-1.5 items-center" }>
                                    { order._id }
                                </div>
                            </td>
                            <td className="">
                                <span className={ "rounded-lg p-1 text-sm text-white bg-green-500" }>
                                    { order.status }
                                </span>
                            </td>
                            <td>{ order.createdAt }</td>
                            <td>{ order.totalPrice } DZD</td>
                        </tr>
                    ) ) }
                </tbody>
            </table>
        </div>
    );
};

export default Transactions;
