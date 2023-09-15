import React, { useEffect, useState} from "react";

import { Link } from "react-router-dom";

import { getUserForFollow, followUser, unFollowUser } from '../services/userServices';

const UserFind = ()=>{

    const [users, setUsers] = useState([]);
    const [followed, setFollowed] = useState([]);


    useEffect(() => {
        async function fetchUser(){
          const re = await getUserForFollow()
          if(re.error){
              window.bus.publish("alert", {"msg":re.error, "alertType":"error"});
          }
          else
          {     
              debugger;
              setUsers(re.data.results);
          }
        }
        fetchUser();
      
      }, [])

    
    const userFollow = async(userId)=>{

        let re = await followUser(userId)
        if(re.error){
            window.bus.publish("alert", {"msg":re.error, "alertType":"error"});
        }
        else
        {     
            debugger;
            let userIds = [...followed, userId]
            setFollowed(userIds);
            
        }
    }

    const userUnFollow = async(userId)=>{

        let re = await unFollowUser(userId)
        if(re.error){
            window.bus.publish("alert", {"msg":re.error, "alertType":"error"});
        }
        else
        {     
            debugger;
            let userIds = followed.filter(id => id != userId);
            setFollowed(userIds)
            
        }
    }

    const usersList = users.map(user=>{

        return(
                <li class="py-3 sm:py-4" key={user.id}>
                    <div class="flex items-center space-x-4">
                        <div class="flex-shrink-0">
                        <Link to={`/user/hometimeline/${user?.id}`}>
                            <img class="w-8 h-8 rounded-full" src={user?.picture}/>
                        </Link>
                        </div>
                        <div class="flex-1 min-w-0">
                        <Link to={`/user/hometimeline/${user?.id}`}>
                            <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
                                {user?.first_name +" "+ user?.last_name} 
                            </p>
                        </Link>
                        </div>
                        <div class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                        <button
                            type="button"
                            className="px-6 py-2 text-base font-semibold text-white bg-red-500 rounded-full outline-none"
                            onClick={(e)=>{
                                e.stopPropagation();

                                if (followed.includes(user.id)){
                                    userUnFollow(user.id)
                    
                                }
                                else{
                                    userFollow(user.id);
                                }
                            }}
                        >
                            {followed.includes(user.id) ? 'UnFollow' : 'Follow'}
                        </button>
                        </div>
                    </div>
                </li>
            ) 
    })

    return (
    
        <div class="flow-root">
        <ul role="list" class="divide-y divide-gray-200 dark:divide-gray-700">
            {usersList}
        </ul>
        </div>
    )

}

export default UserFind;