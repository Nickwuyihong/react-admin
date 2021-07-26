import React, { Component } from 'react'
import './index.less'
import logo from '../../assets/images/logo.png'
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { login } from '../../api';
import Mem from '../../utils/memoryUtil';
import Stor from '../../utils/storageUtil';
import { Redirect } from 'react-router-dom'
/**
 * 登录的路由组件
 */
export default class Login extends Component {

    /**
     * v4版本这个函数如果没通过校验是不会被调用的；
     * 所以直接在这里写提交表单的操作就行了；
     * 不用再自己校验多一次
     */
    onFinish = async (value) => {
        const {username, password} = value
        const rsp =  await login(username, password)
        /**success: {status: 0, data: user} 
         * fail: {status: 1, data: '用户名或密码不正确!'}
         */
        if (rsp.status === 0) {
            message.success('登录成功!')
            /**跳转之前保存user到内存 */
            Mem.user = rsp.data
            /**保存到本地存储 */
            Stor.saveUser(rsp.data)
            /**路由跳转
             * 跳转到管理界面，不需要再退回到登录
             */
            this.props.history.replace('/')
        } else {
            message.error('登录失败：' ,rsp.data)
        }
    }

    /**
     * 对密码进行自定义验证
     */
    validatePwd = (_, value) => {
        if (!value) {
            return Promise.reject(new Error("密码必须输入！"))
        } else if (value.length < 4) {
            return Promise.reject(new Error('密码必须大于3位!'))
        } else if (value.length > 12) {
            return Promise.reject(new Error('用户名必须小于13位!'))
        } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
            return Promise.reject(new Error('用户名必须是英文、数字或下划线组成!'))
        } else {
            return Promise.resolve()
        }
    }

    render() { 
        /**如果已经登录过，就跳转到管理界面 */
        if (Mem.user.username) return <Redirect to='/admin'></Redirect>
        return (
            <div className="login">
                <div className="login-header">
                    <img src={logo} alt="logo" />
                    <h1>REACT ADMIN SYSTEM</h1>
                </div>
                <section className="login-content">
                    <h1>PRESENTED BY SMART BRAIN</h1>
                    <Form
                        name="normal_login"
                        className="login-form"
                        initialValues={{ remember: true }}
                        onFinish={this.onFinish}
                        >
                        <Form.Item
                            /**
                             * 用户名和密码的合法性要求
                             * 1、必须输入
                             * 2、必须大于3位
                             * 3、必须小于13位
                             * 4、必须是英文、数字或下划线
                             * 配置对象：属性名是一些特定的名称
                             * 声明式验证：直接使用别人定义好的验证规则进行验证
                             */
                            name="username"
                            rules={[
                                { required: true, whitespace: true, message: '用户名必须输入!' },
                                { min: 4, message: '用户名必须大于4位!' },
                                { max: 12, message: '用户名必须小于12位!' },
                                { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须是英文、数字或下划线组成!' }
                            ]}
                        >
                            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="USERNAME" />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[{
                                validator: this.validatePwd
                            }]}
                        >
                            <Input
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            type="password"
                            placeholder="PASSWORD"
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                            LOGIN
                            </Button>
                        </Form.Item>
                    </Form>
                </section>
            </div>
        )
    }
}
