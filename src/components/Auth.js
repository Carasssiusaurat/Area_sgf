import React, { useEffect, useState } from "react";

const Auth = ({ Text }) => {
  const [mail, setMail] = useState([]);
  const [password, setPassword] = useState([]);

  return (
    <div className="auth">
      <div className="center">
        <input type="text" placeholder="Email" className="email" />
      </div>
      <div className="second-input"></div>
      <div className="center">
        <input type="password" placeholder="Password" className="password" />
      </div>
      <div className="login"></div>
      <a href="home" class="button">
        {Text}
      </a>
      <h2 class="hr-lines"> OR </h2>
    </div>
  );
};

export default Auth;
