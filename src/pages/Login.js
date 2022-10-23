import React from "react";
import Auth from "../components/Auth";
import Logo from "../components/Logo";
import GoogleLoginComponent from "../components/Google";
import { NavLink } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

const Login = () => {
  return (
    <div>
      <Logo />
      <div className="center" ><Auth Text="Logina"/> </div>
      <div className="google">
        <GoogleOAuthProvider clientId="392568468203-3lrfh8iiiast4keo921gj5n0qajp7vmd.apps.googleusercontent.com">
          <GoogleLoginComponent />
        </GoogleOAuthProvider>
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
    </div>
  );
};

export default Login;
