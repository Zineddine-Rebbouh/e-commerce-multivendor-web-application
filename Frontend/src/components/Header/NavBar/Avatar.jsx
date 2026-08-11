import React from 'react';
import { FaUserCircle } from 'react-icons/fa';

const Avatar = ( { src, heightImage, widthImage } ) => {
    const data = src;

    const heightAvatar = heightImage || 50;
    const widthAvatar = widthImage || 50;

    if ( src )
    {
        return <img
            src={ src }
            alt="Avatar"
            className=' rounded-full border-[1px] border-gray-200 object-contain'
            height={ heightAvatar ? heightAvatar : 10 }
            width={ widthAvatar ? widthAvatar : 10 }
        />;
    }
    return <FaUserCircle size={ 32 } color='white' />;
};

export default Avatar;
