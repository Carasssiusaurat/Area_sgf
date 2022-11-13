import React, { Component, useState, useEffect } from "react";
import { GoogleLogin } from "@react-oauth/google";
// import { GoogleLogin, GoogleLogout } from "react-google-login";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";

function GoogleLoginComponent() {
  const navigate = useNavigate();
  const [user, setUser] = useState({});

  return (
    <div className="GoogleLogin">
      <header className="Login-header">
        <GoogleLogin
          onSuccess={(credentialResponse) => {
            console.log(credentialResponse.credential);
            var decoded = jwt_decode(credentialResponse.credential);
            setUser(decoded);
            console.log(decoded);
            navigate("/home");
          }}
          onError={() => {
            console.log("Login Failed");
          }}
        />
      </header>
    </div>
  );
}
export default GoogleLoginComponent;
