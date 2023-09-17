import axios from "axios";




export const getUserPins = async(userId) =>{

    try{
        
        ;
        const params = {
            "user": userId,
            "page_size": 10000
        }

        const config = {
            headers : {
                "content-type": "application/json",
            },
            params
        }

        const res = await axios.get(`/api/pins/`,config)
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
        if (error?.response.status === 401){
            localStorage.clear()
        }
        let response = {"data": null, "error":error.response.data.detail};
        return response
        
    }
}



export const deleteUserPin = async(pinId) =>{

    try{
        
        const config = {
            headers : {
                "content-type": "application/json",
            }
        }

        const res = await axios.delete(`/api/pins/${pinId}/`,config)
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
        if (error?.response.status === 401){
            localStorage.clear()
        }
        let response = {"data": null, "error":error.response.data.detail};
        return response
        
    }
}



export const getPinDetail = async(pinId) =>{

    try{
        
        const config = {
            headers : {
                "content-type": "application/json",
            }
        }

        const res = await axios.get(`/api/pins/${pinId}/`,config)
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
        if (error?.response.status === 401){
            localStorage.clear()
        }
        let response = {"data": null, "error":error.response.data.detail};
        return response
        
    }
}


export const getPinComments = async(pinId) =>{

    try{
        
        ;
        const params = {
            "user": pinId,
            "page_size": 10000
        }

        const config = {
            headers : {
                "content-type": "application/json",
            },
            params
        }

        const res = await axios.get(`/api/pins/${pinId}/comments/`,config)
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
        if (error?.response.status === 401){
            localStorage.clear()
        }
        let response = {"data": null, "error":error.response.data.detail};
        return response
        
    }
}


export const saveUserPin = async (data)=>{

    try{

        const config = {
            headers : {
                "content-type": "multipart/form-data",
            }
        }
    
        const res = await axios.post(`/api/pins/`, data, config)
    
        if(res.status === 200){
            let response = {"data": res.data.data, "error":null};
            return response
        }
        else if(res.status === 401){
            localStorage.clear()
        }
        else{
            let response = {"data": null, "error":res.response.data.detail};
            return response
        }


    }
    catch(error){

        if (error?.response.status === 401){
            localStorage.clear()
        }

        let response = {"data": null, "error":error.response.data.detail};
        return response

    }
}

export const likeUserPin = async(pinId, content_type) =>{

    try{
        let data = {
            "content_type": content_type,
            "content_object": pinId
        }

        const config = {
            headers : {
                "content-type": "application/json",
            }
        }

        const res = await axios.post(`/api/likes/`, data, config)

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
        if (error?.response.status === 401){
            localStorage.clear()
        }
        let response = {"data": null, "error":error.response.data.detail};
        return response
    }

}

export const CommentUserPin = async(body) =>{

    try{
        ;
        let data = {
            "content_type": "pin",
            "content_object": body.pinId,
            "content": body.content,
            "parent": body?.parent
        }

        const config = {
            headers : {
                "content-type": "application/json",
            }
        }

        const res = await axios.post(`/api/comments/`, data, config)

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
        if (error?.response.status === 401){
            localStorage.clear()
        }
        let response = {"data": null, "error":error.response.data.detail};
        return response
    }

}

export const deleteUserComment = async(commentId) =>{

    try{
        
        const config = {
            headers : {
                "content-type": "application/json",
            }
        }

        const res = await axios.delete(`/api/comments/${commentId}/`,config)
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
        if (error?.response.status === 401){
            localStorage.clear()
        }
        let response = {"data": null, "error":error.response.data.detail};
        return response
        
    }

}