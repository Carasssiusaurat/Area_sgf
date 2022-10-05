import React from "react";
import Auth from "../components/Auth";
import Logo from "../components/Logo";
import GoogleLoginComponent from "../components/Google";
import { NavLink } from "react-router-dom";
// import Navigation from "../components/Navigation";

const Login = () => {
  return (
    <div>
      <Logo />
      <Auth Text="Login" />
      <div className="google">
        <GoogleLoginComponent />
      </div>
      <div className="container">
        <div className="not-a-member">
          <ul>Not a member yet ?</ul>
        </div>
        <div className="navigation">
          <ul>
            <NavLink
              to="/register"
              className={(nav) => (nav.isActive ? "nav-active" : "")}
            >
              <li>Register</li>
            </NavLink>
          </ul>
        </div>
      </div>
      {/* <Navigation /> */}
      {/* <Countries /> */}
    </div>
  );
};

export default Login;
