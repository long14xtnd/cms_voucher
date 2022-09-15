import axios from 'axios';
// import _ from 'lodash';

const instance = axios.create({
    baseURL: process.env.REACT_APP_URL_API_UPLOAD,
    // Authorization: process.env.REACT_APP_TOKEN,
    headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        // "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept, Authorization",
        // Authorization: process.env.REACT_APP_TOKEN,
      },
      timeout:process.env.REACT_APP_TIMEOUT_API
    // withCredentials: true
});

instance.interceptors.response.use(
    (response) => {
        // console.log(response)
        // const { data } = response;
        return response.data
    }
);

export default instance;
