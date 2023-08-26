import React, {useEffect} from "react";

import { useNavigate } from 'react-router-dom';

import { gapi } from "gapi-script";
import { GoogleLogin } from '@leecheuk/react-google-login';
import { FcGoogle } from "react-icons/fc";

import shareVideo from '../assets/share.mp4';
import logo from "../assets/lens_logo.png";

import { getAccessToken, getUserProfile } from "../services/userServices";
import { setAuthToken } from "../utils/authToken";



const Login = ()=>{

    const navigate = useNavigate()

    console.log("clientid", process.env.REACT_APP_GOOGLE_CLIENT_ID)

    useEffect(() => {
      function start() {
        gapi.client.init({
          clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID
        });
      }
      gapi.load('client:auth2', start);
    });

    const responseGoogle = async(response) => {
        debugger;
        console.log(response);
        if(response.error){
          alert("error", response.error);
          return;
        }
        localStorage.setItem('token', response.tokenObj.access_token)
        const res = await getAccessToken(response.tokenObj.access_token);
        localStorage.setItem('profile', JSON.stringify(response.profileObj))
        localStorage.setItem('access_token', res.data.access_token)
        setAuthToken(res.data.access_token)
        await getUserProfile()
        navigate("/");
    }

    return (
        <div className="flex justify-start items-center flex-col h-screen">
          <div className=" relative w-full h-full">
            <video
              src={shareVideo}
              type="video/mp4"
              loop
              controls={false}
              muted
              autoPlay
              className="w-full h-full object-cover"
            />
    
            <div className="absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0    bg-blackOverlay">
              <div className="p-5">
                <img src={logo} width="130px" alt="lenssnap"/>
              </div>
    
              <div className="shadow-2xl">
                <GoogleLogin
                  clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                  render={(renderProps) => (
                    <button
                      type="button"
                      className="bg-mainColor flex justify-center items-center p-3 rounded-lg cursor-pointer outline-none"
                      onClick={renderProps.onClick}
                      disabled={renderProps.disabled}
                    >
                      <FcGoogle className="mr-4" /> Sign in with google
                    </button>
                  )}
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
                cookiePolicy="single_host_origin"
                />
              </div>
            </div>
          </div>
        </div>
    );
}

export default Login;