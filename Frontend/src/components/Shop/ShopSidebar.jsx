import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RxPerson } from "react-icons/rx";
import { AiOutlineLogin, AiOutlineMessage } from "react-icons/ai";
import { HiOutlineReceiptRefund, HiOutlineShoppingBag } from "react-icons/hi";
import { MdOutlineAdminPanelSettings, MdOutlineTrackChanges } from "react-icons/md";
import { MdOutlineDashboard } from "react-icons/md";
import { ChevronLast, ChevronFirst } from "lucide-react";
import { Loader } from "../Loader/Loader";

const ShopSidebar = ( { active, setActive } ) => {
    const [ expanded, setExpanded ] = useState( true );

    const { user } = useSelector( ( state ) => state.user );
    const { shop, isLoading } = useSelector( ( state ) => state.shop );



    const getClassName = ( index ) => ( active === index ? "text-red" : "" );

    if ( isLoading )
    {
        return <Loader />;
    }



    // Function to generate className based on active state

    return (
        <aside className="h-screen">
            <nav className={ `h-full flex flex-col bg-white border-r shadow-sm  ${ expanded ? "" : "w-24" }` }>
                <div className="p-4 pb-2 flex justify-between items-center">
                    <h1 className={ `text-2xl font-semiboldoverflow-hidden transition-all ${ expanded ? "w-45" : "w-0 text-white" }` } >{ shop?.name }</h1>
                    {/* <img
                        src="https://img.logoipsum.com/243.svg"
                        className={ `overflow-hidden transition-all ${ expanded ? "w-32" : "w-0"
                            }` }
                        alt=""
                    /> */}
                    <button
                        onClick={ () => setExpanded( ( curr ) => !curr ) }
                        className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
                    >
                        { expanded ? <ChevronFirst /> : <ChevronLast /> }
                    </button>
                </div>

                <ul className="flex-1 px-3 mt-20 space-y-6">
                    <SidebarItem
                        icon={ <MdOutlineDashboard size={ 20 } /> }
                        text="Dashboard"
                        path="/"
                        active={ active === 1 }
                        expanded={ expanded }
                    />
                    <SidebarItem
                        icon={ <RxPerson size={ 20 } /> }
                        text="Profile"
                        path="/profile"
                        active={ active === 2 }
                        expanded={ expanded }
                    />
                    <SidebarItem
                        icon={ <AiOutlineMessage size={ 20 } /> }
                        text="Products"
                        path="/products"
                        active={ active === 3 }
                        expanded={ expanded }
                    />
                    {/* <SidebarItem
                        icon={ <AiOutlineMessage size={ 20 } /> }
                        text="Events"
                        path="/events"
                        active={ active === 4 }
                        expanded={ expanded }
                    /> */}
                    <SidebarItem
                        icon={ <HiOutlineShoppingBag size={ 20 } /> }
                        text="Orders"
                        path="/orders"
                        active={ active === 5 }
                        expanded={ expanded }
                    />
                    <SidebarItem
                        icon={ <HiOutlineReceiptRefund size={ 20 } /> }
                        text="Refunds"
                        path="/refunds"
                        active={ active === 6 }
                        expanded={ expanded }
                    />
                </ul>

                <div className="border-t flex p-3">
                    <img
                        src={ user.avatar }
                        alt=""
                        className="w-10 h-10 rounded-md"
                    />
                    <div
                        className={ `
                            flex justify-between items-center
                            overflow-hidden transition-all ${ expanded ? "w-52 ml-3" : "w-0"
                            }` }
                    >
                        <div className="leading-4">
                            <h4 className="font-semibold">{ user.name }</h4>
                            <span className="text-xs text-gray-600">{ user.email }</span>
                        </div>
                        <MdOutlineTrackChanges size={ 20 } />
                    </div>
                </div>
            </nav>
        </aside>
    );
};

export default ShopSidebar;

const SidebarItem = ( { icon, text, active, expanded, path } ) => (
    <Link to={ `/shop${ path }` }
        className={ `
            relative flex items-center py-2 px-3 my-1 gap-4
            font-medium rounded-md cursor-pointer
            transition-colors group
            ${ active ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800"
                : "hover:bg-indigo-50 text-gray-600"
            }
        `}
    >
        { icon }
        <span className={ `overflow-hidden transition-all ${ expanded ? "" : "w-0"
            }` }>
            { text }
        </span>
        { expanded && (
            <div
                className={ `
                    absolute right-2 w-2 h-2 rounded bg-indigo-400
                    ${ expanded ? "" : "top-2"
                    }` }
            />
        ) }
        { !expanded && (
            <div
                className={ `
                    absolute left-full rounded-md px-2 py-1 ml-6
                    bg-indigo-100 text-indigo-800 text-sm
                    invisible opacity-20 -translate-x-3 transition-all
                    group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
                `}
            >
                { text }
            </div>
        ) }
    </Link>
);

