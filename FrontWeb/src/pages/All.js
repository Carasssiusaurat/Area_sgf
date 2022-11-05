import React, { useEffect, useState } from "react";
import Navigation from "../components/Navigation";
import AllServices from "../components/AllServices";
import Card from "../components/Card";

const All = () => {
  return (
    <div>
      <Navigation></Navigation>
      <AllServices></AllServices>
    </div>
  );
};

export default All;
