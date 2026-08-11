import { React, useState } from "react";
import styles from "../utils/styles";
import { Link, useNavigate } from "react-router-dom";
import { RxAvatar } from "react-icons/rx";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useMutation } from "react-query"
import { ToastContainer, toast } from "react-toastify";
import * as apiClient from "../api/api-Client";

const SellerForm = () => {

    const [ avatar, setAvatar ] = useState();

    const navigate = useNavigate()
    const { user } = useSelector( ( state ) => state.user );

    const { mutate } = useMutation( apiClient.createRequestShop, {
        onError: ( error ) => {
            console.log( "error" );
            toast.error( error.message, {
                position: "top-center",
                autoClose: 1400,

            } );
        }
        , onSuccess: async () => {
            console.log( 'Login success' );
            toast.success( 'Request successfully Sent', {
                position: "top-center",
                autoClose: 1400,

            } );
            setTimeout( () => {
                navigate( "/" )
            }, 2000 )

        },
    } )

    const { register, handleSubmit, formState: { errors } } = useForm()

    const onSubmit = handleSubmit( ( data ) => {
        console.log( data );
        const formData = new FormData();
        formData.append( "name", data.name );
        formData.append( "email", data.email );
        formData.append( "phoneNumber", data.phoneNumber );
        formData.append( "description", data.description );
        formData.append( "address", data.address );
        formData.append( "zipCode", data.zipcode );
        formData.append( "avatar", avatar );


        mutate( formData );
    } )

    const handleFileInputChange = ( e ) => {

        const file = e.target.files[ 0 ];
        const reader = new FileReader();

        reader.onload = () => {
            if ( reader.readyState === 2 )
            {
                setAvatar( e.target.files[ 0 ] );
            }
        };

        reader.readAsDataURL( file );
    };


    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <ToastContainer
                position="top-center"
                autoClose={ 1400 }
            />
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Register as a seller
                </h2>
            </div>
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-[35rem]">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={ onSubmit }>
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Shop Name
                            </label>
                            <div className="mt-1">
                                <input
                                    type="name"
                                    name="name"
                                    { ...register( "name", { required: "This field is required" } ) }
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                                { errors.name && <span className="text-red-400"> { errors.name.message }</span>
                                }
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="phone-number"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Phone Number
                            </label>
                            <div className="mt-1">
                                <input
                                    type="text"
                                    name="phoneNumber"
                                    { ...register( "phoneNumber", { required: "This field is required" } ) }
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                                { errors.phoneNumber && <span className="text-red-400"> { errors.phoneNumber.message }</span>
                                }
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Email address
                            </label>
                            <div className="mt-1">
                                <input
                                    type="email"
                                    name="email"
                                    { ...register( "email", { required: "This field is required" } ) }
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                                {
                                    errors.email && <span className="text-red-400"> { errors.email.message }</span>
                                }
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Description
                            </label>
                            <div className="mt-1">
                                <textarea
                                    rows={ 3 }
                                    cols={ 3 }
                                    type="description"
                                    name="description"
                                    { ...register( "description", { required: "This field is required" } ) }
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                                {
                                    errors.description && <span className="text-red-400"> { errors.description.message }</span>
                                }
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Address
                            </label>
                            <div className="mt-1">
                                <input
                                    type="address"
                                    name="address"
                                    { ...register( "address", { required: "This field is required" } ) }
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                                {
                                    errors.address && <span className="text-red-400"> { errors.address.message }</span>
                                }
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Zip Code
                            </label>
                            <div className="mt-1">
                                <input
                                    type="number"
                                    name="zipcode"
                                    { ...register( "zipcode", { required: "This field is required" } ) }
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                                {
                                    errors.zipcode && <span className="text-red-400"> { errors.zipcode.message }</span>
                                }
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="avatar"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Avatar
                            </label>
                        </div>

                        <div>
                            <label
                                htmlFor="avatar"
                                className="block text-sm font-medium text-gray-700"
                            ></label>
                            <div className="mt-2 flex items-center">
                                <span className="inline-block h-8 w-8 rounded-full overflow-hidden">
                                    { avatar ? (
                                        <img
                                            src={ avatar }
                                            alt="avatar"
                                            className="h-full w-full object-cover rounded-full"
                                        />
                                    ) : (
                                        <RxAvatar className="h-8 w-8" />
                                    ) }
                                </span>
                                <label
                                    htmlFor="file-input"
                                    className="ml-5 flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                >
                                    <span>Upload a file</span>
                                    <input
                                        type="file"
                                        name="avatar"
                                        id="file-input"
                                        accept=".jpg,.jpeg,.png"
                                        { ...register( "avatar" ) }
                                        onChange={ handleFileInputChange }
                                        className="sr-only"
                                    />
                                    {
                                        errors.avatar && <span className="text-red-400"> { errors.avatar.message }</span>
                                    }
                                </label>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="group relative w-full h-[40px] flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                            >
                                Submit
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default SellerForm;
