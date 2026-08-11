import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import * as apiClient from '../../api/api-Client';
import { useQuery } from 'react-query';
import { Loader } from '../../components/Loader/Loader';

const UserShopProfile = () => {
    const [ shop, setShop ] = useState( {} );
    const { id } = useParams();

    const { data, isLoading, isError, error } = useQuery( [ 'shop', id ], () => apiClient.getShop( id ), {
        enabled: !!id
    } );

    useEffect( () => {
        if ( data )
        {
            setShop( data );
            console.log( data );
        }
    }, [ data ] );

    return (
        <div>
            { isLoading ? (
                <div> <Loader /> </div>
            ) : isError ? (
                <div>Error: { error.message }</div>
            ) : (
                <div>
                    {/* Render shop details */ }
                </div>
            ) }
        </div>
    );
};

export default UserShopProfile;
