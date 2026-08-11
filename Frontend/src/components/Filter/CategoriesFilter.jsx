import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const CategoriesFilter = ( { selectedCategory, onChange, categories } ) => {
    return (
        <div className="border-b border-slate-300 pb-5">
            <FormControl variant="outlined" className="w-full">
                <InputLabel id="category-select-label">Category Type</InputLabel>
                <Select
                    labelId="category-select-label"
                    id="category-select"
                    value={ selectedCategory }
                    onChange={ ( e ) => onChange( e.target.value ) }
                    label="Category Type"
                >
                    { categories?.map( ( category, index ) => (
                        <MenuItem key={ index } value={ category.name }>
                            { category.name }
                        </MenuItem>
                    ) ) }
                </Select>
            </FormControl>
        </div>
    );
};

export default CategoriesFilter;
