import React from "react";

const AddToCartButton = ( {
  label,
  disable,
  outline,
  small,
  custom,
  icon,
  onClick,
} ) => {
  return (
    <button
      onClick={ onClick }
      className={ `
            disable:opacity-70 
       disable:cursor-not-allowed
       rounded-lg *:hover:opacity-80 
       w-full
       flex items-center justify-center gap-2
       ${ outline ? "bg-white text-black " : "" } 
       ${ small ? "text-sm font-light" : "text-md font-semibold" } 
       ${ small ? "py-1 px-2 border-[1.2px]" : "py-3 px-4 border-2" } 
       ${ custom ? custom : "bg-black text-white" }
      `}
    >
      { label }
    </button>
  );
};

export default AddToCartButton;
