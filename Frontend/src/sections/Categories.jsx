import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Modal, Form, Input as AntInput, Upload } from 'antd';
import { EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import * as apiClient from '../api/api-Client';

const Categories = () => {
    const navigate = useNavigate();
    const [ searchTerm, setSearchTerm ] = useState( '' );
    const [ showForm, setShowForm ] = useState( false );
    const [ isEditMode, setIsEditMode ] = useState( false );
    const [ currentCategory, setCurrentCategory ] = useState( null );
    const [ fileList, setFileList ] = useState( [] );
    const { shop } = useSelector( ( state ) => state.shop );
    const [ categories, setCategories ] = useState( [] );
    const [ form ] = Form.useForm();

    const handleAddCategory = () => {
        setShowForm( true );
        setIsEditMode( false );
        setFileList( [] );
        form.resetFields();
    };

    const handleHideForm = () => {
        setShowForm( false );
        setFileList( [] );
        form.resetFields();
    };

    const onFinish = async ( values ) => {
        try
        {
            const formData = new FormData();
            formData.append( "name", values.name );
            formData.append( "description", values.description );
            if ( fileList.length > 0 && fileList[ 0 ].originFileObj )
            {
                formData.append( "image", fileList[ 0 ].originFileObj );
            } else if ( isEditMode )
            {
                formData.append( "image", currentCategory.image );
            }

            await apiClient.addCategory( isEditMode ? currentCategory._id : null, formData );

            // Refresh categories data after adding or editing a category
            const data = await apiClient.getCateogries();
            setCategories( data );
            handleHideForm();
        } catch ( error )
        {
            console.error( "Error saving category:", error );
        }
    };

    const { data: categoriesData } = useQuery( "categories", apiClient.getCateogries() );

    useEffect( () => {
        if ( categoriesData )
        {
            setCategories( categoriesData );
        }
    }, [ categoriesData ] );


    const handleSearch = ( e ) => {
        setSearchTerm( e.target.value );
    };

    const deleteCategory = async ( id ) => {
        try
        {
            await apiClient.deleteCategory( id );
            const data = await apiClient.getCateogries();
            setCategories( data );
        } catch ( error )
        {
            console.error( 'Error deleting category:', error );
        }
    };

    const handleEdit = ( category ) => {
        setShowForm( true );
        setIsEditMode( true );
        setCurrentCategory( category );
        form.setFieldsValue( {
            name: category.name,
            description: category.description,
        } );
        setFileList( [
            {
                uid: '-1',
                name: 'image.png',
                status: 'done',
                url: category.image,
            },
        ] );
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            sorter: ( a, b ) => a.name.localeCompare( b.name ),
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Image',
            dataIndex: 'image',
            key: 'image',
            render: ( text ) => <img src={ text } alt="Category" style={ { width: '3rem', height: '3rem' } } />,
        },
        {
            title: 'Action',
            key: 'action',
            render: ( text, record ) => (
                <span className='space-x-2'>
                    <Button icon={ <EditOutlined /> } onClick={ () => handleEdit( record ) } />
                    <Button icon={ <DeleteOutlined /> } onClick={ () => deleteCategory( record._id ) } />
                </span>
            ),
        },
    ];

    const filteredCategories = categories
        .filter( category => category.name.toLowerCase().includes( searchTerm.toLowerCase() ) )
        .map( category => ( {
            _id: category._id,
            name: category.name,
            description: category.description,
            image: category.image,
        } ) );


    const refreshCategories = async () => {
        try
        {
            const data = await apiClient.getCateogries();
            setCategories( data );
        } catch ( error )
        {
            console.error( 'Error fetching categories:', error );
        }
    };

    return (
        <div className='bg-white p-5 rounded-lg mt-5' style={ { boxShadow: "2px 4px 16px #0000001c" } }>
            <h1 className='font-medium text-2xl mb-4'>Categories Management</h1>
            <div className='flex justify-between ' style={ { marginBottom: '1rem' } }>
                <Input
                    placeholder="Search by category name"
                    value={ searchTerm }
                    onChange={ handleSearch }
                    style={ { width: 500, marginRight: '1rem' } }
                />
                <Button onClick={ handleAddCategory }>Add Category</Button>
            </div>
            <Table columns={ columns } dataSource={ filteredCategories } rowKey={ ( record ) => record._id } />
            <Modal
                title={ isEditMode ? "Edit Category" : "Add Category" }
                visible={ showForm }
                onCancel={ handleHideForm }
                footer={ [
                    <Button key="cancel" onClick={ handleHideForm }>
                        Cancel
                    </Button>,
                    <Button key="submit" type="primary" onClick={ () => form.submit() }>
                        { isEditMode ? "Save" : "Add" }
                    </Button>,
                ] }
            >
                <Form
                    form={ form }
                    layout="vertical"
                    onFinish={ onFinish }
                >
                    <Form.Item
                        name="name"
                        label="Name"
                        rules={ [ { required: true, message: 'Please enter category name' } ] }
                    >
                        <AntInput />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="Description"
                        rules={ [ { required: true, message: 'Please enter category description' } ] }
                    >
                        <AntInput.TextArea rows={ 4 } />
                    </Form.Item>
                    <Form.Item
                        name="image"
                        label="Image"
                        rules={ [ { required: !isEditMode, message: 'Please upload category image' } ] }
                    >
                        <Upload
                            maxCount={ 1 }
                            beforeUpload={ () => false }
                            fileList={ fileList }
                            onChange={ ( { fileList } ) => setFileList( fileList ) }
                        >
                            <Button icon={ <UploadOutlined /> }>Upload</Button>
                        </Upload>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Categories;
