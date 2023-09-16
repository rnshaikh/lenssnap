import React from "react";
import { Link } from "react-router-dom";

const UserList = ({users, follower})=>{


    const usersList = users.map(user=>{

        return follower ?
            (
                <Link to={`/user/hometimeline/${user?.followed_by.id}`} className="flex items-center gap-2 mt-5 bg-white rounded-lg ">
                <li className="py-3 sm:py-4" key={user.id}>
                    <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                            <img className="w-8 h-8 rounded-full" src={user?.followed_by?.picture} alt="user-profile"/>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                                {user?.followed_by?.first_name +" "+ user?.followed_by?.last_name} 
                            </p>
                        </div>
                    </div>
                </li>
                </Link>
            ) :
            (
                <Link to={`/user/hometimeline/${user?.followed_to.id}`} className="flex items-center gap-2 mt-5 bg-white rounded-lg ">
                <li className="py-3 sm:py-4" key={user.id}>
                    <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                            <img className="w-8 h-8 rounded-full" src={user?.followed_to?.picture} alt="user-profile"/>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                                {user?.followed_to?.first_name +" "+ user?.followed_to?.last_name} 
                            </p>
                        </div>
                    </div>
                </li>
                </Link>
            )
        
    })

    return (
        <div className="flow-root">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {usersList}
        </ul>
   </div>
    );

}


export default UserList;