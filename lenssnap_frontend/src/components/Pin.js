import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdDownloadForOffline } from 'react-icons/md';
import { BiCommentDetail } from 'react-icons/bi';
import { AiTwotoneDelete } from 'react-icons/ai';
import {FcLike} from 'react-icons/fc';
import { BsFillArrowUpRightCircleFill } from 'react-icons/bs';

import { deleteUserPin } from '../services/pinServices'; 


const Pin = ({pin}) =>{
    
    const [postHovered, setPostHovered] = useState(false);
    const [savingPost, setSavingPost] = useState(false);

    const navigate = useNavigate();

    const user = localStorage.getItem('user') !== 'undefined' ? JSON.parse(localStorage.getItem('user')) : localStorage.clear();
    let alreadySaved = pin?.save?.filter((item) => item?.created_by?.id === user?.id);
    alreadySaved = alreadySaved?.length > 0 ? alreadySaved : [];

    const savePin = (id) =>{
        console.log("save id", id);
    }

    const deletePin = async (id) =>{
      
        let resp = await deleteUserPin(id)

        if(resp.error){
          window.bus.publish("alert", {"msg":resp.error, "alertType":"error"});
        }
        else{
            let alertObj = {"msg": "pin delete successfully", "alertType": "success"}
            window.bus.publish("alert", alertObj);
            window.location.reload();
        }
    }

    return (
        <div className="m-2">
          <div
            onMouseEnter={() => setPostHovered(true)}
            onMouseLeave={() => setPostHovered(false)}
            onClick={() => navigate(`/pin-detail/${pin.id}`)}
            className="relative w-auto overflow-hidden transition-all duration-500 ease-in-out rounded-lg cursor-zoom-in hover:shadow-lg"
          >
              {pin.file && (
            <img className="w-full rounded-lg " src={process.env.REACT_APP_BACKEND_URL+pin.file} alt="user-post" /> )}
            {postHovered && (
              <div
                className="absolute top-0 z-50 flex flex-col justify-between w-full h-full p-1 pt-2 pb-2 pr-2"
                style={{ height: '100%' }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <a
                      href={`${process.env.REACT_APP_BACKEND_URL+pin.file}?dl=`}
                      download
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      className="flex items-center justify-center p-2 text-xl bg-white rounded-full outline-none opacity-75 w-9 h-9 text-dark hover:opacity-100 hover:shadow-md"
                    ><MdDownloadForOffline />
                    </a>
                  </div>
                  {alreadySaved?.length !== 0 ? (
                    <button type="button" className="px-5 py-1 text-base font-bold text-white bg-red-500 outline-none opacity-70 hover:opacity-100 rounded-3xl hover:shadow-md">
                      {pin?.save?.length}  Saved
                    </button>
                  ) : 
                  pin.created_by.id !== user.id && (   
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        savePin(pin.id);
                      }}
                      type="button"
                      className="px-5 py-1 text-base font-bold text-white bg-red-500 outline-none opacity-70 hover:opacity-100 rounded-3xl hover:shadow-md"
                    >
                      {pin?.save?.length}   {savingPost ? 'Saving' : 'Save'}
                    </button>
                  )}
                </div>
                <div className="flex items-center justify-between w-full gap-2 ">
                 <button
                    className="flex items-center justify-center p-2 bg-white rounded-full outline-none opacity-75 w-15 h-15 text-dark hover:opacity-100"
                    >
                    <FcLike/>
                    <p>{pin.likes_count}</p>
                  </button>
                  <button
                    className="flex items-center justify-center p-2 bg-white rounded-full outline-none opacity-75 w-15 h-15 text-dark hover:opacity-100"
                    >    
                    <BiCommentDetail />
                    <p>{pin.comments_count}</p>
                    </button>
                  {
                    pin.created_by?.id === user.id && (
                    <button
                        type="button"
                        onClick={(e) => {
                        e.stopPropagation();
                        deletePin(pin.id);
                        }}
                        className="flex items-center justify-center p-2 bg-white rounded-full outline-none opacity-75 w-15 h-15 text-dark hover:opacity-100"
                    >
                    <AiTwotoneDelete />
                    </button>
                )
                }
                </div>
              </div>
            )}
          </div>
          {
            pin.created_by.id !== user.id && (
                <Link to={`/user/hometimeline/${pin.created_by?.id}`} className="flex items-center gap-2 mt-2">
                <img
                className="object-cover w-8 h-8 rounded-full"
                src={pin.created_by?.picture}
                alt="user-profile"
                />
                <p className="font-semibold capitalize">{pin.created_by?.first_name + " "+ pin.created_by?.last_name }</p>
                </Link>
            )
          }
           <p className="flex-wrap text-sm font-thin hover:italic ">{pin.description}</p>
        </div>
      );

}

export default Pin;
