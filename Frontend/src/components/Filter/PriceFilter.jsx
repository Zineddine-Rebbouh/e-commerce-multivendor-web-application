import { TextField } from "@mui/material";

const PriceFilter = ( { selectedPrice, onChange } ) => {
    const handlePriceChange = ( event ) => {
        const price = event.target.value.replace( /\D/g, '' ); // Remove non-numeric characters
        if ( price !== '' && parseInt( price ) < 0 ) return; // Ignore negative values
        onChange( price === '' ? undefined : parseInt( price ) );
    };

    return (
        <div>
            <TextField
                className="w-full"
                id="outlined-basic"
                label="Enter Max Price"
                variant="outlined"
                type="number"
                value={ selectedPrice === undefined ? '' : selectedPrice }
                onChange={ handlePriceChange }
                InputProps={ {
                    inputProps: { min: 0 },
                } }
            />
        </div>
    );
};

export default PriceFilter;
