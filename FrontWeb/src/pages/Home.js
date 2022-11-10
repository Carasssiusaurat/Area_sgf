import React from "react";
import Navigation from "../components/Navigation";
import GetServicesId from "../components/GetServicesId";
import { Navigate } from "react-router-dom";

const Home = () => {
  return (
    <div>
      {sessionStorage.removeItem("id_select")}
      {sessionStorage.getItem("token") === null ? (
        <Navigate to="/" />
      ) : (
        <Navigation />
      )}
      {console.log("Je suis la Home")}
      <GetServicesId page="0"></GetServicesId>
    </div>
  );
};

export default Home;