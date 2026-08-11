import React, { useState } from 'react'
import Sidebar from './Sidebar'
import Navigation from './Navigation'

const Admin = ( { children } ) => {
    const [ activeSection, setActiveSection ] = useState( '/dashboard' );

    const handleSectionClick = ( path ) => {
        setActiveSection( path );
    };
    return (
        <div className='grid grid-cols-5 bg-slate-200'>
            <div className='col-span-1 bg-[#ffffff] p-5 '>
                <Sidebar onSectionClick={ handleSectionClick } activeSection={ activeSection } />
            </div>
            <div className='col-span-4 p-5 min-h-screen'>
                <Navigation activeSection={ activeSection } />
                { children }
            </div>
        </div>
    )
}

export default Admin
