import axios from "axios";




export const getUserPins = async(userId) =>{

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

        const res = await axios.get(`/api/pins/`,config)
        if(res.status === 200){
            let response = {"data": res.data.data, "error":null};
            return response
        }
        else if(res.status===401){
            localStorage.clear()
        }
        else{
            let response = {"data": null, "error":res.data};
            return response
        }

    }
    catch(error){
        let response = {"data": null, "error":error.message};
        return response
        
    }
}