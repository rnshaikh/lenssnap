import React, {useState, useEffect} from "react";
import { useParams, Link } from "react-router-dom";

import { BiCommentDetail } from 'react-icons/bi';
import {FcLike} from 'react-icons/fc';
import { MdDownloadForOffline } from 'react-icons/md';

import Spinner from "./Spinner";
import MasonryLayout from "./MasonryLayout";

import { getPinDetail, getPinComments } from "./../services/pinServices";


const PinDetail = ({user}) =>{

    const params = useParams()
    const [pinDetail, setPinDetail] = useState();
    const [replies, setReplies] = useState();
    const [pins, setPins] = useState();
    const [comment, setComment] = useState('');
    const [addingComment, setAddingComment] = useState(false);


    useEffect(() => {

        async function fetchPinDetail(){

            const resp = await getPinDetail(params.id)
            console.log("Pin Detail", resp);
            if(resp.error){
                window.bus.publish("alert", {"msg":resp.error, "alertType":"error"});
              }
              else{
                
                let commentsResp = await getPinComments(params.id)

                if(commentsResp.error){
                    window.bus.publish("alert", {"msg":commentsResp.error, "alertType":"error"});
                }
                else{
                    setPinDetail(resp.data)
                    setReplies(commentsResp.data.results)
                }
            }
        }
        fetchPinDetail()
    }, [])

    console.log("respolies", replies)
    const addComment = () => {
        if (comment) {
          //setAddingComment(true);
        }
      };
    
    if (!pinDetail) {
        return (
            <Spinner message="Showing pin" />
        );
    }
    
    console.log("pindeatil", pinDetail)
    return (
        <>
          {pinDetail && (
            <div className="flex flex-col m-auto bg-white xl:flex-row" style={{ maxWidth: '1500px', borderRadius: '32px' }}>
              <div className="flex items-center justify-center flex-initial md:items-start">
                <img
                  className="rounded-b-lg rounded-t-3xl"
                  src={process.env.REACT_APP_BACKEND_URL+pinDetail?.file}
                  alt="user-post"
                />
              </div>
              <div className="flex-1 w-full p-5 xl:min-w-620">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <a
                      href={`${pinDetail.file}?dl=`}
                      download
                      className="flex items-center justify-center p-2 text-xl rounded-full opacity-75 bg-secondaryColor text-dark hover:opacity-100"
                    >
                      <MdDownloadForOffline />
                    </a>
                  </div>
                  <button
                    className="flex items-center justify-center p-2 bg-white rounded-full outline-none opacity-75 w-15 h-15 text-dark hover:opacity-100"
                    >
                    <FcLike/>
                    <p>{pinDetail.likes_count}</p>
                  </button>
                  <button
                    className="flex items-center justify-center p-2 bg-white rounded-full outline-none opacity-75 w-15 h-15 text-dark hover:opacity-100"
                    >    
                    <BiCommentDetail />
                    <p>{pinDetail.comments_count}</p>
                    </button>
                  <a href={pinDetail?.destination} target="_blank" rel="noreferrer">
                    {pinDetail?.destination?.slice(8)}
                  </a>
                </div>
                <div>
                  <h1 className="mt-3 text-4xl font-bold break-words">
                    {pinDetail.title}
                  </h1>
                  <p className="mt-3">{pinDetail.description}</p>
                </div>
                <Link to={`/user-profile/${pinDetail?.created_by}`} className="flex items-center gap-2 mt-5 bg-white rounded-lg ">
                  <img src={pinDetail.created_by?.picture} className="w-10 h-10 rounded-full" alt="user-profile" />
                  <p className="font-bold">{pinDetail.created_by?.first_name + " "+ pinDetail.created_by?.last_name }</p>
                </Link>
                <h2 className="mt-5 text-2xl">Comments</h2>
                <div className="overflow-y-auto max-h-370">
                  {replies?.map((item) => (
                    <div className="flex items-center gap-2 mt-5 bg-white rounded-lg" key={item.id}>
                      <img
                        src={item.created_by?.picture}
                        className="w-10 h-10 rounded-full cursor-pointer"
                        alt="user-profile"
                      />
                      <div className="flex flex-col">
                        <p className="font-bold">{item.created_by?.first_name + " "+ item.created_by?.last_name}</p>
                        <p>{item.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-3 mt-6">
                  <Link to={`/user-profile/${user.id}`}>
                    <img src={user.picture} className="w-10 h-10 rounded-full cursor-pointer" alt="user-profile" />
                  </Link>
                  <input
                    className="flex-1 p-2 border-2 border-gray-100 outline-none rounded-2xl focus:border-gray-300"
                    type="text"
                    placeholder="Add a comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <button
                    type="button"
                    className="px-6 py-2 text-base font-semibold text-white bg-red-500 rounded-full outline-none"
                    onClick={addComment}
                  >
                    {addingComment ? 'Doing...' : 'Done'}
                  </button>
                </div>
              </div>
            </div>
          )}
          {pins?.length > 0 && (
            <h2 className="mt-8 mb-4 text-2xl font-bold text-center">
              More like this
            </h2>
          )}
          {pins ? (
            <MasonryLayout pins={pins} />
          ) : (
            <Spinner message="Loading more pins" />
          )}
        </>
      );


}

export default PinDetail;