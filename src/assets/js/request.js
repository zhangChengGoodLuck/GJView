import axios from "axios";

// 创建axios实例
export const baseURL = 'http://10.18.43.45/ksh'

const service = axios.create({
  baseURL,
  timeout: 30000, // 请求超时时间
  withCredentials: true,
});
// 添加request拦截器
service.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);
// 添加respone拦截器
service.interceptors.response.use(
  (response) => {
    let res = {};
    res.status = response.status;
    res.data = response.data.data;
    return res;
  },
  (error) => {
    return Promise.reject(error.response);
  }
);

export function get(url, params = {}) {
  params.t = new Date().getTime(); //get方法加一个时间参数,解决ie下可能缓存问题.
  return service({
    url: url,
    method: "get",
    headers: {},
    params,
  });
}

export function getFile(url, params = {}) {
  params.t = new Date().getTime(); //get方法加一个时间参数,解决ie下可能缓存问题.
  return service({
    url: url,
    method: "get",
    responseType: "arraybuffer",
    headers: {},
    params,
  });
}

//封装post请求
export function post(url, data = {}) {
  //默认配置
  let sendObject = {
    url: url,
    method: "post",
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
    },
    data: data,
  };
  sendObject.data = JSON.stringify(data);
  return service(sendObject);
}

//封装put方法 (resfulAPI常用)
export function put(url, data = {}) {
  return service({
    url: url,
    method: "put",
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
    },
    data: JSON.stringify(data),
  });
}
//删除方法(resfulAPI常用)
export function deletes(url) {
  return service({
    url: url,
    method: "delete",
    headers: {},
  });
}

export { service };
