import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Input, Button, Form, Upload, Avatar, Spin } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { updateShopDetails } from '../../../redux/actions/shop';

const ShopProfile = () => {
    const { shop, isLoading } = useSelector( ( state ) => state.shop );
    const dispatch = useDispatch();
    const [ storeForm, setStoreForm ] = useState( {} );
    const [ avatarFile, setAvatarFile ] = useState( null );
    const [ form ] = Form.useForm();

    useEffect( () => {
        if ( shop )
        {
            setStoreForm( {
                ...shop,
            } );
            form.setFieldsValue( shop ); // Set form fields value when shop data is available
        }
    }, [ shop, form ] );

    const handleStoreChange = ( e ) => {
        setStoreForm( { ...storeForm, [ e.target.name ]: e.target.value } );
    };

    const handleImageChange = ( info ) => {
        if ( info.file.status === 'done' || info.file.status === 'uploading' )
        {
            setAvatarFile( info.file.originFileObj );
            const reader = new FileReader();
            reader.onload = () => {
                setStoreForm( { ...storeForm, avatar: reader.result } );
                form.setFieldsValue( { avatar: reader.result } );
            };
            reader.readAsDataURL( info.file.originFileObj );
        }
    };

    const handleStoreSubmit = ( values ) => {
        const formData = new FormData();
        for ( const key in values )
        {
            if ( values.hasOwnProperty( key ) )
            {
                formData.append( key, values[ key ] );
            }
        }
        if ( avatarFile )
        {
            formData.append( 'avatar', avatarFile );
        }
        dispatch( updateShopDetails( shop._id, formData ) ); // Assuming shop._id is the shop identifier
    };

    return (
        <div className="p-4 h-full" style={ { boxShadow: "2px 4px 16px #0000001c" } }>
            <h3 className="text-2xl mb-2 mt-8 font-medium">Store Information</h3>
            { isLoading ? (
                <Spin />
            ) : (
                <div>
                    <div className="flex items-center mb-4">
                        <Avatar src={ storeForm.avatar } size={ 64 } className="mr-4" />
                        <div>
                            <h2 className="text-xl">{ storeForm.name }</h2>
                        </div>
                    </div>

                    <Form
                        layout="vertical"
                        form={ form }
                        onFinish={ handleStoreSubmit }
                        initialValues={ storeForm }
                        className="grid grid-cols-2 gap-4"
                    >
                        <Form.Item label="Upload Store Image" className="col-span-2">
                            <Upload
                                name="avatar"
                                listType="picture"
                                showUploadList={ false }
                                onChange={ handleImageChange }
                                accept="image/*"
                            >
                                <Button icon={ <UploadOutlined /> }>Upload Store Image</Button>
                            </Upload>
                        </Form.Item>
                        <Form.Item
                            name="name"
                            label="Store Name"
                            rules={ [ { required: true, message: 'Please input the store name!' } ] }
                            className="col-span-2"
                        >
                            <Input name="name" value={ storeForm.name } onChange={ handleStoreChange } />
                        </Form.Item>
                        <Form.Item
                            name="description"
                            label="Description"
                            rules={ [ { required: true, message: 'Please input the store description!' } ] }
                            className="col-span-2"
                        >
                            <Input name="description" value={ storeForm.description } onChange={ handleStoreChange } />
                        </Form.Item>
                        <Form.Item
                            name="email"
                            label="Store Email"
                            rules={ [ { required: true, message: 'Please input the store email!' } ] }
                            className="col-span-2"
                        >
                            <Input name="email" value={ storeForm.email } onChange={ handleStoreChange } />
                        </Form.Item>
                        <Form.Item
                            name="address"
                            label="Store Address"
                            rules={ [ { required: true, message: 'Please input the store address!' } ] }
                            className="col-span-2"
                        >
                            <Input name="address" value={ storeForm.address } onChange={ handleStoreChange } />
                        </Form.Item>
                        <Form.Item
                            name="phoneNumber"
                            label="Phone Number"
                            rules={ [ { required: true, message: 'Please input the phone number!' } ] }
                            className="col-span-2"
                        >
                            <Input name="phoneNumber" value={ storeForm.phoneNumber } onChange={ handleStoreChange } />
                        </Form.Item>
                        <Form.Item className="col-span-2">
                            <Button type="primary" htmlType="submit" block>
                                Update Store Information
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            ) }
        </div>
    );
};

export default ShopProfile;
