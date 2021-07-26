import React, { Component } from 'react'
import { 
    Card,
    Button,
    Table,
    Modal,
    message
} from 'antd'
import { formateDate } from '../../utils/dateUtil'
import LinkButton from '../../components/link-button'
import { PAGE_SIZE } from '../../utils/constants'
import { reqAddOrUpdateUser, reqDeleteUser, reqUsers } from '../../api'
import UserForm from './user-form'

export default class User extends Component {

    state = {
        users: [], //所有的用户列表
        roles: [], //所有角色的列表
        isShow: false,//是否显示修改框
        loading: false
    }

    initColumns = () => {
        this.columns = [
            {
                title: '用户名',
                dataIndex: 'username'
            },
            {
                title: '邮箱',
                dataIndex: 'email'
            }, 
            {
                title: '电话',
                dataIndex: 'phone'
            },
            {
                title: '注册时间',
                dataIndex: 'create_time',
                render: formateDate
            },
            {
                title: '所属角色',
                dataIndex: 'role_id',
                render: id => this.roleNames[id]
            },
            {
                title: '操作',
                render: (user) => (
                    <span>
                        <LinkButton onClick={() => this.showUpdate(user)}>修改</LinkButton>&nbsp;&nbsp;
                        <LinkButton onClick={() => this.deleteUser(user)}>删除</LinkButton>
                    </span>
                )
            }
        ]
    }

    /**
     * 显示修改界面
     * @param {any} user 
     */
    showUpdate = (user) => {
        this.user = user//保存user
        this.setState({
            isShow: true
        })
    } 

    /**
     * 添加或更新用户
     */
    addOrUpdateUser = () => {
        //1、收集输入数据
        this.form.validateFields( async (err, value) => {
            if (!err) {
                this.setState({isShow: false})
                this.form.resetFields()
                let isUser = false
                if (this.user && this.user._id) {
                    isUser = true
                    value._id = this.user._id
                } 
                //2、提交添加的请求
                const res = await reqAddOrUpdateUser(value)
                //3、更新列表显示
                if (res.status === 0) {
                    message.success(`${isUser ? '修改' : '添加'}用户成功!`)
                    this.getUsers()
                } else {
                    message.error(`${isUser ? '修改' : '添加'}用户失败!`)
                }
            }
        })
    }

    /**
     * 获取用户列表
     */
    getUsers = async () => {
        this.setState({
            loading: true
        })
        const res = await reqUsers()
        if (res.status === 0) {
            const { users, roles } = res.data
            this.initRoleNames(roles)
            this.setState({
                users,
                roles,
                loading: false
            })
        }
    }

    deleteUser = (user) => {
        Modal.confirm({
            title: `你确定要删除${user.username}吗`,
            onOk: async () => {
                const res = await reqDeleteUser(user._id)
                if (res.status === 0) {
                    message.success('删除角色成功！')
                    this.getUsers()
                } else {
                    message.error('删除角色失败')
                }
            }   
        })

    }

    /**
     * 根据role的数组，生成包含所有角色的对象（属性名用角色id值）
     * @param {any[]} roles 
     */
    initRoleNames = (roles) => {
        this.roleNames = roles.reduce((pre, role)=>{
            pre[role._id] = role.name
            return pre
        }, {})
    }

    componentWillMount () {
        this.initColumns()
    }

    componentDidMount () {
        this.getUsers()
    }

    render() {

        const { users, isShow, loading, roles } = this.state
        const user = this.user || {}
        const title = <Button type='primary' onClick={() => this.setState({isShow: true})}>创建用户</Button>

        return (
            <Card title={title}>
                <Table 
                    bordered
                    rowKey='_id'
                    loading={loading}
                    dataSource={users}
                    columns={this.columns}
                    pagination={{defaultPageSize: PAGE_SIZE, showQuickJumper: true}}
                />
                <Modal
                    title={`${user._id ? '修改' : '创建'}用户`}
                    visible={isShow}
                    onOk={this.addOrUpdateUser}
                    onCancel={() => {
                        this.setState({isShow: false}, () => {
                            this.user = {}
                        })
                        this.form.resetFields()
                    }}
                >
                    <UserForm 
                        setForm={form => this.form = form}
                        roles={roles}
                        user={user}
                    ></UserForm>
                </Modal>
            </Card>
        )
    }
}
