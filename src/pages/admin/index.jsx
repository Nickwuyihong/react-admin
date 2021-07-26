import React, { Component } from 'react'
import { Switch, Redirect, Route } from 'react-router-dom'
import { Layout } from 'antd'
import Header from '../../components/header'
import LeftNav from '../../components/left-nav'
import Home from '../home'
import Category from '../category/category'
import Bar from '../charts/bar'
import Line from '../charts/line'
import Pie from '../charts/pie'
import Product from '../product'
import Role from '../role'
import User from '../user'
import { connect } from 'react-redux'
import NotFound from '../not-found/not-found'

const { Content, Footer, Sider } = Layout;
/**
 * 后台管理的路由组件
 */
class Admin extends Component {
    render() {
        const user = this.props.user
        if (user && user._id)
            return (
                <Layout style={{minHeight: '100%'}}>
                    <Sider>
                        <LeftNav/>
                    </Sider>
                    <Layout>
                        <Header>header</Header>
                        <Content style={{background: '#fff', margin: 30}}>
                            <Switch>
                                <Redirect exact={true} from='/' to='/home'></Redirect>
                                <Route path='/home' component={Home}></Route>
                                <Route path='/category' component={Category}></Route>
                                <Route path='/bar' component={Bar}></Route>
                                <Route path='/line' component={Line}></Route>
                                <Route path='/pie' component={Pie}></Route>
                                <Route path='/product' component={Product}></Route>
                                <Route path='/role' component={Role}></Route>
                                <Route path='/user' component={User}></Route>
                                <Route path='/charts/bar' component={Bar}></Route>
                                <Route path='/charts/line' component={Line}></Route>
                                <Route path='/charts/pie' component={Pie}></Route>
                                {/* 上面没有一个匹配，直接显示notfound */}
                                <Route component={NotFound}></Route>
                            </Switch>
                        </Content>
                        <Footer style={{textAlign: 'center', color: '#cccccc'}}>推荐使用谷歌浏览器，可以获得更佳页面操作体验</Footer>
                    </Layout>
                </Layout>
            )
        else return <Redirect to='/login'/>
    }
}
export default connect(
    state => ({user: state.user}),
    {}
)(Admin)