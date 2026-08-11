import { React, useEffect, useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import styles from "../utils/styles";
import { Link, useNavigate } from "react-router-dom";
import { RxAvatar } from "react-icons/rx";
import { useForm } from "react-hook-form"
import { useMutation } from "react-query"
import * as apiClient from "../api/api-Client"
import { ToastContainer, toast } from "react-toastify";
import { useSelector } from "react-redux";


const Singup = () => {
    //create states
    const [ visible1, setVisible1 ] = useState( false );
    const [ visible2, setVisible2 ] = useState( false );
    const [ avatar, setAvatar ] = useState( null );

    //initialize react-hook-form
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm()

    //initialize react-router-dom
    const navigate = useNavigate();
    const { isAuthenticated } = useSelector( ( state ) => state.user );

    //useEffect to check if the user is authenticated
    useEffect( () => {
        if ( isAuthenticated === true )
        {
            navigate( "/" );
        }
    }, [] )

    //initialize react-query
    const { mutate } = useMutation( apiClient.register, {
        onError: ( error ) => {
            toast.error( error.message, {
                position: "top-center",
                autoClose: 1400,
            } );
        }
        , onSuccess: async () => {
            console.log( 'register success' );
            toast.success( 'register success', {
                position: "top-center",
                autoClose: 1400,

            } );

            setTimeout( () => {
                navigate( "/sign-in" )
            }, 2200 )

        },
    } )

    //handle submit
    const onSubmit = handleSubmit( ( data ) => {
        console.log( data );
        const formData = new FormData();
        formData.append( "name", data.name );
        formData.append( "email", data.email );
        formData.append( "phoneNumber", data.phoneNumber );
        formData.append( "password", data.password );
        formData.append( "confirmPassword", data.confirmPassword );
        formData.append( "avatar", avatar );

        mutate( formData );

    } )


    //handle file input change
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
        <div >
            <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                <ToastContainer
                    position="top-center"
                    autoClose={ 1400 }
                />
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Register as a new user
                    </h2>
                </div>
                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                        <form className="space-y-6" onSubmit={ onSubmit } >
                            <div>
                                <label
                                    htmlFor="name"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Full Name
                                </label>
                                <div className="mt-1">
                                    <input
                                        type={ "text" }
                                        name="name"
                                        { ...register( "name", { required: "This field is required" } ) }
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    />
                                    { errors.name && <span className="text-red-500">{ errors.name.message }</span> }
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
                                        type={ "text" }
                                        name="email"
                                        { ...register( "email", { required: "This field is required" } ) }
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    />
                                    { errors.email && <span className="text-red-500">{ errors.email.message }</span> }

                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="phoneNumber"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Phone number
                                </label>
                                <div className="mt-1">
                                    <input
                                        type={ "text" }
                                        name="phoneNumber"
                                        { ...register( "phoneNumber", { required: "This field is required" } ) }
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    />
                                    { errors.phoneNumber && <span className="text-red-500">{ errors.phoneNumber.message }</span> }

                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Password
                                </label>
                                <div className="mt-1 relative">
                                    <input
                                        type={ visible1 ? "text" : "password" }
                                        name="password"
                                        autoComplete="current-password"
                                        { ...register( 'password', { required: 'This field is Required ', minLength: { value: 6, message: 'Passowrd should contain 6 caraceters at least' } } ) }
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    />
                                    { errors.password && <span className="text-red-500">{ errors.password.message }</span> }

                                    { visible1 ? (
                                        <AiOutlineEye
                                            className="absolute right-2 top-2 cursor-pointer"
                                            size={ 25 }
                                            onClick={ () => setVisible1( false ) }
                                        />
                                    ) : (
                                        <AiOutlineEyeInvisible
                                            className="absolute right-2 top-2 cursor-pointer"
                                            size={ 25 }
                                            onClick={ () => setVisible1( true ) }
                                        />
                                    ) }
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="confirmPassword"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Confirm Password
                                </label>
                                <div className="mt-1 relative">
                                    <input
                                        type={ visible2 ? "text" : "password" }
                                        name="confirmPassword"
                                        { ...register( 'confirmPassword', {
                                            validate: ( val ) => {
                                                if ( !val )
                                                {
                                                    return "This field is Required  "
                                                } else if ( watch( "password" ) !== val )
                                                {
                                                    return 'Passwords do not match'
                                                }
                                            }
                                        } ) }
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    />
                                    { errors.confirmPassword && <span className="text-red-500">{ errors.confirmPassword.message }</span> }

                                    { visible2 ? (
                                        <AiOutlineEye
                                            className="absolute right-2 top-2 cursor-pointer"
                                            size={ 25 }
                                            onClick={ () => setVisible2( false ) }
                                        />
                                    ) : (
                                        <AiOutlineEyeInvisible
                                            className="absolute right-2 top-2 cursor-pointer"
                                            size={ 25 }
                                            onClick={ () => setVisible2( true ) }
                                        />
                                    ) }
                                </div>
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
                                        { errors.avatar && <span className="text-red-500">{ errors.avatar.message }</span> }
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
                            <div className={ `${ styles.noramlFlex } w-full` }>
                                <h4>Already have an account?</h4>
                                <Link to="/sign-in" className="text-blue-600 pl-2">
                                    Sign In
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div >

    );
};

export default Singup;
