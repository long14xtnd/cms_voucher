import axios from '../../axios'
const handleLoginApi = (dataApi) => {
    console.log(dataApi)
    // return axios.post('/api/login', {username,password})
    // return axios.post('/authenticate', {dataApi})
    // return axios.post('/authenticate', {
    //     method: 'POST',
    //     headers: {
    //       'Access-Control-Allow-Origin': '*',
    //       'Content-Type': 'application/json',
    //     },
    //   }).then(response => {
    //       console.log(111111)
    //   })
      return axios({
        url: '/authenticate',
        method: 'post',
        data:{
            username     :  dataApi.username,
            password     :  dataApi.password,
            deviceId     :  '123',
            key          :  '321',
            rememberMe   :  0,
            requestFrom  : 'CMS_FACTORY'
        }
      })
}

export {handleLoginApi}