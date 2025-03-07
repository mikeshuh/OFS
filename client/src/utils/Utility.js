
import React from "react";
const requestServer = async (url_, method_, token_, data_ = null) => {
  console.log(url_);
  try {
    const response = await fetch(url_, {
      method: method_,
      headers: {
        'Authorization': `Bearer ${token_}`,
        "Content-Type": "application/json"
      },
      body: method_ === "GET" ? null : JSON.stringify(data_)
    });
    console.log("response generated");
    return response;

  }catch (error){
    return error;
  }
 }

 export default requestServer;
