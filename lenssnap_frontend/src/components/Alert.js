import React, { useEffect, useId, useState } from "react";

const Alert = ()=>{

    const [alerts, setAlerts] = useState([]);
    const uid = useId();

    const success = "p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400"
    const error = "p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"

    useEffect(() => {
        window.bus.subscribe("alert", (e)=>{
            const { msg, alertType} = e;
            setAlerts((prev)=>[...prev, {uid, msg, alertType}])

            setTimeout(()=>{
                setAlerts(alerts.filter((alert)=>alert.uid !== uid))
            }, 5000)

        })
    })
    
    return(
        <div className="fixed z-50 flex flex-col items-center justify-center w-full p-3 notification-box">
            {alerts && alerts.map((alert)=>{
                let classes = alert.alertType==="success" ? success : error;
                return <div key={alert.id} className={classes} role="alert">
                        {alert.msg}
                    </div>
                })
            }
        </div>
    )
}

export default Alert;