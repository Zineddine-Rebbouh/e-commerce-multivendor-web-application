import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const roleMap = { admin: "Admin", seller: "Seller" }

const ProtectRoute = ( { children, role } ) => {
    const { isAuthenticated, user } = useSelector( state => state.user )
    if ( !isAuthenticated )
    {
        return <Navigate to="/sign-in" />
    }
    if ( role )
    {
        const requiredRole = roleMap[ role ] || role
        if ( !user || user.role !== requiredRole )
        {
            return <Navigate to="/" replace />
        }
    }
    return children
}

export default ProtectRoute