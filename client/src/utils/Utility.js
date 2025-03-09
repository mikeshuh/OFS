import axios from 'axios';

const requestServer = async (url_, method_, token_, data_ = null) => {
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
    return response;
  } catch (error) {
    return error.response || error;
  }
};

export default requestServer;
