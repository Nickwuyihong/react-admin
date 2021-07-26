/**
 * 包含n个action creator函数的模块
 * 同步action：对象{type：'xxx', data: 数据值}
 * 异步action：函数 dispatch => {}
 */

import { reqLogin } from "../api";
import storageUtils from "../utils/storageUtils";
import { RECEIVE_USER, RESET_USER, SET_HEAD_TITLE, SHOW_ERROR_MSG } from "./action-types";

/**
 * 设置头部标题的同步action
 * @param {string} headTitle 
 * @returns 
 */
export const setHeadTitle = headTitle => ({type: SET_HEAD_TITLE, data: headTitle})

/**
 * 接收用户的同步action
 * @param {any} user 
 * @returns 
 */
export const receiveUser = user => ({type: RECEIVE_USER, user})

/**
 * 显示错误信息的action
 * @param {string} err 
 * @returns 
 */
 export const showErrorMsg = err => ({type: SHOW_ERROR_MSG, err})

 export const logout = () => {
    //删除 local的user
    storageUtils.removeUser()
    //返回action对象
    return {type: RESET_USER}
 }

/**
 * 登录的异步action
 * @param {string} username 
 * @param {string} password 
 * @returns 
 */
export const login = (username, password) => {
    return async dispatch => {
        //1、执行异步ajax请求
        const res = await reqLogin(username, password)
        if (res.status === 0) {
            //2、分发成功的同步action
            const user = res.data
            //保存到localstorage
            storageUtils.saveUser(user)
            //分发接收用户的同步action
            dispatch(receiveUser(user))
        } else {
            //3、分发失败的同步action
            const msg = res.msg
            dispatch(showErrorMsg(msg))
        }
    }
}
