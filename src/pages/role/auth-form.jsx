import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  Form,
  Input,
  Tree
} from 'antd'
import menuList from '../../config/menuConfig'
const Item = Form.Item
const {TreeNode} = Tree
/*
修改角色的form组件
 */
export default class AuthForm extends Component {

    static propTypes = {
        role: PropTypes.object
    }

    constructor (props) {
        super(props)

        //根据传入的角色的menus生成初始状态
        const {menus} = this.props.role
        this.state = {
            checkedKeys: menus
        }
    }

    /**
     * 生成树节点
     * @param {any[]} list 
     */
    getTreeNodes = (list) => {
        return list.reduce((pre, item) => {
            pre.push(<TreeNode title={item.title} key={item.key}>
                {
                    item.children && this.getTreeNodes(item.children)
                }
            </TreeNode>)
            return pre
        }, [])
    }

    //为父组件提交获取最新menus数据的方法
    getMenus = () => this.state.checkedKeys

    //选中某个node时的回调
    onCheck = checkedKeys => {
        this.setState({checkedKeys})
    }

    componentWillMount () {
        this.treeNodes = this.getTreeNodes(menuList)
    }

    //根据新传入的role来更新checkedkeys的状态
    componentWillReceiveProps (nextProps) {
        const menus = nextProps.role.menus
        //这里两个写法是一样的,还没执行render
        this.setState({
            checkedKeys:menus
        })
        //this.state.checkedKeys = menus
    }

    render() {
        const { role } = this.props
        const { checkedKeys } = this.state
        const formItemLayout = {
            labelCol: {span: 5},
            wrapperCol: {span: 15}
        }

        return (
            <div>
                <Item label='角色名称' {...formItemLayout}>
                    <Input value={role.name} disabled/>
                </Item>

                <Tree
                    checkable
                    defaultExpandAll={true}
                    checkedKeys={checkedKeys}
                    onCheck={this.onCheck}
                >
                    <TreeNode title='平台权限' key='all'>
                        { this.treeNodes }
                    </TreeNode>
                </Tree>
            </div>
        )
    }
}