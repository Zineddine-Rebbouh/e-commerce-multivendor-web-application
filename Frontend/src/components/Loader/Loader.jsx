import React from "react";
import CircularProgress from "@mui/material/CircularProgress";

export const Loader = () => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <CircularProgress disableShrink />;
    </div>
  );
};
