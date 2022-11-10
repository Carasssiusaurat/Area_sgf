import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import All from "./pages/All";
import Workspace from "./pages/Workspace";
import Action_selected from "./pages/Action_selected";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/all" element={<All />} />
        <Route path="/Workspace" element={<Workspace />} />
        <Route path="/Workspace/Action_Selected" element={<Workspace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
