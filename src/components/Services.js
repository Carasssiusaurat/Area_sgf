import React from "react";
import Card from "./Card";

const Services = () => {
  const services = ["facebook", "instagram", "discord"];

  return (
    <>
      {services.map((service) => (
        <Card service={service} />
      ))}
    </>
  );
};

export default Services;
