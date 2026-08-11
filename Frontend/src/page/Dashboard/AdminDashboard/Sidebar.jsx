import React, { useState } from 'react'
import {
    MdDashboard,
    MdSupervisedUserCircle,
    MdShoppingBag,
    MdAttachMoney,
    MdWork,
    MdAnalytics,
    MdPeople,
    MdOutlineSettings,
    MdHelpCenter,
    MdLogout,
    MdEvent,
    MdCategory,
} from "react-icons/md";

import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import photoProfile from '../../../assets/photoProfile.jpg'
import { useMutation } from 'react-query'
import * as apiClient from '../../../api/api-Client'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'



const Sidebar = ( { onSectionClick, activeSection } ) => {

    const { user } = useSelector( ( state ) => state.user );
    console.log( user );


    const navigate = useNavigate();

    const { mutate } = useMutation( apiClient.logout, {
        onError: ( error ) => {
            console.log( "error" );
            toast.error( error.message, {
                position: "top-center",
                autoClose: 1400,
            } );
        },
        onSuccess: async () => {
            console.log( "Logout success" );
            toast.success( "Logout success", {
                position: "top-center",
                autoClose: 1400,
            } );
            setTimeout( () => {
                navigate( "/" );
                window.location.reload();
            }, 2000 );
        },
    } );

    const handleLogOut = () => {
        mutate();
    };


    const menuItems = [
        {
            title: "Pages",
            list: [
                {
                    title: "Dashboard",
                    path: "/dashboard",
                    icon: <MdDashboard />,
                },
                {
                    title: "Users",
                    path: "/dashboard/users",
                    icon: <MdSupervisedUserCircle />,
                },
                {
                    title: "Categories",
                    path: "/dashboard/categories",
                    icon: <MdCategory />,
                },
                {
                    title: "Products",
                    path: "/dashboard/products",
                    icon: <MdShoppingBag />,
                },
                {
                    title: "Transactions",
                    path: "/dashboard/transactions",
                    icon: <MdAttachMoney />,
                },
            ],
        },
        {
            title: "Analytics",
            list: [
                {
                    title: "Revenue",
                    path: "/dashboard/revenue",
                    icon: <MdWork />,
                },
                {
                    title: "Events",
                    path: "/dashboard/events",
                    icon: <MdEvent />, // Use MdEvent icon for "Events"
                },
                {
                    title: "Reports",
                    path: "/dashboard/reports",
                    icon: <MdAnalytics />,
                },
                {
                    title: "Requests",
                    path: "/dashboard/requests",
                    icon: <MdPeople />,
                },
                {
                    title: "Shops",
                    path: "/dashboard/shops",
                    icon: <MdPeople />,
                },
            ],
        },
        {
            title: "User",
            list: [
                {
                    title: "Settings",
                    path: "/dashboard/settings",
                    icon: <MdOutlineSettings />,
                },
                {
                    title: "Help",
                    path: "/dashboard/help",
                    icon: <MdHelpCenter />,
                },
            ],
        },
    ];

    // if ( !user )
    // {
    //     return <Loader />
    // }



    return (
        <div className='flex flex-col sticky top-[40px] h-screen'>
            <ToastContainer position="top-center" autoClose={ 1400 } />
            <div className='flex items-center gap-5 mt-5 mb-7'>
                <img
                    className='object-cover rounded-full'
                    src={ user?.avatar ? user.avatar : photoProfile }
                    alt=""
                    width="50"
                    height="50"
                />
                <div className={ 'flex flex-col' }>
                    <span className='font-bold'>zinou lite</span>
                    <span className=''>Administrator</span>
                </div>
            </div>
            <ul className="list-none ">
                { menuItems.map( ( cat ) => (
                    <li key={ cat.title }>
                        <span className="font-bold my-[10px] mx-0">{ cat.title }</span>
                        { cat.list.map( ( item, index ) => (
                            <div key={ index }>
                                <Link
                                    onClick={ () => onSectionClick( item.path ) }
                                    to={ item.path } className={ `p-5 flex items-center gap-2.5 hover:bg-gray-300 my-1.5 mx-0 rounded-sm ${ activeSection === item.path ? "active:bg-gray-400" : "" }` }>
                                    <span>{ item.icon }</span>
                                    <span>{ item.title }</span>
                                </Link>
                            </div>
                        ) ) }
                    </li>
                ) ) }
            </ul>
            <button onClick={ handleLogOut } className='bg-transparent p-5 my-1.5 flex items-center gap-2.5 rounded-md cursor-pointer border-none w-full bg-none hover:bg-gray-300 '>
                <MdLogout />
                Logout
            </button>
        </div>
    )
}

export default Sidebar
