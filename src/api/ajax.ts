/**
 * 能发送Ajax请求的函数模块
 * 封装axios库
 * 函数的返回值是Promise对象
 * 1、优化1：统一处理异常
 * 在外层包一个自己创建的promise对象
 * 在请求出错时，不reject(error)，而是显示错误提示
 * 2、优化2：异步得到不是response，而是response.data
 * 在请求成功resolve时：resolve(response.data)
*/
import { message } from "antd";
import axios from "axios";

export default function ajax (url: string, data = {}, method = 'GET') {
    return new Promise((resolve, reject)=>{
        let promise
        //1、执行异步Ajax请求
        if (method === 'GET') {//发get请求
            promise = axios.get(url, {//配置对象
                params: data//指定请求参数
            })
        } else if (method === 'POST') {
            promise = axios.post(url, data)
        }
        //2、如果成功了调用resolve(value)，如果失败了不调用reject(err)，而是直接显示出来
        promise?.then(res => resolve(res.data)).catch(err => message.error('请求出错了：', err))
    })
}