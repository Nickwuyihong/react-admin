import React, { Component } from 'react'
import {
    Card,
    Icon,
    List
} from 'antd'
import LinkButton from '../../components/link-button'
import { BASE_IMG_URL } from '../../utils/constants'
import { reqCategory } from '../../api'

const Item = List.Item

export default class ProductDetail extends Component {

    state = {
        cName1: '',//一级分类名称
        cName2: '',//二级分类名称
    }

    async componentDidMount () {
        //得到当前商品的分类id
        const { pCategoryId, categoryId } = this.props.location.state.product
        if (pCategoryId === '0') {
            //一级分类下的商品
            const res = await reqCategory(categoryId)
            if (res.status === 0) {
                const cName1 = res.data.name
                this.setState({cName1})
            }
        } else {
            //二级分类下的商品
            //通过多个await方式发多个请求：后面一个请求是在前面一个请求成功返回之后才发送
            // const res1 = await reqCategory(pCategoryId)//获取一级分类列表
            // const res2 = await reqCategory(categoryId)//获取二级分类列表
            // const cName1 = res1.data.name
            // const cName2 = res2.data.name
            //一次发多个请求，只有都成功了才正常处理，这样效果是一样的，但是效率会更高
            const ress = await Promise.all([reqCategory(pCategoryId), reqCategory(categoryId)])
            const cName1 = ress[0].data.name
            const cName2 = ress[1].data.name
            this.setState({cName1, cName2})
        }
    }
    
    render() {
        //读取携带过来的state数据
        const {name, desc, price, detail, imgs} = this.props.location.state.product
        const { cName1, cName2 } = this.state
        const title = (
            <span>
                <LinkButton>
                    <Icon 
                        type='arrow-left' 
                        style={{marginRight: 15, fontSize: 20}}
                        onClick={()=>this.props.history.goBack()}
                    ></Icon>
                </LinkButton>
                <span>商品详情</span>
            </span>
        )

        return (
            <Card title={title} className='product-detail'>
                <List>
                    <Item style={{justifyContent: 'flex-start'}}>
                        <span className='left'>商品名称: </span>
                        <span className=''>{name}</span>
                    </Item>
                    <Item style={{justifyContent: 'flex-start'}}>
                        <span className='left'>商品描述: </span>
                        <span className=''>{desc}</span>
                    </Item>
                    <Item style={{justifyContent: 'flex-start'}}>
                        <span className='left'>价格: </span>
                        <span className=''>{price}</span>
                    </Item>
                    <Item style={{justifyContent: 'flex-start'}}>
                        <span className='left'>所属分类: </span>
                        {

                        }
                        <span className=''>{ cName1 }{ cName2 ? `——>${cName2}` : '' }</span>
                    </Item>
                    <Item style={{justifyContent: 'flex-start'}}>
                        <span className='left'>商品图片: </span>
                        <span className=''>
                        {
                            imgs.map( img => (
                                <img className='product-img' key={img} src={BASE_IMG_URL + img} alt="img" />
                            ))
                        }
                        </span>
                    </Item>
                    <Item style={{justifyContent: 'flex-start'}}>
                        <span className='left'>商品详情: </span>
                        <span className='' dangerouslySetInnerHTML={{__html: detail}}></span>
                    </Item>
                </List>
            </Card>
        )
    }
}
