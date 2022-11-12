import React from "react";
import Navigation from "../components/Navigation";
import List_Workspace from "../components/Workspace";
import { Navigate } from "react-router-dom";

const Workspace = () => {
  return (
    <div>
      {sessionStorage.getItem("token") === null ? (
        <Navigate to="/" />
      ) : (
        <Navigation />
      )}
      <List_Workspace></List_Workspace>
    </div>
  );
};

export default Workspace;
