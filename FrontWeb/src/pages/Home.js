import React from "react";
import Navigation from "../components/Navigation";
import GetServicesId from "../components/GetServicesId";
import { Navigate } from "react-router-dom";

const Home = () => {
  return (
    <div>
      {sessionStorage.getItem("token") === null ? (
        <Navigate to="/" />
      ) : (
        <Navigation />
      )}
      <GetServicesId></GetServicesId>
    </div>
  );
};

export default Home;
