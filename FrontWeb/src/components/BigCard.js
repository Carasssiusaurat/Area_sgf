import React, { useEffect, useState } from "react";
import Workspace from "./Workspace";
import { useNavigate } from "react-router-dom";

const BigCard = ({ name, img_url, id, index, reaction, area }) => {
  const [select, setSelect] = useState(0);
  const navigate = useNavigate();
  const [action, setAction] = useState(0);
  const [action_is_set, setIsSet] = useState(0);
  const [args_value, setArguments] = useState([]);
  var button_state = "select";

  const updateFieldChanged = (index) => (e) => {
    console.log("index: " + index);
    console.log("property name: " + e.target.name);
    let newArr = [...args_value];
    newArr[index] = e.target.value;
    setArguments(newArr);
  };

  const ChangeValue = () => {
    if (reaction != 1 && reaction != 2 && reaction != 900) {
      sessionStorage.setItem("id_select", id);
      window.location.reload(false);
    } else {
      console.log("OUIN OUIN");
      sessionStorage.setItem("id_select_reaction", id);
      setSelect(select + 1);
    }
  };

  const setMargin = () => {
    if (reaction === 1) reaction = 900;
    if (reaction === 2) button_state = "remove";
  };

  useEffect(
    () => {
      console.log(sessionStorage.getItem("id_select_reaction"));
      console.log(select);
    },
    [select],
    sessionStorage.getItem("id_select_reaction")
  );
  return (
    <div>
      {reaction === 1 || reaction === 2 ? setMargin() : null}
      <div className="divv" style={{ marginLeft: reaction + "px" }}>
        {sessionStorage.getItem("id_select_reaction") === null ? (
          index === 3 || index === 6 ? (
            <div className="card-3">
              {console.log("Mince alors")}
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
                <a class={button_state} onClick={() => ChangeValue()}>
                  {button_state}
                </a>
              </div>
            </div>
          )
        ) : (
          <li className="single-big-card">
            <h1 className="selected-service">{name}</h1>
            <img className="logo-img" src={img_url}></img>
            <p className="description">
              Le Lorem Ipsum est le faux texte standard de l'imprimerie depuis
              les années 1500, quand un imprimeur anonyme assembla ensemble des
              morceaux de texte pour réaliser un livre spécimen de polices de
              texte. Il n'a pas fait que survivre cinq siècles, mais s'est aussi
              adapté à la bureautique informatique, sans que son contenu n'en
              soit modifié.
            </p>
            <div className="form-group">
              <label>Action :</label>
              <select
                name="idaction"
                id="idaction"
                className="form-control"
                value={action}
                onChange={(e) => setAction(e.target.value)}
              >
                <option disabled selected>
                  -- Select Action --
                </option>
                {area.map((item, index) => (
                  <option value={index}>{item.name}</option>
                ))}
              </select>
              <div className="list_args">
                {area.length != 0
                  ? area[action].args.map((arg, index) => (
                      <input
                        placeholder={arg}
                        onChange={updateFieldChanged(index)}
                      ></input>
                    ))
                  : null}
              </div>
              <div className="infos">
                <a class="select" onClick={() => setIsSet(action_is_set + 1)}>
                  Set Action
                </a>
              </div>
              {console.log("Ligne 95" + action_is_set)}
            </div>
          </li>
        )}
      </div>
    </div>
  );
};

export default BigCard;
