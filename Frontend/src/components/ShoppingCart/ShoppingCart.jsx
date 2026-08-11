import React, { useState, useEffect } from "react";
import Container from "../../layout/Container";
import { Divider } from "@mui/material";
import Button from "../Buttons/AddToCartButton";
import { useDispatch, useSelector } from "react-redux";
import { getUserCartItems, removeFromCart, updateCart } from "../../redux/actions/cart";
import * as apiClient from "../../api/api-Client";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";

const ShoppingCart = () => {
  const { cart } = useSelector( ( state ) => state.cart );
  const { user } = useSelector( ( state ) => state.user );
  const [ cartItems, setCartItems ] = useState( cart );
  const dispatch = useDispatch();
  const cartCounter = cart.length;
  const navigate = useNavigate()

  useEffect( () => {
    // Initialize the quantity of each product to 1 by default
    // const initializedCartItems = cart.map((product) => ({
    //   ...product,
    //   quantity: 1,
    // }));
    setCartItems( cart );
  }, [ cart ] );

  console.log( cart );

  const removeProductFromCart = ( productId ) => {
    console.log( productId );
    const userId = user?._id;
    dispatch( removeFromCart( productId, userId ) );
  };

  const [ amount, setAmount ] = useState( 0 );

  useEffect( () => {
    let totalPrice = 0;
    cartItems.forEach( ( product ) => {
      totalPrice += product.price * product.quantity;
    } );
    setAmount( totalPrice );
  }, [ cartItems ] );

  const { mutate } = useMutation( apiClient.checkout, {
    onSuccess: ( data ) => {
      console.log( data );
      window.location = data.url;
    },
    onError: ( error ) => {
      console.error( "Checkout failed:", error );
    },
  } );

  const handleIncreaseQuantity = ( productId ) => {
    // Update the quantity in the local state
    const updatedCartItems = cartItems.map( ( item ) =>
      item._id === productId ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCartItems( updatedCartItems )

    // Dispatch the action with the updated cart items
    dispatch( updateCart( updatedCartItems ) )
  }

  const handleDecreaseQuantity = ( productId ) => {
    // Update the quantity in the local state
    const updatedCartItems = cartItems.map( ( item ) =>
      item._id === productId && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    setCartItems( updatedCartItems );
    // Dispatch the action with the updated cart items
    dispatch( updateCart( updatedCartItems ) );
  };


  const handlecheckout = async () => {
    if ( user )
    {
      mutate( cartItems, user );
    } else
    {
      sessionStorage.setItem( "redirectUrl", window.location.pathname );
      navigate( '/sign-in' )
    }
  }



  return (
    <div>
      <Container>
        <div className=" flex gap-10 py-16 px-10 flex-col md:flex-row ">
          <div className="w-full md:w-2/3">
            <p className="font-bold text-2xl">
              Shopping Cart ( { cartCounter } items)
            </p>
            <hr className="my-6" />
            { cart?.length === 0 ? (
              <p className="text-heading4">Your cart is empty</p>
            ) : (
              <div>
                { cart?.map( ( product ) => (
                  <div
                    key={ product.id }
                    className="w-full flex hover:bg-grey-1 px06 py-5 items-center justify-between"
                  >
                    <div className="flex items-center">
                      <img
                        src={ product.image?.url }
                        alt={ product.name }
                        width={ 100 }
                        height={ 100 }
                        className="rounded-lg w-32 h-32 object-contain"
                      />
                      <div className="flex flex-col gap-3 ml-4">
                        <p className="text-body-bold">{ product.name }</p>
                        <div className="flex flex-col justify-center gap-2">
                          <div className="flex gap-8 items-center ">
                            <div className="font-semibold text-slate-600">
                              Quantity :
                            </div>
                            <div className="flex gap-4 items-center text-base">
                              <button
                                className="border border-slate-500 px-2 rounded flex items-center justify-center"
                                onClick={ () => handleDecreaseQuantity( product._id ) }
                              >
                                -
                              </button>
                              <div>{ product.quantity }</div>
                              <button
                                className="border border-slate-500 px-2 rounded flex items-center justify-center"
                                onClick={ () => handleIncreaseQuantity( product._id ) }
                              >
                                +
                              </button>
                            </div>
                          </div>
                          <div className="w-[70px]">
                            <button
                              className="text-slate-500 underline"
                              onClick={ () => removeProductFromCart( product._id ) }
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) ) }
              </div>
            ) }
          </div>
          <Divider orientation="vertical" flexItem />
          <div className="w-full md:w-1/3">
            <div>
              <p className="font-bold text-2xl">Order Summary</p>
              <hr className="my-6" />
              { cartItems.map( ( product ) => (
                <div
                  key={ product.id }
                  onChange={ ( product ) => setAmount( amount + product.price ) }
                >
                  <div className="flex justify-between">
                    <p className="text-body">* { product.name }</p>
                    <p className="text-body">{ product.isHavingDiscount ? product.discountedPrice : product.price } DZD</p>
                  </div>
                </div>
              ) ) }
              <hr className="my-6" />
              <div className="flex justify-between mb-4">
                <p className="font-bold">Total</p>
                <p className="font-bold">{ amount } DZD</p>
              </div>
              <Button
                onClick={ () => handlecheckout() }
                label={ "Proccde to checkout" }
              />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ShoppingCart;
