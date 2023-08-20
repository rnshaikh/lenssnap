import React from "react";
import {Routes, Route} from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";

import Login from "./components/Login";

import Home from './containers/Home';


function App() {
  return (
    <Routes>
      <Route path="/" element={<PrivateRoute Component={Home}/>}></Route>
      <Route path="/login" element={<Login/>}></Route>
    </Routes>
  );
}

export default App;
