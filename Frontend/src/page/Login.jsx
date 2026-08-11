import { React, useEffect, useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import styles from "../utils/styles";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import * as apiClient from "../api/api-Client";
import { ToastContainer, toast } from "react-toastify";

import { useSelector } from "react-redux";

const Login = () => {
  const [ visible, setVisible ] = useState( false );
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();


  // Navigate back to the stored URL

  const { isAuthenticated } = useSelector( ( state ) => state.user );
  console.log( isAuthenticated );
  useEffect( () => {
    if ( isAuthenticated === true )
    {
      navigate( "/" );
    }
  }, [ isAuthenticated ] );

  const { mutate } = useMutation( apiClient.Login, {
    onError: ( error ) => {
      console.log( "error" );
      toast.error( error.message, {
        position: "top-center",
        autoClose: 1400,
      } );
    },
    onSuccess: async () => {
      console.log( "Login success" );
      toast.success( "Login success", {
        position: "top-center",
        autoClose: 1400,
      } );
      setTimeout( () => {
        const redirectUrl = sessionStorage.getItem( "redirectUrl" );
        if ( redirectUrl )
        {
          sessionStorage.removeItem( "redirectUrl" )
          navigate( redirectUrl );
        } else
        {
          // If there's no stored URL, navigate to a default page
          navigate( "/" );
        }
        navigate( "/" );
        window.location.reload();
      }, 2000 );
    },
  } );

  const onSubmit = handleSubmit( ( data ) => {
    mutate( data );
  } );

  return (
    <div>
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 md:px-8 lg:px-12">
        {/* <ToastContainer position="top-center" autoClose={ 5000 } /> */ }
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Login to your account
          </h2>
        </div>
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={ onSubmit }>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="email"
                    { ...register( "email", {
                      required: "This field is required",
                    } ) }
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  { errors.email && (
                    <p className="text-red-500 text-xs mt-1">
                      { errors.email.message }
                    </p>
                  ) }
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
                    type={ visible ? "text" : "password" }
                    name="password"
                    autoComplete="current-password"
                    { ...register( "password", {
                      required: "This field is Required ",
                      minLength: {
                        value: 6,
                        message:
                          "Passowrd should contain 6 caraceters at least",
                      },
                    } ) }
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  { errors.password && (
                    <span className="text-red-500">
                      { errors.password.message }
                    </span>
                  ) }

                  { visible ? (
                    <AiOutlineEye
                      className="absolute right-2 top-2 cursor-pointer"
                      size={ 25 }
                      onClick={ () => setVisible( false ) }
                    />
                  ) : (
                    <AiOutlineEyeInvisible
                      className="absolute right-2 top-2 cursor-pointer"
                      size={ 25 }
                      onClick={ () => setVisible( true ) }
                    />
                  ) }
                </div>
              </div>
              <div className={ `${ styles.noramlFlex } justify-between` }>
                <div className={ `${ styles.noramlFlex }` }>
                  <input
                    type="checkbox"
                    name="remember-me"
                    id="remember-me"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <a
                    href=".forgot-password"
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Forgot your password?
                  </a>
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
                <h4>Not have any account?</h4>
                <Link to="/sign-up" className="text-blue-600 pl-2">
                  Sign Up
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
