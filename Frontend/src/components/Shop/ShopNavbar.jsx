import React from 'react'
import { MdOutlineChat, MdPublic, MdSearch } from 'react-icons/md'
import NotificationCount from '../Header/NavBar/NotificationCount'

const ShopNavbar = () => {
    return (
        <div className={ 'p-5 rounded-sm bg-white flex items-center justify-between border border-gray-200' }>
            <div className={ 'text-black font-bold capitalize text-xl' }>Dashboard</div>
            <div className={ 'flex items-center gap-5 ' }>
                <div className={ 'flex items-center gap-2.5 p-2.5 rounded-md bg-slate-100 border-2 ' }>
                    <MdSearch />
                    <input type="text" placeholder="Search..." className={ 'bg-transparent border-none text-gray-800 ' } />
                </div>
                <div className={ 'flex items-center gap-5' }>
                    <MdOutlineChat size={ 20 } className="text-gray-700 cursor-pointer" />
                    <NotificationCount iconColor="#374151" iconSize={ 24 } />
                    <MdPublic size={ 20 } className="text-gray-700 cursor-pointer" />
                </div>
            </div>
        </div>
    )
}

export default ShopNavbar
