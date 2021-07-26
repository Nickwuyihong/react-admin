import React, { Component } from 'react'
import { Card, Button } from 'antd'
import Reactcharts from 'echarts-for-react'

/**
 * 后台管理的柱状图路由组件
 */
export default class Line extends Component {

    state = {
        GTA: [55, 70, 90, 120, 140, 150],//给她爱
        RE8: [56, 69, 95, 125, 139, 152],//生化危机8
    }

    update = () => {
        this.setState( state => ({
            GTA: state.GTA.map( g => ++g),
            RE8: state.RE8.reduce( (pre, cur) => {
                pre.push(--cur)
                return pre
            } , []),
        }))
    }

    /**
     * 返回柱状图的配置对象
     * @param {any[]} GTA 
     * @param {any[]} RE8 
     * @returns 
     */
    getOption  = (GTA, RE8) => {
        return {
            title: {
                text: '4k 光追帧数'
            },
            tooltip: {},
            legend: {
                data:['GTA', 'Resident Evil 8']
            },
            xAxis: {
                data: ["RTX3060","RTX3060Ti","RTX3070","RTX3080","RTX3080Ti","RTX3090"]
            },
            yAxis: {},
            series: [{
                name: 'GTA',
                type: 'line',
                data: GTA
            },{
                name: 'Resident Evil 8',
                type: 'line',
                data: RE8
            }]
        }
    }

    render() {

        const { GTA, RE8 } = this.state

        return (
            <div>
                <Card>
                    <Button type='primary' onClick={this.update}>更新</Button>
                </Card>

                <Card title='折线图一'>
                    <Reactcharts option={this.getOption(GTA, RE8)}></Reactcharts>
                </Card>
            </div>
        )
    }
}
