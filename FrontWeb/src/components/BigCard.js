import React from "react";

const BigCard = ({ name, img_url, id }) => {
  return (
    <div>
      <div className="vl"></div>
      <li className="card-2">
        <div className="service-logo">
          <div className="back"></div>
          <img src={img_url} alt={name} text={name} />
        </div>
        <div className="service-name">
          <h1>{name}</h1>
        </div>
        <div className="infos">
          <a class="select">Select</a>
        </div>
      </li>
    </div>
  );
};

export default BigCard;
