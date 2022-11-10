import React, { useEffect, useState } from "react";
import Workspace from "./Workspace";
import { useNavigate } from "react-router-dom";

const BigCard = ({ name, img_url, id, index }) => {
  const [select, setSelect] = useState(0);
  const navigate = useNavigate();
  const ChangeValue = () => {
    sessionStorage.setItem("id_select", id);
    console.log(sessionStorage.getItem("id_select"));
    window.location.reload(false);
  };
  return (
    <div>
      {select === 0 ? (
        <div className="divv">
          {index === 3 || index === 6 ? (
            <div className="card-3">
              <div className="service-logo">
                <div className="back"></div>
                <img src={img_url} alt={name} text={name} />
              </div>
              <div className="service-name">
                <h1>{name}</h1>
              </div>
              <div className="infos">
                <a class="select" onClick={ChangeValue}>
                  Select
                </a>
              </div>{" "}
            </div>
          ) : (
            <div className="card-2">
              <div className="service-logo">
                <div className="back"></div>
                <img src={img_url} alt={name} text={name} />
              </div>
              <div className="service-name">
                <h1>{name}</h1>
              </div>
              <div className="infos">
                <a class="select" onClick={ChangeValue}>
                  Select
                </a>
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default BigCard;
