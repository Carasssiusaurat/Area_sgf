import React from "react";
import Auth from "../components/Auth";
import Logo from "../components/Logo";
import GoogleLoginComponent from "../components/Google";
import { NavLink } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

const Register = () => {
  return (
    <div>
      <Logo />
      <div className="center"><Auth Text="Sign Up" /></div>
      <div className="google">
        <GoogleOAuthProvider clientId="392568468203-3lrfh8iiiast4keo921gj5n0qajp7vmd.apps.googleusercontent.com">
          <GoogleLoginComponent />
        </GoogleOAuthProvider>
      </div>
      <div className="container">
        <div className="not-a-member">
          <ul>Already a member ?</ul>
        </div>
        <div className="navigation">
          <ul>
            <NavLink
              to="/"
              className={(nav) => (nav.isActive ? "nav-active" : "")}
            >
              <li>Login</li>
            </NavLink>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Register;
