import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AiOutlineCamera } from 'react-icons/ai';
import { TextField, Button, Avatar } from '@mui/material';
import { Loader } from '../../../components/Loader/Loader'; // Make sure you have a Loader component
import { updateUserInformation } from '../../../redux/actions/user';
import { useMutation } from 'react-query';
import * as apiClient from "../../../api/api-Client";
import { Modal } from 'antd';
import { toast } from 'react-toastify';
import { clearWishlist } from '../../../redux/actions/wishlist';
import { clearCart } from '../../../redux/actions/cart';

const CustomerProfile = () => {
    const dispatch = useDispatch();
    const { user } = useSelector( ( state ) => state.user );
    console.log( user );
    const [ name, setName ] = useState( user?.name || '' );
    const [ email, setEmail ] = useState( user?.email || '' );
    const [ phoneNumber, setPhoneNumber ] = useState( user?.phoneNumber || '' );
    const [ avatar, setAvatar ] = useState( null );
    const [ avatarPreview, setAvatarPreview ] = useState( user?.avatar || '' );
    const [ isModalVisible, setIsModalVisible ] = useState( false );

    const handleImageChange = ( e ) => {
        if ( e.target.files && e.target.files[ 0 ] )
        {
            const file = e.target.files[ 0 ];
            setAvatar( file );

            // Preview the selected image
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview( reader.result );
            };
            reader.readAsDataURL( file );
        }
    };

    const handleSubmit = ( e ) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append( 'name', name );
        formData.append( 'email', email );
        formData.append( 'phoneNumber', phoneNumber );
        if ( avatar ) formData.append( 'avatar', avatar );

        dispatch( updateUserInformation( formData ) );
    };

    const { mutate: logout } = useMutation( apiClient.logout, {
        onError: ( error ) => {
            console.log( "error" );
            toast.error( error.message, {
                position: "top-center",
                autoClose: 1400,
            } );
        },
        onSuccess: async () => {
            console.log( "Logout success" );
            // toast.success( "Logout success", {
            //     position: "top-center",
            //     autoClose: 1400,
            // } );
            // setTimeout( () => {
            //     window.location.reload();
            // }, 2000 );
        },
    } );

    const { mutate: deleteCurrentUserAccount } = useMutation( apiClient.deleteCurrentUserAccount, {
        onSuccess: () => {
            console.log( "Account deleted successfully" );
            toast.success( "Account deleted successfully", {
                position: "top-center",
                autoClose: 1400,
            } );
            setTimeout( () => {
                window.location.reload();
            }, 2000 );
            dispatch( clearCart() );
            dispatch( clearWishlist() );
            logout();
        },
    } );

    const showDeleteConfirm = () => {
        setIsModalVisible( true );
    };

    const handleOk = async () => {
        await deleteCurrentUserAccount();
        setIsModalVisible( false );
    };

    const handleCancel = () => {
        setIsModalVisible( false );
    };

    if ( !user )
    {
        return <Loader />;
    }

    return (
        <div className="w-full border border-gray-100 bg-white h-full">
            <div className="flex justify-center w-full">
                <div className="pt-8 relative">
                    <Avatar
                        src={ avatarPreview }
                        sx={ { width: 150, height: 150 } }
                        alt=""
                    />
                    <div className="w-[30px] h-[30px] bg-[#E3E9EE] rounded-full flex items-center justify-center cursor-pointer absolute bottom-[5px] mt-10 right-[5px]">
                        <input
                            type="file"
                            id="image"
                            className="hidden"
                            onChange={ handleImageChange }
                        />
                        <label htmlFor="image">
                            <AiOutlineCamera />
                        </label>
                    </div>
                </div>
            </div>
            <br />
            <br />
            <div className="w-full px-5">
                <form onSubmit={ handleSubmit } aria-required={ true }>
                    <div className="w-full 800px:flex block pb-3 space-y-10">
                        <div className="w-[100%] 800px:w-[50%]">
                            <TextField
                                label="Full Name"
                                variant="outlined"
                                fullWidth
                                required
                                value={ name }
                                onChange={ ( e ) => setName( e.target.value ) }
                            />
                        </div>
                        <div className="w-[100%] 800px:w-[50%]">
                            <TextField
                                label="Email Address"
                                variant="outlined"
                                fullWidth
                                required
                                value={ email }
                                onChange={ ( e ) => setEmail( e.target.value ) }
                            />
                        </div>
                        <div className="w-[100%] 800px:w-[50%]">
                            <TextField
                                label="Phone Number"
                                variant="outlined"
                                fullWidth
                                required
                                value={ phoneNumber }
                                onChange={ ( e ) => setPhoneNumber( e.target.value ) }
                            />
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            type="submit"
                            sx={ { mt: 3 } }
                        >
                            Update
                        </Button>
                        <Button
                            variant="contained"
                            size="large"
                            color='error'
                            sx={ { mt: 3 } }
                            onClick={ showDeleteConfirm }
                        >
                            Delete Account
                        </Button>
                    </div>
                </form>
            </div>
            <Modal
                title="Confirm Delete Account"
                visible={ isModalVisible }
                onOk={ handleOk }
                onCancel={ handleCancel }
                position="top-center"
                okText="Delete"
                okButtonProps={ { danger: true } }
            >
                <p>Are you sure you want to delete your account? This action cannot be undone.</p>
            </Modal>
        </div>
    );
}

export default CustomerProfile;
