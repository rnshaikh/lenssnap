import React, {useEffect, useState} from "react";
import { useParams, useNavigate} from "react-router-dom";

import { GoogleLogout } from '@leecheuk/react-google-login';
import { AiOutlineLogout } from "react-icons/ai";


import Spinner from "../components/Spinner";
import MasonryLayout from "../components/MasonryLayout";
import UserList from "../components/UserList";

import { getUserHomeTimeLine, getUserFollowers, getUserFollowing, followUser, unFollowUser} from "../services/userServices";
import { getUserPins } from "../services/pinServices";

const activeBtnStyles = 'bg-red-500 text-white font-bold p-2 rounded-full w-60 outline-none';
const notActiveBtnStyles = 'bg-primary mr-4 text-black font-bold p-2 rounded-full w-60 outline-none';


const HomeTimeLine = () =>{

    const navigate = useNavigate()
    const [user, setUser] = useState();
    const [pins, setPins] = useState([]);
    const [text, setText] = useState('Created');
    const [likeChange, setLikeChange] = useState(false);
    const [activeBtn, setActiveBtn] = useState('pins');
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([])
    const [loginUserFollowing, setLoginUserFollowing] = useState(false);

    const params = useParams();

    const userObj = localStorage.user? JSON.parse(localStorage.user) : null; 
    
    useEffect(() => {
        ;
        async function fetchUserHomeTimeLine(){

            const userHome = await getUserHomeTimeLine(params.id)
            if(userHome.error){
                
              window.bus.publish("alert", {"msg":userHome.error, "alertType":"error"});

            }
            else{
                setUser(userHome.data)
            }
        }
        
        fetchUserHomeTimeLine();
        setActiveBtn('pins');
    
    }, [params.id, loginUserFollowing])

    useEffect(() => {
        async function fetchPins(){

            const re = await getUserPins(params.id)
            if(re.error){
              window.bus.publish("alert", {"msg":re.error, "alertType":"error"});
            }
            else
            { 
              setPins(re.data.results)

            }
        }

        fetchPins()
    
    }, [params.id, likeChange])

    useEffect(() => {
      async function fetchUserFollowers(){

        const re = await getUserFollowers(params.id)
            if(re.error){
              window.bus.publish("alert", {"msg":re.error, "alertType":"error"});
            }
            else
            { 
              ;
              let followersUser = re.data.results
              setFollowers(re.data.results)
              let uObj = followersUser.filter(u=> u?.followed_by?.id === userObj.id)
              uObj.length===0?setLoginUserFollowing(false):setLoginUserFollowing(true);

            }
      }
      fetchUserFollowers()
      
    }, [params.id, loginUserFollowing, userObj?.id])


    useEffect(() => {
      async function fetchUserFollowing(){

        const re = await getUserFollowing(params.id)
            if(re.error){
              window.bus.publish("alert", {"msg":re.error, "alertType":"error"});
            }
            else
            { 
              setFollowing(re.data.results)

            }
      }
      fetchUserFollowing()
      
    }, [params.id])


    const userFollow = async(userId)=>{
      ;
      let re = await followUser(userId)
      if(re.error){
          window.bus.publish("alert", {"msg":re.error, "alertType":"error"});
      }
      else
      {     
        setLoginUserFollowing(true);
          
      }
  }

  const userUnFollow = async(userId)=>{

      ;
      let re = await unFollowUser(userId)
      if(re.error){
          window.bus.publish("alert", {"msg":re.error, "alertType":"error"});
      }
      else
      {     
        setLoginUserFollowing(false);
      }
    }
    
    
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
            <div>
              {user.bio}
            </div>
            {user.id !== userObj.id && (
              <button
                  type="button"
                  className="px-6 py-2 text-base font-semibold text-white bg-red-500 rounded-full outline-none"
                onClick={(e)=>{
                  e.stopPropagation();
                  loginUserFollowing ? userUnFollow(user.id):userFollow(user.id);
                }}
              >
                {loginUserFollowing ? 'UnFollow' : 'Follow'}
              </button>
            )}
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
        <div className="space-x-1 text-center mb-7">
          <button
            type="button"
            onClick={(e) => {
              setText(e.target.textContent);
              setActiveBtn('pins');
            }}
            className={`${activeBtn === 'pins' ? activeBtnStyles : notActiveBtnStyles}`}
          >
            {user.pins_count}
            <div>Pins</div>
          </button>
          <button
            type="button"
            onClick={(e) => {
              setText(e.target.textContent);
              setActiveBtn('followers');
            }}
            className={`${activeBtn === 'followers' ? activeBtnStyles : notActiveBtnStyles}`}
          >
            {user.followers_count}
            <div>Followers</div>
          </button>
          <button
            type="button"
            onClick={(e) => {
              setText(e.target.textContent);
              setActiveBtn('following');
            }}
            className={`${activeBtn === 'following' ? activeBtnStyles : notActiveBtnStyles}`}
          >
            {user.following_count}
            <div>Following</div>
          </button>
        </div>

        
        {activeBtn === "pins"?
          pins?.length > 0 ?
            <div className="px-2">
                <MasonryLayout pins={pins} likeChange={likeChange} setLikeChange={setLikeChange}/>
            </div>
          :
            <div className="flex items-center justify-center w-full mt-2 font-bold text-1xl">
            No Pins Found!
            </div>
          :
          activeBtn === "followers"?
          <UserList users={followers}  follower={true}/>
          :
          <UserList users={following} follower={false}/>
        }
      </div>

    </div>
    );
    

}

export default HomeTimeLine;