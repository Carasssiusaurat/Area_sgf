import React, { useEffect, useState } from "react";
import Navigation from "../components/Navigation";
import GetServicesId from "../components/GetServicesId";

const Home = () => {
  return (
    <div>
      <Navigation></Navigation>
      <GetServicesId></GetServicesId>
    </div>
  );
};

export default Home;
