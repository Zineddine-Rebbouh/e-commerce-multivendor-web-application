import { Box } from '@mui/material'
import React from 'react'
import { Outlet } from 'react-router-dom'
import { useMediaQuery } from 'react-responsive'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import Navbar from '../page/Seller/Navbar'
import Sidebar from '../page/Seller/Sidebar'


const LayoutSeller = () => {
    // const isNonMobile = useMediaQuery( "(min-width: 600px)" );
    const [ isSidebarOpen, setIsSidebarOpen ] = useState( true );
    const { user } = useSelector( ( state ) => state.user );
    return (
        // display={ isNonMobile ? "flex" : "block" }
        <Box width="100%" height="100%">
            <Sidebar
                user={ user || {} }
                drawerWidth="250px"
                isSidebarOpen={ isSidebarOpen }
                setIsSidebarOpen={ setIsSidebarOpen }
            />
            <Box flexGrow={ 1 }>
                <Navbar
                    user={ user || {} }
                    isSidebarOpen={ isSidebarOpen }
                    setIsSidebarOpen={ setIsSidebarOpen }
                />
                <Outlet />
            </Box>
        </Box>
    )
}

export default LayoutSeller
