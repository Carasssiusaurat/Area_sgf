import React from "react";
import Navigation from "../components/Navigation";
import AllServices from "../components/AllServices";
import { Navigate } from "react-router-dom";

const All = () => {
  return (
    <div>
      {sessionStorage.removeItem("id_select")}
      {sessionStorage.getItem("token") === null ? (
        <Navigate to="/" />
      ) : (
        <Navigation />
      )}
      <AllServices></AllServices>
    </div>
  );
};

export default All;
