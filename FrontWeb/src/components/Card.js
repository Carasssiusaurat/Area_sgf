import React, { useEffect, useState } from "react";

const Card = ({ name, img_url }) => {
  const EnableService = async () => {
    const res = await fetch(
      "http://localhost:8080/user/" + sessionStorage.getItem("id") + "/service",
      {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("token"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
        }),
      }
    );
    console.log(sessionStorage.getItem("token"));
  };
  return (
    <li className="card">
      <div className="service-logo">
        <div className="back"></div>
        <img src={img_url} alt={name} text={name} />
      </div>
      <div className="service-name">
        <h1>{name}</h1>
      </div>
      <div className="infos">
        <h2>Connected since:</h2>
        <button onClick={EnableService}>Connect</button>
        <div className="separator"></div>
      </div>
    </li>
  );
};

export default Card;
