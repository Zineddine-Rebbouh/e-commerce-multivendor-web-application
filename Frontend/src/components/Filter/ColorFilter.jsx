import React, { useState } from 'react';

const ColorFilter = ( { selectedColor, onChange } ) => {
    const handleColor = ( event ) => {
        const color = event.target.value;
        onChange( color );
    };

    const colors = [ 'Red', 'Blue', 'Green', 'Yellow', 'Black', 'White' ];

    return (
        <div className="border-b border-slate-300 pb-5">
            <h4 className="text-md font-semibold mb-2">Color</h4>
            { colors.map( color => (
                <label key={ color } className="flex items-center space-x-2">
                    <input
                        type="radio"
                        className="rounded"
                        name='color'
                        value={ color }
                        onChange={ handleColor }
                    />
                    <span>{ color }</span>
                </label>
            ) ) }
        </div>
    );
}

export default ColorFilter;
