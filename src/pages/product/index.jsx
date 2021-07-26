import React, { Component } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import ProductAddUpdate from './add-update'
import ProductDetail from './detail'
import ProductHome from './home'
import "./product.less";

/**
 * 商品路由
 */
export default class Product extends Component {
    render() {
        return (
            <Switch> 
                <Route path='/product' component={ProductHome} exact></Route>{/**路径完全匹配 */}
                <Route path='/product/addupdate' component={ProductAddUpdate}></Route>
                <Route path='/product/detail' component={ProductDetail}></Route>
                <Redirect to='/product'></Redirect>
            </Switch>
        )
    }
}
