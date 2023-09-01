import React, { Fragment } from "react";
import axios from "axios";
import {Routes, Route} from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";

import Login from "./components/Login";
import Alert from './components/Alert';

import Home from './containers/Home';
import { setAuthToken } from "./utils/authToken";


function App() {

  axios.defaults.baseURL= process.env.REACT_APP_BACKEND_URL;
  let access_token = localStorage.getItem('access_token')
  access_token ?  setAuthToken(access_token) : localStorage.clear()

  return (
    <Fragment>  
      <Alert></Alert>
      <Routes>
        <Route path="/*" element={<PrivateRoute Component={Home}/>}></Route>
        <Route path="/login" element={<Login/>}></Route>
      </Routes>
    </Fragment>
  );
}

export default App;
