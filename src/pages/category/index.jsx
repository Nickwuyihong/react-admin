import React, { Component } from 'react'
import { Card, Button, Table, message, Modal } from 'antd'
import { PlusOutlined, ArrowRightOutlined } from '@ant-design/icons'
import { getCateGoryList, updateCateGory } from '../../api'
import AddForm from './add-form'
import UpdateForm from './update-form'

export default class Category extends Component {

    state = {
        loading: false,//是否正在获取数据中
        categories: [], //一级分类列表
        subCategories: [],//二级分类列表
        parentId: '0',//当前需要显示的分类列表的父分类Id
        parentName: '',//当前需要显示的分类列表的父分类名称
        showStatus: 0//标识添加/更新的确认框是否显示. 0: 都不显示，1：显示添加，2：显示更新
    }

    /**
     * 初始化table所有列的数组
     */
    initColums = () => {
        this.columns = [{
            title: '分类的名称',
            dataIndex: 'name',
            render: text => <Button type='link'>{text}</Button>,
        }, {
            title: '操作',
            width: 300,
            render: (category) => (
                <span>
                    <Button type='link' onClick={() => this.showUpdate(category)}>修改分类</Button>
                    {this.state.parentId === '0' ? <Button type='link' onClick={() => this.showSubCategory(category)}>查看子分类</Button> : null}
                </span>
            )
        }]
    }

    /**
     * 异步获取分类列表
     */
    getCategory = async () => {
        const { parentId } = this.state
        //在请求之前设置loading
        this.setState({
            loading: true
        })
        //发异步ajax请求，获取数据（一级或二级的）
        const res = await getCateGoryList(parentId)
        this.setState({loading: false})
        if (res.status === 0) {
            const categories = res.data
            //更新一级的或者二级的状态
            if (parentId === '0') {
                this.setState({categories})
            } else {
                this.setState({
                    subCategories: categories
                })
            }
            
        } else {
            message.error('获取分类列表失败')
        }
    }

    /**
     * 显示子类
     * @param {any} category 
     */
    showSubCategory = (category) => {
        //更新状态
        this.setState({
            parentId: category._id,
            parentName: category.name
        }, () => {//在状态更新且重新render()后执行
            //获取二级分类列表
            this.getCategory()
        })
    }

    /**
     * 显示一级列表
     */
    showCategory = () => {
        //更新为一级状态
        this.setState({
            parentId: '0',
            parentName: '',
            subCategories: []
        })
    }

    /**
     * 关闭提示框
     */
    handleCancel = () => {
        // 清除输入数据
        this.ref.current.resetFields()
        this.setState({
            showStatus: 0
        })
    }

    /**
     * 显示添加框
     */
    showAdd = () => {
        this.setState({
            showStatus: 1
        })
    }

    /**
     * 显示更新框
     */
    showUpdate = (category) => {
        // 保存分类对象
        this.category = category
        //更新状态
        this.setState({
            showStatus: 2
        })
    }

    /**
     * 添加分类
     */
    addCategory = () => {
        this.ref.current.validateFields().then(
            value => {
                this.setState({
                    showStatus: 0
                })
            }
        ).catch(
            err => {
                console.log("adderr", err)
            }
        )
    }

    /**
     * 更新分类
     */
    updateCategory =  () => {
        this.ref.current.validateFields().then(
            async value => {
                //1、隐藏确定框
                this.setState({
                    showStatus: 0
                })
                //2、发请求更新分类
                const categoryId = this.category._id
                const categoryName = value.name
                const res = await updateCateGory({categoryId, categoryName})
                if (res.status === 0) {
                    //3、重新显示列表
                    this.getCategory()
                }
            }
        ).catch(
            err => {
                console.log("updateerr", err)
            }
        )
    }

    /**
     * 为第一次render()准备数据
     */
    UNSAFE_componentWillMount () {
       this.initColums()
    }

    /**
     * 执行异步任务，发异步ajax请求
     */
    componentDidMount () {
        this.getCategory()
    }

    render() {
        const { categories, loading, subCategories, parentId, parentName, showStatus } = this.state
        // 读取指定的分类
        const category = this.category || {} // 如果还没有指定一个空对象

        const title = (
            this.state.parentId === '0' ? '一级分类列表' : 
                (
                    <span>
                        <Button type='link' onClick={this.showCategory}>一级分类列表</Button>
                        <ArrowRightOutlined style={{marginRight: '20px'}} />
                        <span>{parentName}</span>
                    </span>
                )
        )

        const extra = (
            <Button type='primary' onClick={this.showAdd}><PlusOutlined />添加</Button>
        )

        return (
            <Card title={title} extra={extra} style={{ width: '100%', height: '100%' }}>
                <Table 
                    bordered
                    loading={loading}
                    rowKey='_id'
                    columns={this.columns} 
                    dataSource={parentId === '0' ? categories : subCategories}
                    pagination={{defaultPageSize: 5, showQuickJumper: true}}
                 />
                {showStatus===1 && <Modal
                    title="添加分类"
                    visible={showStatus===1}
                    onOk={this.addCategory}
                    onCancel={this.handleCancel}
                >
                    <AddForm
                        categorys={categories}
                        parentId={parentId}
                        setRef={(ref) => {this.ref = ref}}
                    />
                </Modal>}

                {showStatus===2 && <Modal
                    title="更新分类"
                    visible={showStatus===2}
                    onOk={this.updateCategory}
                    onCancel={this.handleCancel}
                >
                    <UpdateForm
                        categoryName={category.name || ''}
                        setRef={(ref) => {this.ref = ref}}
                    />
                </Modal>}
            </Card>
        )
    }
}
