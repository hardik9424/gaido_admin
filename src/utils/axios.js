import axios from 'axios'

import config from '@/config'

export default (endpoint, method, data, isMultipart) =>
  axios({
    url: ` http://localhost:4000/api/${endpoint}`,
    method,
    data,
    headers: {
      'Content-Type': isMultipart ? 'multipart/form-data' : 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
    // withCredentials: true,
  })

//https://b60c-103-117-14-244.ngrok-free.app
//url: `http://localhost:2008/subscription/api/v1/${endpoint}`  
//  url: `https://pawsome.applore.in/${service}/api/v1/${endpoint}`,
// url: `http://localhost:${port}/${service}/api/v1/${endpoint}`,
// http://localhost:4000
// url: ` https://gaido-api.applore.in/api/${endpoint}`,