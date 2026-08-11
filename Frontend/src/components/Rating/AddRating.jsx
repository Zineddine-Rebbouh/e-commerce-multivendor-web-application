import React, { useState, useEffect } from 'react';
import Rating from '@mui/material/Rating';
import { useForm } from 'react-hook-form';
import * as apiClient from '../../api/api-Client'; // Assuming apiClient handles file uploads
import { useParams } from 'react-router-dom';
import { useMutation } from 'react-query';
import { useSelector } from 'react-redux';

const AddRating = () => {
    const { id } = useParams();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [ rating, setRating ] = useState( 0 );
    const [ isLoading, setIsLoading ] = useState( false );
    const [ screenshots, setScreenshots ] = useState( [] ); // Array to store selected screenshots

    const { mutate } = useMutation( ( data ) => apiClient.addRating( data ), {
        onSuccess: ( data ) => {
            console.log( "Rating added:", data );
        },
    } );

    const handleRatingChange = ( event, newValue ) => {
        setRating( newValue );
    };

    const handleScreenshotChange = ( event ) => {
        const newScreenshots = Array.from( event.target.files ); // Convert FileList to array
        setScreenshots( newScreenshots );
    };

    const onSubmit = async ( formData ) => {
        setIsLoading( true );
        console.log( formData )
        console.log( rating )
        // Prepare FormData
        const dataToSend = new FormData();
        dataToSend.append( 'rating', rating );
        dataToSend.append( 'comment', formData.comment );

        // Append screenshots (if any)
        screenshots.forEach( ( screenshot ) => {
            dataToSend.append( 'screenshots', screenshot ); // Use appropriate key for backend
        } );

        const data = {
            rating: rating,
            comment: formData.comment,
            screenshots: screenshots,
            id: id
        }

        console.log( data );

        mutate( data ); // Send data to backend
        setIsLoading( false );
        // Clear report form fields and screenshots after submission
        setRating( 0 );
        setScreenshots( [] );
    };

    return (
        <div className='flex flex-col gap-2 max-w-[500px] py-5'>
            <h1 className='text-2xl font-bold'>Add Rating</h1>
            <form onSubmit={ handleSubmit( onSubmit ) }>
                <Rating
                    name="rating"
                    value={ rating }
                    onChange={ handleRatingChange }
                />
                { errors.rating && <span className="text-red-500">Rating is required</span> }
                <textarea
                    rows={ 3 }
                    className='border-none bg-gray-100 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'
                    { ...register( "comment", { required: true } ) }
                    placeholder='Add your comment'
                />
                { errors.comment && <span className="text-red-500">Comment is required</span> }

                {/* Screenshot upload section */ }
                <label htmlFor="screenshots">Add Screenshots (optional):</label>
                <input
                    type="file"
                    id="screenshots"
                    multiple // Allow multiple file selection
                    accept="image/*" // Restrict file types (adjust as needed)
                    onChange={ handleScreenshotChange }
                />
                { screenshots.length > 0 && (
                    <ul>
                        { screenshots.map( ( screenshot, index ) => (
                            <img key={ index } src={ URL.createObjectURL( screenshot ) } alt={ screenshot } className='w-[100px] h-[100px] object-cover' />
                        ) ) }
                    </ul>
                ) }

                <button
                    type="submit"
                    className='w-[100px] bg-blue-500 text-white px-4 py-2 rounded-md'
                    disabled={ isLoading }
                >
                    { isLoading ? 'Loading...' : 'Submit' }
                </button>
            </form>
        </div>
    );
};

export default AddRating;