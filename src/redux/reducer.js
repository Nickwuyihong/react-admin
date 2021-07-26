import { combineReducers } from "redux"
import storageUtils from "../utils/storageUtils"
import { RECEIVE_USER, RESET_USER, SET_HEAD_TITLE, SHOW_ERROR_MSG } from "./action-types"

const initTitle = '首页'
const initUser = storageUtils.getUser()

/**
 * 用来管理
 * @param {any} state 
 * @param {any} action 
 */
function user (state = initUser, action) {
    switch (action.type) {
        case RECEIVE_USER:
            return action.user
        case SHOW_ERROR_MSG:
            const err = action.err
            return {...state, err}
        case RESET_USER:
            return {}
        default:
            return state
    }
}

/**
 * 用来管理头部标题
 * @param {any} state 
 * @param {any} action 
 */
function headTitle (state = initTitle, action) {
    switch (action.type) {
        case SET_HEAD_TITLE:
            return action.data
        default:
            return state
    }
}

/**
 * 向外默认暴露的是合并产生的总的reducer函数
 * 管理的总的state的结构
 * {
 *      headTitle: '首页',
 *      user: {}
 * }
 */
export default combineReducers({
    user,
    headTitle
})
