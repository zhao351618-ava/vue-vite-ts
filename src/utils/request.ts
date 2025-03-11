
// 二次封装axios
// import axios from 'axios'
// import { ElMessage } from 'element-plus'
// import useUserStore from '@/store/modules/user'
// let request = axios.create({
//   baseURL: import.meta.env.VITE_APP_BASE_API || 'http://localhost:3000',
//   timeout: 5000,
// })


// request.interceptors.request.use(
//   (config) => {
//     let userStore = useUserStore()

//     if (userStore.token) {
//       config.headers.token = userStore.token
//     }

//     return config
//   },
//   (error) => {
//     return Promise.reject(error)
//   },
// )

// request.interceptors.response.use(
//   (response) => {
//     if (response.status === 200) {
//       return Promise.resolve(response.data)
//     } else {
//       return Promise.reject(response.data)
//     }
//   },
//   (error) => {
//     let message = ''
//     let status = error.response.status
//     switch (status) {
//       // 401: 未登录
//       // 未登录则跳转登录页面，并携带当前页面的路径
//       // 在登录成功后返回当前页面，这一步需要在登录页操作。
//       case 401:
//         message = '未登录'
//         break
//       // 403 token过期
//       // 登录过期对用户进行提示
//       // 清除本地token和清空vuex中token对象
//       // 跳转登录页面
//       case 403:
//         message = '登录过期，请重新登录'
//         break
//       case 404:
//         message = '网络请求不存在'
//         break
//       case 500:
//         message = '服务器出现问题'
//         break
//       default:
//         message = error.response.data.message
//         break
//     }
//     ElMessage({
//       type: 'error',
//       message,
//     })
//     return Promise.reject(error)
//   },
// )

// export default request



import axios from 'axios'
import { ElMessage } from 'element-plus'
import useUserStore from '@/store/modules/user'
let request = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API || 'http://localhost:3000',
  timeout: 5000,
})


// 需要特殊处理的路径（你自己的 API）
const specialApiPaths = ['/new_api']

// 请求拦截器：动态修改 baseURL 和添加 token
request.interceptors.request.use((config) => {
  // 动态修改 baseURL
  if (config.url && specialApiPaths.some((path) => config.url!.startsWith(path))) {
    config.baseURL = 'http://localhost:3000' // 修改为你自己的 API 的 baseURL
  }

  // 添加 token 到请求头
  let userStore = useUserStore()
  if (userStore.token) {
    config.headers.token = userStore.token
  }

  return config
}, (error) => {
  return Promise.reject(error)
})


request.interceptors.response.use(
  (response) => {
    if (response.data) {
      return Promise.resolve(response.data)
    } else {
      return Promise.reject(new Error('响应数据为空'))
    }
  },
  (error) => {
    let message = ''
    let status = error.response.status
    switch (status) {
      // 401: 未登录
      // 未登录则跳转登录页面，并携带当前页面的路径
      // 在登录成功后返回当前页面，这一步需要在登录页操作。
      case 401:
        message = '未登录'
        break
      // 403 token过期
      // 登录过期对用户进行提示
      // 清除本地token和清空vuex中token对象
      // 跳转登录页面
      case 403:
        message = '登录过期，请重新登录'
        break
      case 404:
        message = '网络请求不存在'
        break
      case 500:
        message = '服务器出现问题'
        break
      default:
        message = error.response.data.message
        break
    }
    ElMessage({
      type: 'error',
      message,
    })
    return Promise.reject(error)
  },
)


export default request
