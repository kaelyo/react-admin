/*
    能发送异步ajax请求的函数模块
    封装axios库
    函数的返回值是promise对象
    1.优化：统一处理异常
*/
import axios from 'axios'
import {message} from 'antd'

const BASE = ''

export default function ajax (url,data={},type='GET'){//形参概念值

    return new Promise((resolve, reject) => {
        let promise
        // 1. 执行异步ajax请求
        if(type==='GET') { // 发GET请求
          promise = axios.get(BASE+url, { // 配置对象
            params: data // 指定请求参数
          })
        } else { // 发POST请求
          promise = axios.post(BASE+url, data)
        }
        // 2. 如果成功了, 调用resolve(value)
        promise.then(response => {
          resolve(response.data)
        // 3. 如果失败了, 不调用reject(reason), 而是提示异常信息
        }).catch(error => {
          // reject(error)
          message.error('请求出错了: ' + error.message)
        })
      })


}