import React, {useEffect, useState} from "react";
import { useParams, useNavigate} from "react-router-dom";

import { GoogleLogout } from '@leecheuk/react-google-login';
import { AiOutlineLogout } from "react-icons/ai";


import Spinner from "../components/Spinner";
import MasonryLayout from "../components/MasonryLayout";

import { getUserHomeTimeLine } from "../services/userServices";
import { getUserPins } from "../services/pinServices";

const activeBtnStyles = 'bg-red-500 text-white font-bold p-2 rounded-full w-20 outline-none';
const notActiveBtnStyles = 'bg-primary mr-4 text-black font-bold p-2 rounded-full w-20 outline-none';


const HomeTimeLine = () =>{

    const navigate = useNavigate()
    const [user, setUser] = useState();
    const [pins, setPins] = useState([]);
    const [text, setText] = useState('Created');
    const [activeBtn, setActiveBtn] = useState('created');
    const params = useParams();
    

    useEffect(() => {
        debugger;
        async function fetchUserHomeTimeLine(){

            const userHome = await getUserHomeTimeLine(params.id)
            if(userHome.error){
                
                alert(userHome.error)

            }
            else{
                console.log("home timeline", userHome.data)
                setUser(userHome.data)
            }
        }
        
        fetchUserHomeTimeLine()
    
    }, [params.id])

    useEffect(() => {
        async function fetchPins(){

            const re = await getUserPins(params.id)
            if(re.error){

                alert(re.error)

            }
            else
            { 
                console.log("pins", re.data.results)
                setPins(re.data.results)

            }
        }

        fetchPins()
    
    }, [params.id])
    
    const logout = ()=>{

        localStorage.clear();
        navigate('/login');

    }

    if (!user) return <Spinner message="Loading profile" />;

  return (
    <div className="relative items-center justify-center h-full pb-2">
      <div className="flex flex-col pb-5">
        <div className="relative flex flex-col mb-7">
          <div className="flex flex-col items-center justify-center">
            <img
              className="object-cover w-full shadow-lg h-370 2xl:h-110"
              src="https://source.unsplash.com/1600x900/?nature,photography,technology"
              alt="user-pic"
            />
            <img
              className="object-cover w-20 h-20 -mt-10 rounded-full shadow-xl"
              src={user.picture}
              alt="user-pic"
            />
          </div>
          <h1 className="mt-3 text-3xl font-bold text-center">
            {user.first_name +" "+ user.last_name}
          </h1>
          <div className="absolute top-0 right-0 p-2 z-1">
              <GoogleLogout
                clientId={`${process.env.REACT_APP_GOOGLE_CLIENT_ID}`}
                render={(renderProps) => (
                  <button
                    type="button"
                    className="p-2 bg-white rounded-full shadow-md outline-none cursor-pointer "
                    onClick={renderProps.onClick}
                    disabled={renderProps.disabled}
                  >
                    <AiOutlineLogout color="red" fontSize={21} />
                  </button>
                )}
                onLogoutSuccess={logout}
                cookiePolicy="single_host_origin"
              />
          </div>
        </div>
        <div className="text-center mb-7">
          <button
            type="button"
            onClick={(e) => {
              setText(e.target.textContent);
              setActiveBtn('created');
            }}
            className={`${activeBtn === 'created' ? activeBtnStyles : notActiveBtnStyles}`}
          >
            Created
          </button>
          <button
            type="button"
            onClick={(e) => {
              setText(e.target.textContent);
              setActiveBtn('saved');
            }}
            className={`${activeBtn === 'saved' ? activeBtnStyles : notActiveBtnStyles}`}
          >
            Saved
          </button>
        </div>
        {pins?.length > 0 ?
            <div className="px-2">
                <MasonryLayout pins={pins} />
            </div>
        :
            <div className="flex items-center justify-center w-full mt-2 font-bold text-1xl">
            No Pins Found!
            </div>
        }
      </div>

    </div>
    );
    

}

export default HomeTimeLine;