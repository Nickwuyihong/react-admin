import React, { Component } from 'react'
import { 
    Card, 
    Button,
    Table,
    Modal,
    message
} from 'antd'
import { PAGE_SIZE } from '../../utils/constants'
import { reqAddRole, reqRoles, reqUpdateRole } from '../../api'
import AddForm from './add-form'
import AuthForm from './auth-form'
import { formateDate } from '../../utils/dateUtils'
import { connect } from 'react-redux'
import { logout } from '../../redux/actions'

class Role extends Component {

    state = {
        roles: [],//所有角色的列表
        role: {},//当前选择角色
        isShowAdd: false,//是否显示添加界面
        isShowAuth: false,//是否显示权限界面
    }

    constructor (props) {
        super(props)
        this.auth = React.createRef()
    }

    initColumns = () => {
        this.columns = [
            {
                title: '角色名称',
                dataIndex: 'name'
            },
            {
                title: '创建时间',
                dataIndex: 'create_time',
                render: formateDate
            },
            {
                title: '授权时间',
                dataIndex: 'auth_time',
                render: formateDate
            },
            {
                title: '授权人',
                dataIndex: 'auth_name'
            },
        ]
    }

    onRow = (role) => {
        return {
            onClick: event => {
                this.setState({role})
            }
        }
    }

    getRoles = async () => {
        const res = await reqRoles()
        if (res.status === 0) {
            const roles = res.data
            this.setState({roles})
        }
    }

    /**
     * 添加角色
     */
    addRole = () => {
        //进行表单验证
        this.form.validateFields(async (err, value) => {
            if (!err) {
                //收集数据
                const { roleName } = value
                this.form.resetFields()
                //请求添加
                const res = await reqAddRole(roleName)
                //根据结果显示添加成功、失败
                if (res.status === 0) {
                    message.success('添加角色成功')
                    this.setState({
                        isShowAdd: false
                    })
                    this.getRoles()
                } else {
                    message.error('添加角色失败')
                }
            }
        })
    }

    /**
     * 设置角色权限
     */
    updateRole = async () => {
        const role = this.state.role
        //获取最新的menus、设置时间、设置的人
        const menus = this.auth.current.getMenus()
        role.menus = menus
        role.auth_time = Date.now()
        role.auth_name = this.props.user.username
        //请求更新
        const res = await reqUpdateRole(role)
        if (res.status === 0) {
            if (role._id === this.props.user.role_id) {
                this.props.logout()
                message.success('当前用户角色权限修改了，重新登录')
            } else {
                message.success('设置角色权限成功')
                this.setState({
                    isShowAuth: false,
                    roles: [...this.state.roles]
                })
            }
        } else {
            message.error('设置角色权限失败')
        }
    }

    UNSAFE_componentWillMount () {
        this.initColumns()
    }

    componentDidMount () {
        this.getRoles()
    }

    render() {
        const { roles, role, isShowAdd, isShowAuth } = this.state

        const title = (
            <span>
                <Button type='primary' onClick={() => this.setState({isShowAdd: true})}>创建角色</Button>&nbsp;&nbsp;
                <Button type='primary' disabled={!role._id} onClick={() => this.setState({isShowAuth: true})}>设置角色权限</Button>
            </span>
        )

        return (
            <Card title={title}>
                <Table
                    bordered
                    rowKey='_id'
                    dataSource={roles}
                    columns={this.columns}
                    pagination={{defaultPageSize: PAGE_SIZE}}
                    rowSelection={{
                        type: 'radio', 
                        selectedRowKeys: [role._id],
                        onSelect: (role) => {//选择某个radio时候的回调
                            this.setState({role})
                        }
                    }}
                    onRow={this.onRow}
                />

                <Modal
                    title="添加角色"
                    visible={isShowAdd}
                    onOk={this.addRole}
                    onCancel={() => {
                        this.setState({isShowAdd: false})
                        this.form.resetFields()
                    }}
                >
                    <AddForm
                        setForm={(form) => {this.form = form}}
                    />
                </Modal>
                <Modal
                    title="设置角色权限"
                    visible={isShowAuth}
                    onOk={this.updateRole}
                    onCancel={() => {
                        this.setState({isShowAuth: false})
                    }}
                >
                    <AuthForm
                        role={role}
                        ref={this.auth}
                    />
                </Modal>
            </Card>
        )
    }
}
export default connect(
    state => ({user: state.user}),
    { logout }
)(Role)