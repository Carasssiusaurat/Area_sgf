import React from "react";
import Navigation from "../components/Navigation";
import List_Workspace from "../components/Workspace";
import { Navigate } from "react-router-dom";
import GetServicesId from "../components/GetServicesId";

const Workspace = () => {
  return (
    <div>
      {sessionStorage.getItem("token") === null ? (
        <Navigate to="/" />
      ) : (
        <Navigation />
      )}
      <GetServicesId page="1"></GetServicesId>
      {/* <List_Workspace></List_Workspace> */}
    </div>
  );
};

export default Workspace;
