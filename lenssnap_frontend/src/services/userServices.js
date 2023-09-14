import axios from "axios";


export const getAccessToken= async(token)=>{

    try{
        let body = {
            "grant_type": "convert_token",
            "client_id": process.env.REACT_APP_BACKEND_CLIENT_ID,
            "client_secret": process.env.REACT_APP_BACKEND_CLIENT_SECRET,
            "backend": "google-oauth2",
            "token": token 
        }

        const config = {
            headers : {
                "content-type": "application/json",
            }
        }

        const res = await axios.post(`/auth/convert-token/`, body, config)
        if(res.status === 200){

            const data = res.data
            let response = {"data": data, "error":null};
            return response

        }
        else{
            let response = {"data": null, "error":res.response.data.detail};
            return response
        }

    }
    catch(error){
        let response = {"data": null, "error":error.response.data.detail};
        return response
    }
};


export const getUserProfile = async() =>{

    try{

        const config = {
            headers : {
                "content-type": "application/json",
            },
        }

        const res = await axios.get(`/api/users/profile/`,config)
        if(res.status === 200){

            localStorage.setItem('user',JSON.stringify(res.data.data))
            
        }
    }
    catch(error){
        return error
    }
}


export const getUserHomeTimeLine = async(userId) =>{

    try{
        
        debugger;
        const params = {
            "user": userId
        }

        const config = {
            headers : {
                "content-type": "application/json",
            },
            params
        }

        const res = await axios.get(`/api/hometimelines/`,config)
        if(res.status === 200){
            let response = {"data": res.data.data, "error":null};
            return response
        }
        else if(res.status===401){
            localStorage.clear()
        }
        else{
            let response = {"data": null, "error":res.response.data.detail};
            return response
        }

    }
    catch(error){
        let response = {"data": null, "error":error.response.data.detail};
        return response
        
    }
}

export const getUserTimeLine = async(userId)=>{

    try{
        
        debugger;
        
        const params = {
            "user": userId,
            "page_size":10000
        }

        const config = {
            headers : {
                "content-type": "application/json",
            },
            params
        }

        const res = await axios.get(`/api/usertimelines/`,config)
        if(res.status === 200){
            let response = {"data": res.data.data, "error":null};
            return response
        }
        else if(res.status===401){
            localStorage.clear()
        }
        else{
            let response = {"data": null, "error":res.response.data.detail};
            return response
        }

    }
    catch(error){
        let response = {"data": null, "error":error.response.data.detail};
        return response   
    }
}


export const getUserFollowers = async(userId)=>{

    try{
        
        debugger;
        
        const params = {
            "user": userId,
            "page_size":10000
        }

        const config = {
            headers : {
                "content-type": "application/json",
            },
            params
        }

        const res = await axios.get(`/api/followers/`,config)
        if(res.status === 200){
            let response = {"data": res.data.data, "error":null};
            return response
        }
        else if(res.status===401){
            localStorage.clear()
        }
        else{
            let response = {"data": null, "error":res.response.data.detail};
            return response
        }

    }
    catch(error){
        let response = {"data": null, "error":error.response.data.detail};
        return response   
    }
}

export const getUserFollowing = async(userId)=>{

    try{
        
        debugger;
        
        const params = {
            "user": userId,
            "page_size":10000
        }

        const config = {
            headers : {
                "content-type": "application/json",
            },
            params
        }

        const res = await axios.get(`/api/followers/following/`,config)
        if(res.status === 200){
            let response = {"data": res.data.data, "error":null};
            return response
        }
        else if(res.status===401){
            localStorage.clear()
        }
        else{
            let response = {"data": null, "error":res.response.data.detail};
            return response
        }

    }
    catch(error){
        let response = {"data": null, "error":error.response.data.detail};
        return response   
    }
}


export const getUserForFollow = async(userId)=>{

    try{
        
        debugger;
        const params = {
            "page_size":10000
        }

        const config = {
            headers : {
                "content-type": "application/json",
            },
            params
        }

        const res = await axios.get(`/api/users/`,config)
        if(res.status === 200){
            let response = {"data": res.data.data, "error":null};
            return response
        }
        else if(res.status===401){
            localStorage.clear()
        }
        else{
            let response = {"data": null, "error":res.response.data.detail};
            return response
        }

    }
    catch(error){
        let response = {"data": null, "error":error.response.data.detail};
        return response   
    }
}


export const followUser = async(userId) =>{


    try{
        
        debugger;
        const config = {
            headers : {
                "content-type": "application/json",
            }
        }

        const data = {
            "followed_to": userId
        }

        const res = await axios.post(`/api/followers/`, data)
        if(res.status === 200){
            let response = {"data": res.data.data, "error":null};
            return response
        }
        else if(res.status===401){
            localStorage.clear()
        }
        else{
            let response = {"data": null, "error":res.response.data.detail};
            return response
        }

    }
    catch(error){
        let response = {"data": null, "error":error.response.data.detail};
        return response   
    }


}



export const unFollowUser = async(userId) =>{


    try{
        
        debugger;
        const config = {
            headers : {
                "content-type": "application/json",
            }
        }

        const data = {
            "followed_to": userId
        }

        const res = await axios.post(`/api/followers/unfollow/`, data)
        if(res.status === 200){
            let response = {"data": res.data.data, "error":null};
            return response
        }
        else if(res.status===401){
            localStorage.clear()
        }
        else{
            let response = {"data": null, "error":res.response.data.detail};
            return response
        }

    }
    catch(error){
        let response = {"data": null, "error":error.response.data.detail};
        return response   
    }


}

