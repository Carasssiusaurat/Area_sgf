import React from "react";
import Navigation from "../components/Navigation";
import List_Workspace from "../components/Workspace";
import { Navigate } from "react-router-dom";
import GetServicesId from "../components/GetServicesId";

const Workspace = () => {
  return (
    <div>
      {/* {console.log("Je suis la Workspace")} */}
      {sessionStorage.getItem("token") === null ? (
        <Navigate to="/" />
      ) : (
        <Navigation />
      )}
      {sessionStorage.getItem("id_select") === null ? (
        <GetServicesId page="1"></GetServicesId>
      ) : null}
      {sessionStorage.getItem("id_select_reaction") === null &&
      sessionStorage.getItem("id_select") != null ? (
        <GetServicesId page="2"></GetServicesId>
      ) : null}
      {sessionStorage.getItem("id_select_reaction") != null &&
      sessionStorage.getItem("id_select") != null ? (
        <GetServicesId page="3"></GetServicesId>
      ) : null}
      {/* <List_Workspace></List_Workspace> */}
    </div>
  );
};

export default Workspace;
