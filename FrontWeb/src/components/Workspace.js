// import React from "react";
import BigCard from "./BigCard";
import { Dropdown } from "semantic-ui-react";
import React, { useEffect, useState } from "react";

const Workspace = ({ items, id, page, area }) => {
  const [action, setAction] = useState(0);
  const [args_value, setArguments] = useState([]);

  const Set_Action = () => {};

  const updateFieldChanged = (index) => (e) => {
    console.log("index: " + index);
    console.log("property name: " + e.target.name);
    let newArr = [...args_value];
    newArr[index] = e.target.value;
    setArguments(newArr);
  };

  return (
    <li className="big-card">
      <div className="actions">
        <h1>Actions</h1>
      </div>
      <div className="vl"></div>
      <div className="reactions">
        <h1>Reactions</h1>
      </div>
      {/* {console.log(items)} */}
      {console.log(items[0].name)}
      {console.log(area)}
      {page != "2" ? (
        items.map((item, index) => (
          <BigCard
            name={item.name}
            img_url={item.img_url}
            id={item._id}
            index={index}
          />
        ))
      ) : (
        <li className="single-big-card">
          <h1 className="selected-service">{items[0].name}</h1>
          <img className="logo-img" src={items[0].img_url}></img>
          <p className="description">
            Le Lorem Ipsum est le faux texte standard de l'imprimerie depuis les
            années 1500, quand un imprimeur anonyme assembla ensemble des
            morceaux de texte pour réaliser un livre spécimen de polices de
            texte. Il n'a pas fait que survivre cinq siècles, mais s'est aussi
            adapté à la bureautique informatique, sans que son contenu n'en soit
            modifié.
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
            {console.log(action)}
            {console.log(area)}
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
              <a class="select" onClick={Set_Action}>
                Set Action
              </a>
            </div>
            {console.log(args_value)}
          </div>
        </li>
      )}
    </li>
  );
};

export default Workspace;
