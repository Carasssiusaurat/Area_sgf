import React from "react";
import BigCard from "./BigCard";

const Workspace = ({ items, id }) => {
  return (
    <li className="big-card">
      <div className="actions">
        <h1>Actions</h1>
      </div>
      {items.map((item, index) => (
        <BigCard name={item.name} img_url={item.img_url} id={id[index]._id} />
      ))}
    </li>
  );
};

export default Workspace;
