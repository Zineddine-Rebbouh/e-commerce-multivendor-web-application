import React, { useState } from "react";
import { AiOutlineCamera } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import styles from "../../utils/styles";
import Avatar from "../Header/NavBar/Avatar";
import { Loader } from "../Loader/Loader";
import Orders from "./sections/Orders";

const ProfileSections = ( { active } ) => {
  const { user } = useSelector( ( state ) => state.user );
  const [ name, setName ] = useState( user && user.name );
  const [ email, setEmail ] = useState( user && user.email );
  const [ phoneNumber, setPhoneNumber ] = useState( 0 );
  const [ password, setPassword ] = useState( "" );
  const [ avatar, setAvatar ] = useState( null );
  const dispatch = useDispatch();

  console.log( user );
  const handleSubmit = ( e ) => {
    // e.preventDefault();
    // dispatch( updateUserInformation( name, email, phoneNumber, password ) );
  };

  if ( !user )
  {
    return <Loader />;
  }




};

export default ProfileSections;
