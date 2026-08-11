import { Link } from "react-router-dom";
import Search from "../components/Search/search";
import Pagination from "../components/pagination";
import { useEffect, useState } from "react";
import * as apiClient from '../api/api-Client'
import { Loader } from "../components/Loader/Loader";

const User = () => {

    const [ users, setUsers ] = useState( [] );

    useEffect( () => {
        const fetchUsers = async () => {
            try
            {
                const response = await apiClient.getUsers();

                const data = response.users.map( ( user ) => { return { ...user, createdAt: new Date( user.createdAt ).toLocaleDateString() } } );
                setUsers( data );
            } catch ( error )
            {
                console.error( error );
            }
        }
        fetchUsers();
    }, [] );

    console.log( users );

    const handleDeleteUser = async id => {

        setUsers( users.filter( user => user._id !== id ) );
        await apiClient.removeUser( id );

        console.log( "User deleted" );
    }

    const count = users.length;


    return (
        <div className="bg-white p-5 rounded-lg mt-5">
            <div className="">
                <Search placeholder="Search for a user..." />
            </div>
            <table className="w-full">
                <thead>
                    <tr>
                        <td className="p-5 font-semibold">Name</td>
                        <td className="p-5 font-semibold">Email</td>
                        <td className="p-5 font-semibold">Created At</td>
                        <td className="p-5 font-semibold">Role</td>
                        <td className="p-5 font-semibold">Action</td>
                    </tr>
                </thead>
                <tbody>
                    { users.map( ( user ) => (
                        <tr key={ user._id } >
                            <td className="py-2">
                                <div className="flex items-center gap-2">
                                    <img
                                        src={ user.avatar || "/noavatar.png" }
                                        alt=""
                                        width={ 40 }
                                        height={ 40 }
                                        className="object-cover rounded-full"
                                    />
                                    { user.name }
                                </div>
                            </td>
                            <td>{ user.email }</td>
                            <td>{ user.createdAt?.toString().slice( 4, 16 ) }</td>
                            <td>{ user.role }</td>
                            {/* <td>
                                <span className={ "rounded-lg p-1 text-sm text-white bg-green-500" }>
                                    { user.isActive ? "confirmed" : "pending" }                                </span>
                            </td> */}
                            <td>
                                <div className="flex gap-1 items-center">
                                    <Link to={ `/dashboard/users/${ user._id }` }>
                                        <button className="border-none py-1 px-2 rounded-md text-white bg-green-400 cursor-pointer">
                                            View
                                        </button>
                                    </Link>
                                    <button onClick={ () => handleDeleteUser( user._id ) } className="border-none py-1 px-2 rounded-md text-white bg-red-400 cursor-pointer">
                                        Delete
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ) ) }
                </tbody>
            </table>
            <Pagination count={ count } />
        </div >
    );
};

export default User;