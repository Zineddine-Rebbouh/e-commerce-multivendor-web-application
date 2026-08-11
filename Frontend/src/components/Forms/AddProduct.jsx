import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as apiClient from '../../api/api-Client';
import { ToastContainer, toast } from "react-toastify";
import { useMutation, useQueryClient, useQuery } from "react-query";
import { useSelector } from "react-redux";
import { AiOutlineClose } from 'react-icons/ai';

const AddProduct = ( { onClose, product } ) => {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  const [ loading, setLoading ] = useState( false );
  const [ previewImage, setPreviewImage ] = useState( null );
  const { user } = useSelector( ( state ) => state.user );
  const queryClient = useQueryClient();

  const { data: categories } = useQuery( "categories", apiClient.getCateogries );
  const addProductMutation = useMutation( apiClient.addProdcut, {
    onError: ( error ) => {
      toast.error( error.message, { position: "top-center", autoClose: 1400 } );
    },
    onSuccess: () => {
      toast.success( 'Product added successfully', { position: "top-center", autoClose: 1400 } );
      queryClient.invalidateQueries( 'products' );
      onClose();
    },
  } );

  const editProductMutation = useMutation( apiClient.addProdcut, {
    onError: ( error ) => {
      toast.error( error.message, { position: "top-center", autoClose: 1400 } );
    },
    onSuccess: () => {
      toast.success( 'Product updated successfully', { position: "top-center", autoClose: 1400 } );
      queryClient.invalidateQueries( 'products' );
      onClose();
    },
  } );

  useEffect( () => {
    if ( product )
    {
      setValue( "productName", product.name );
      setValue( "description", product.description );
      setValue( "price", product.price );
      setValue( "category", product.categoryId?._id );
      setValue( "quantity", product.available_quantity );
      setValue( "discount", product.discount ? product.discount.discount_rate : 0 );
      setPreviewImage( product.image?.url );
    }
  }, [ product, setValue ] );

  const onImageChange = ( event ) => {
    if ( event.target.files && event.target.files[ 0 ] )
    {
      const reader = new FileReader();
      reader.onload = ( e ) => {
        setPreviewImage( e.target.result );
      };
      reader.readAsDataURL( event.target.files[ 0 ] );
    }
  };

  const onSubmit = handleSubmit( ( data ) => {
    setLoading( true );
    const formData = new FormData();
    formData.append( "name", data.productName );
    formData.append( "description", data.description );
    formData.append( "price", data.price );
    formData.append( "category", data.category );
    formData.append( "quantity", data.quantity );
    formData.append( "discount", data.discount ? data.discount : 0 );
    formData.append( "start_date", data.start_date );
    formData.append( "end_date", data.end_date );

    formData.append( "url", data.avatar[ 0 ] ? data.avatar[ 0 ] : null );

    formData.append( "userId", user._id );

    // Check if product exists (if editing)
    if ( product )
    {
      formData.append( "productId", product._id ); // Include product ID for editing
      formData.append( "status", "edit" ); // Include status as edit
    } else
    {
      formData.append( "status", "add" ); // Include status as add
    }

    if ( product )
    {
      editProductMutation.mutate( formData );
    } else
    {
      addProductMutation.mutate( formData );
    }

    setLoading( false );
  } );

  return (
    <div className="fixed top-0 left-0 w-full min-h-screen flex justify-center items-center z-50">
      <ToastContainer position="top-center" autoClose={ 1400 } />
      <div className="absolute top-0 left-0 w-full h-full bg-gray-900 opacity-65"></div>
      <div className="z-50 bg-white py-4 px-8 rounded-lg overflow-auto">
        <form className="w-[600px]" onSubmit={ onSubmit }>
          <h1 className='font-medium text-2xl mb-4'>{ product ? 'Update' : 'Add' } Product Form</h1>
          <div className="flex flex-wrap -mx-3 mb-3">
            {/* Product Name */ }
            <div className="w-full px-3">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Product Name</label>
              <input
                className="appearance-none block w-full bg-white text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                type="text"
                name="productName"
                placeholder="Product Name"
                { ...register( "productName", { required: "Product Name is required" } ) }
              />
              { errors.productName && (
                <p className="text-red-500 text-xs italic">{ errors.productName.message }</p>
              ) }
            </div>
            {/* Description */ }
            <div className="w-full px-3">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Description</label>
              <textarea
                className="appearance-none block w-full bg-white text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                name="description"
                rows={ 7 }
                placeholder="Description"
                { ...register( "description", { required: "Description is required" } ) }
              />
              { errors.description && (
                <p className="text-red-500 text-xs italic">{ errors.description.message }</p>
              ) }
            </div>
            {/* Price */ }
            <div className="w-full md:w-1/2 px-3 mb-3 md:mb-0">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Price</label>
              <input
                className="appearance-none block w-full bg-white text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                type="number"
                name="price"
                placeholder="Price"
                { ...register( "price", { required: "Price is required" } ) }
              />
              { errors.price && (
                <p className="text-red-500 text-xs italic">{ errors.price.message }</p>
              ) }
            </div>
            {/* Quantity */ }
            <div className="w-full md:w-1/2 px-3 mb-3 md:mb-0">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Quantity</label>
              <input
                className="appearance-none block w-full bg-white text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                type="number"
                name="quantity"
                placeholder="Quantity"
                { ...register( "quantity", { required: "Quantity is required" } ) }
              />
              { errors.quantity && (
                <p className="text-red-500 text-xs italic">{ errors.quantity.message }</p>
              ) }
            </div>
            {/* Discount */ }
            <div className="w-full md:w-1/2 px-3 mb-3 md:mb-0">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Discount</label>
              <input
                className="appearance-none block w-full bg-white text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                type="number"
                name="discount"
                placeholder="Discount"
                defaultValue={ 0 }
                { ...register( "discount" ) }
              />
              { errors.discount && (
                <p className="text-red-500 text-xs italic">{ errors.discount.message }</p>
              ) }
            </div>
            {/* Start Date and End Date */ }
            <div className="flex flex-wrap -mx-3 mb-3">
              <div className="w-full md:w-1/2 px-3 mb-3 md:mb-0">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Start Date</label>
                <input
                  className="appearance-none block w-full bg-white text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                  type="date"
                  name="start_date"
                  placeholder="Start Date"
                  { ...register( "start_date" ) }
                />
              </div>
              <div className="w-full md:w-1/2 px-3 mb-3 md:mb-0">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">End Date</label>
                <input
                  className="appearance-none block w-full bg-white text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                  type="date"
                  name="end_date"
                  placeholder="End Date"
                  { ...register( "end_date" ) }
                />
              </div>
            </div>
            {/* Category */ }
            <div className="w-full md:w-1/2 px-3 mb-3 md:mb-0">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Category</label>
              <select
                className="appearance-none block w-full bg-white text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                name="category"
                { ...register( "category", { required: "Category is required" } ) }
              >
                <option value="">Select a category</option>
                { categories?.map( ( category ) => (
                  <option key={ category._id } value={ category._id }>
                    { category.name }
                  </option>
                ) ) }
              </select>
              { errors.category && (
                <p className="text-red-500 text-xs italic">{ errors.category.message }</p>
              ) }
            </div>
          </div>
          {/* Product Image */ }
          <div className="flex flex-wrap -mx-3 mb-3">
            <div className="w-full px-3">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Product Image</label>
              <div className="flex items-center">
                { previewImage && (
                  <img src={ previewImage } alt="Product Preview" className="w-24 h-24 object-cover mr-4" />
                ) }
                <input
                  className="appearance-none block w-full bg-white text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
                  type="file"
                  name="avatar"
                  { ...register( "avatar" ) }
                  onChange={ onImageChange }
                />
              </div>
            </div>
          </div>
          {/* Buttons */ }
          <div className="flex items-center justify-end px-2 gap-2">
            <button
              className="bg-white text-blue-500 py-2 px-4 rounded border border-indigo-500"
              onClick={ onClose }
            >
              Cancel
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
              type="submit"
              disabled={ loading }
            >
              { product ? 'Update' : 'Add' } Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


export default AddProduct;
