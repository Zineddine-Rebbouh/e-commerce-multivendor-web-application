import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as apiClient from '../api/api-Client'

const SingleUserPage = () => {
    const [ user, setUser ] = useState( {} );
    const { id } = useParams();

    console.log( id );

    useEffect( () => {
        const fetchUser = async () => {
            try
            {
                const response = await apiClient.getUser( id );
                console.log( response );
                setUser( response.user );
            }
            catch ( error )
            {
                console.error( error );
            }
        };
        fetchUser();
    }, [ id ] );


    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 py-5 h-screen">
            <div className="col-span-1 bg-white p-5 rounded-lg font-bold text-black h-max">
                <div className="w-full h-[300px] relative rounded-md overflow-hidden mb-5">
                    <img className="object-cover w-full h-full" src={ user.avatar } alt="" fill />
                </div>
                { user.name }
            </div>
            <div className="col-span-3 p-5 bg-white rounded-lg flex flex-col flex-grow">
                <form className="relative flex flex-col flex-grow">
                    <input
                        className="p-3 border-2 border-solid border-[#2e374a] rounded-sm bg-white text-gray-300 my-2.5 mx-0"
                        type="hidden"
                        name="id"
                        value={ user._id }
                    />
                    <label className="text-sm">Username</label>
                    <input
                        className="p-3 border-2 border-solid border-[#2e374a] rounded-sm bg-white text-gray-300 my-2.5 mx-0"
                        type="text"
                        name="username"
                        placeholder={ user.name }
                    />
                    <label className="text-sm">Email</label>
                    <input
                        className="p-3 border-2 border-solid border-[#2e374a] rounded-sm bg-white text-gray-300 my-2.5 mx-0"
                        type="email"
                        name="email"
                        placeholder={ user.email }
                    />
                    {/* <label className="text-sm">Password</label>
                    <input
                        className="p-3 border-2 border-solid border-[#2e374a] rounded-sm bg-white text-gray-300 my-2.5 mx-0"
                        type="password"
                        name="password"
                    /> */}
                    <label className="text-sm">Phone</label>
                    <input
                        className="p-3 border-2 border-solid border-[#2e374a] rounded-sm bg-white text-gray-300 my-2.5 mx-0"
                        type="text"
                        name="phone"
                        placeholder={ user.phoneNumber }
                    />
                    <label className="text-sm">Address</label>
                    <textarea
                        className="p-3 border-2 border-solid border-[#2e374a] rounded-sm bg-white text-gray-300 my-2.5 mx-0 flex-grow"
                        type="text"
                        name="address"
                        placeholder={ user.address }
                    />
                    <label className="text-sm">Role</label>
                    <input
                        className="p-3 border-2 border-solid border-[#2e374a] rounded-sm bg-white text-gray-300 my-2.5 mx-0"
                        type="text"
                        name="phone"
                        placeholder={ user.role }
                    />
                </form>
            </div>
        </div>
    );
};

export default SingleUserPage;