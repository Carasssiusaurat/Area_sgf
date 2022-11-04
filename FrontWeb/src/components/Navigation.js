import React from "react";
import { NavLink } from "react-router-dom";

const Navigation = () => {
  return (
    <div className="services-navig">
      <ul>
        <NavLink
          to="/home"
          className={(nav) => (nav.isActive ? "nav-active" : "")}
        >
          <li>Services enabled</li>
        </NavLink>
        <NavLink
          to="/all"
          className={(nav) => (nav.isActive ? "nav-active" : "")}
        >
          <li>All services</li>
        </NavLink>
        <NavLink
          to="/Workspace"
          className={(nav) => (nav.isActive ? "nav-active" : "")}
        >
          <li>Workspace
              Aria                          
          </li>
        </NavLink>
      </ul>
    </div>
  );
};

export default Navigation;
