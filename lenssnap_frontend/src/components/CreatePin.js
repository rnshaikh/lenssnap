import React, {useState} from "react";

import { AiOutlineCloudUpload } from "react-icons/ai";
import { MdDelete } from "react-icons/md";

import Spinner from "./Spinner";

import { saveUserPin }  from "../services/pinServices";
import { useNavigate } from "react-router-dom";


const CreatePin = ({user}) =>{

    const [file, setFile] = useState();
    const [fileUrl, setFileUrl] = useState();
    const [description, setDescription] = useState();
    const [fields, setFields] = useState(false);
    const [loading, setLoading] = useState(false);
    const [wrongImageType, setWrongImageType] = useState(false)

    const navigate = useNavigate()

    const uploadImage = (e)=>{
        ;
        setLoading(true);
        let fileObj = e.target.files[0]
        let supported_files = process.env.REACT_APP_SUPPORTED_FILES
        supported_files = supported_files.replace(/'/g, '"')
        supported_files = JSON.parse(supported_files)
        if(supported_files.includes(fileObj.type)){
            let url = URL.createObjectURL(fileObj)
            setFile(fileObj);
            setFileUrl(url);
            setLoading(false);
            setWrongImageType(false);
        }
        else{
            setWrongImageType(true);
            setLoading(false);
        }

    }

    const savePin = async(e)=>{

        if (!file || !description){

            setFields(true);

        }
        else{
            setFields(false);
            let data = {
                file,
                description
            }

            let response = await saveUserPin(data)

            if(response.error){
                window.bus.publish("alert", {"msg":response.error, "alertType":"error"});
              }
              else{
                let alertObj = {"msg": "pin created successfully", "alertType": "success"}
                window.bus.publish("alert", alertObj);
                navigate("/");     
            }
        }
    
    }

    return (
        <div className="flex flex-col items-center justify-center mt-5 lg:h-4/5">
          {fields && (
            <p className="mb-5 text-xl text-red-500 transition-all duration-150 ease-in ">Please add all fields.</p>
          )}
          <div className="flex flex-col items-center justify-center w-full p-3 bg-white lg:flex-row lg:p-5 lg:w-4/5">
            <div className="bg-secondaryColor p-3 flex flex-0.7 w-full">
              <div className="flex flex-col items-center justify-center w-full p-3 border-2 border-gray-300 border-dotted h-420">
                {loading && (
                  <Spinner />
                )}
                {
                  wrongImageType && (
                    <p>It&apos;s wrong file type.</p>
                  )
                }
                {!file ? (
                  // eslint-disable-next-line jsx-a11y/label-has-associated-control
                  <label>
                    <div className="flex flex-col items-center justify-center h-full">
                      <div className="flex flex-col items-center justify-center">
                        <p className="text-2xl font-bold">
                          <AiOutlineCloudUpload />
                        </p>
                        <p className="text-lg">Click to upload</p>
                      </div>
    
                      <p className="mt-32 text-gray-400">
                        Recommendation: Use high-quality JPG, JPEG, SVG, PNG, GIF or TIFF less than 20MB
                      </p>
                    </div>
                    <input
                      type="file"
                      name="upload-image"
                      onChange={uploadImage}
                      className="w-0 h-0"
                    />
                  </label>
                ) : (
                  <div className="relative h-full">
                    <img
                      src={fileUrl?fileUrl:null}
                      alt="uploaded-pic"
                      className="w-full h-full"
                    />
                    <button
                      type="button"
                      className="absolute p-3 text-xl transition-all duration-500 ease-in-out bg-white rounded-full outline-none cursor-pointer bottom-3 right-3 hover:shadow-md"
                      onClick={() => { setFile(null); setFileUrl(null)}}
                    >
                      <MdDelete />
                    </button>
                  </div>
                )}
              </div>
            </div>
    
            <div className="flex flex-col flex-1 w-full gap-6 mt-5 lg:pl-5">
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell everyone what your Pin is about"
                className="p-2 text-2xl font-bold border-b-2 border-gray-200 outline-none sm:text-3xl"
              />
              {user && (
                <div className="flex items-center gap-2 mt-2 mb-2 bg-white rounded-lg ">
                  <img
                    src={user?.picture}
                    className="w-10 h-10 rounded-full"
                    alt="user-profile"
                  />
                  <p className="font-bold">{user.first_name + "" + user.last_name}</p>
                </div>
              )}
              
    
              <div className="flex flex-col">
                <div className="flex items-end justify-end mt-5">
                  <button
                    type="button"
                    onClick={savePin}
                    className="p-2 font-bold text-white bg-red-500 rounded-full outline-none w-28"
                  >
                    Save Pin
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
    );
}

export default CreatePin;
