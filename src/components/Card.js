import React from "react";

const Card = ({ service }) => {
  return (
    <li className="card">
      <div className="service-logo">
        <div className="back"></div>
        <img src={"./" + service + ".png"} alt={service} text={service} />
      </div>
      <div className="service-name">
        <h1>{service}</h1>
      </div>
      <div className="infos">
        <h2>Connected since:</h2>
        <button>Configure</button>
        <div className="separator"></div>
      </div>
    </li>
  );
};

export default Card;
