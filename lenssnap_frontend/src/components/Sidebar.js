import React from "react";
import { Link, NavLink } from 'react-router-dom';

import { RiHomeFill } from 'react-icons/ri';
import { IoIosArrowForward } from 'react-icons/io';
import logo from '../assets/lens_logo.png';



const isNotActiveStyle = 'flex items-center px-5 gap-3 text-gray-500 hover:text-black transition-all duration-200 ease-in-out capitalize';
const isActiveStyle = 'flex items-center px-5 gap-3 font-extrabold border-r-2 border-black  transition-all duration-200 ease-in-out capitalize';


const Sidebar = ({closeToggle, user})=>{

    const handleCloseSidebar =() =>{
        if (closeToggle){
            closeToggle(false)
        }
    }
    return (
        <div className="flex flex-col justify-between h-full overflow-y-scroll bg-white min-w-210 hide-scrollbar">
            <div className="flex flex-col">
                <Link
                to="/"
                className="flex items-center gap-2 px-5 pt-1 my-6 w-190"
                onClick={handleCloseSidebar}
                >
                <img src={logo} alt="logo" className="w-full" />
                </Link>
                <div className="flex flex-col gap-5">

                <NavLink
                    to="/"
                    className={({ isActive }) => (isActive ? isActiveStyle : isNotActiveStyle)}
                    onClick={handleCloseSidebar}
                >
                    <RiHomeFill />
                    Home
                </NavLink>
                </div>
            </div>
            {user && (
                <Link
                to={`/user/hometimeline/${user.id}`}
                className="flex items-center gap-2 p-2 mx-3 my-5 mb-3 bg-white rounded-lg shadow-lg"
                onClick={handleCloseSidebar}
                >
                <img src={user.picture} className="w-10 h-10 rounded-full" alt="user-profile" />
                <p>{user.userName}</p>
                <IoIosArrowForward />
                </Link>
            )}
        </div>
    )

}

export default Sidebar;