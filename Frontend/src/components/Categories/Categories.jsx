import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../utils/styles";

const Categories = ( { categoriesData, setDropDown } ) => {
    const navigate = useNavigate();
    const submitHandle = ( i ) => {
        // navigate( `/products?category=${ i.title }` );
        // setDropDown( false );
        // window.location.reload();
    };
    return (
        <div className="pb-4 w-[280px] bg-[#fff] absolute z-30 rounded-b-md shadow-sm border-l border-r border-b border-gray-300" >
            { categoriesData &&
                categoriesData.map( ( i, index ) => (
                    <div
                        key={ index }
                        className={ `${ styles.noramlFlex }` }
                        onClick={ () => submitHandle( i ) }
                    >
                        <img
                            src={ i.image_Url }
                            style={ {
                                width: "25px",
                                height: "25px",
                                objectFit: "contain",
                                marginLeft: "10px",
                                userSelect: "none",
                            } }
                            alt=""
                        />
                        <h3 className="m-3 cursor-pointer select-none">{ i.title }</h3>
                    </div>
                ) ) }
        </div>
    );
};

export default Categories;
