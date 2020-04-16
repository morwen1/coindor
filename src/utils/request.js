import axios from 'axios'
import { Message, MessageBox, Notification  } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
/* eslint-disable */
// create an axios instance
const service = axios.create({
  baseURL: process.env.BASE_API, // API Base URL
  //baseURL: 'http://api.artsignsoluciones.com/',
  timeout: 40000 // request timeout
})

// request interceptor
service.interceptors.request.use(config => {
  // Do something before request is sent
  if (store.getters.token) {
    config.headers['Authorization'] = getToken()
  }
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone interceptor
service.interceptors.response.use(
  // response => response,
response => {
  const res = response.data
     if (res.status == false) {
		Message({
		 message: res.msg,
		 type: 'error',
		 duration: 5 * 1000
		})
		/*Object.keys(res.msg).forEach(function(key) {
			Message({
			 message: res.msg[key],
			 type: 'error',
			 duration: 5 * 1000
			})
		})*/
  //     // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
       if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
         MessageBox.confirm('Ha cerrado la sesión, puede cancelar para permanecer en esta página o iniciar sesión de nuevo', 'Confirmar cierre de sesión', {
           confirmButtonText: 'Volver a iniciar sesión',
          cancelButtonText: 'Cancelar',
           type: 'warning'
         }).then(() => {
           store.dispatch('FedLogOut').then(() => {
             location.reload()
           })
         })
       }
       return Promise.reject('error')
     } else {
       return response.data
     }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  })

export default service
