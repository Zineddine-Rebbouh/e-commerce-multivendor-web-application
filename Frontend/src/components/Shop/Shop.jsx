import React, { useEffect, useState } from "react";
import ShopSidebar from "./ShopSidebar";
import { useSelector, useDispatch } from "react-redux";
import { getShopDetails } from "../../redux/actions/shop";
import { Loader } from "../Loader/Loader";
import ShopNavbar from "./ShopNavbar";

const ShopProfile = ( { children } ) => {
  const dispatch = useDispatch();
  const [ active, setActive ] = useState( "Shop informations" );

  // Assuming your user state has a isLoading flag
  // Adjust according to your actual Redux state structure
  const { user, isLoading } = useSelector( ( state ) => state.user );
  console.log( user );
  useEffect( () => {
    if ( user && user.shopId )
    {
      dispatch( getShopDetails( user.shopId ) );
    }
  }, [ user ] ); // Safely access shopId

  // Conditional rendering based on isLoading state
  if ( isLoading || !user?.shopId )
  {
    // Checking isLoading and if shopId exists
    return <Loader />;
  }

  return (
    <div className="relative min-h-screen">
      <div className="grid grid-cols-6 space-x-2 min-h-screen">
        {/* ProfileSideBar will take 1 fraction of space */ }
        <div className="col-span-1 ">
          <ShopSidebar active={ active } setActive={ setActive } />
        </div>
        {/* ProfileSections will take the rest */ }
        <div className="col-span-5 space-y-4 px-2 py-4">
          <ShopNavbar />
          { children }
        </div>
      </div>
    </div>
  );
};

export default ShopProfile;
