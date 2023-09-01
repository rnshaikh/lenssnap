import React, {useState, useEffect} from "react";

import MasonryLayout from "./MasonryLayout";
import Spinner from "./Spinner";

import { getUserTimeLine } from "../services/userServices";

const Feed = ()=>{

    const [pins, setPins] = useState()
    const [loading, setLoading] = useState(false);

    const user = localStorage.user? JSON.parse(localStorage.user) : null; 


    useEffect(() => {
      
        async function fetchUserTimeline(){
            debugger;
            const res = await getUserTimeLine(user.id)
            if(res.error){
              alert(res.error)
            }
            else{
                setPins(res.data.results)
                setLoading(true)
              }
        }
        fetchUserTimeline()
  
      }, []);

    return (
        !loading ? 
                <Spinner message={`loading user timeline...`} />  
            :
            <div>
                {pins && (
                    <MasonryLayout pins={pins} />
                )}
            </div>
    );

}

export default Feed;
