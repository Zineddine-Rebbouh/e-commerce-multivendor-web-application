import { Rating } from "@mui/material";

const StarRatingFilter = ( { selectedStars, onChange } ) => {
    const handleRatingChange = ( event ) => {
        onChange( event );
    };

    return (
        <div className="border-b border-slate-300 pb-5">
            <h4 className="text-md font-semibold mb-2">Property Rating</h4>
            <Rating
                name="rating"
                value={ selectedStars }
                onChange={ handleRatingChange }
                precision={ 1 }
            />
        </div>
    );
};

export default StarRatingFilter;
