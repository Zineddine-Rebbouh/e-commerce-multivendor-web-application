import React, { useEffect, useState } from "react";
import ProfileSideBar from "./ProfileSideBar";
import ProfileSections from "./ProfileSections";
import Container from "../../layout/Container";
import { useSelector, useDispatch } from "react-redux";
import { getAllOrdersOfUser } from "../../redux/actions/order";
import { Loader } from "../Loader/Loader";

const ProfileCustomer = ( { children } ) => {
  const [ active, setActive ] = useState( 1 );
  const dispatch = useDispatch();
  const { user, isLoading, isAuthenticated } = useSelector( ( state ) => state.user );

  // useEffect( () => {
  //   if ( user && user._id )
  //   {
  //     dispatch( getAllOrdersOfUser( user._id ) );
  //   }
  // }, [ dispatch, user?._id ] );



  if ( isLoading )
  {
    return <Loader />;
  }

  return (
    <div className="p-8">
      <Container>
        <div className="grid grid-cols-6 space-x-2 min-h-[720px]">
          <div className="col-span-1">
            <ProfileSideBar active={ active } setActive={ setActive } />
          </div>
          <div className="col-span-5">
            { children }
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ProfileCustomer;
