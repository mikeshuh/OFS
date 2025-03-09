import axios from 'axios';

const requestServer = async (url_, method_, token_, data_ = null) => {
  console.log("Requested");
  try {
    const response = await axios({
      method: method_,
      url: url_,
      data: data_,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token_}`
      }
    });
    console.log("Response received:", response);
    return response;
  } catch (error) {
    // console.log("Error:", error);
    return error.response || error;
  }
};

export default requestServer;
