import React, { Component } from 'react'
import { Card,Button } from "antd";
import ReactECharts from 'echarts-for-react';

// render echarts option.


export default class Bar extends Component {
    state={
        sales : [5, 20, 36, 10, 10, 20],
        stores : [5, 23, 32, 14, 16, 20]
    }
    update=()=>{
         this.setState(state =>({
             sales:state.sales.map(sale => sale + 1),
             stores:state.stores.reduce((pre,store) => {
                 pre.push(store-1)
                 return pre
             },[])
         }))
    }
    getOption = ()=>{
       return   {
        title: {
            text: 'ECharts 入门示例'
        },
        tooltip: {},
        legend: {
            data:['销量','库存']
        },
        xAxis: {
            data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
        },
        yAxis: {},
        series: [{
            name: '销量',
            type: 'bar',
            data: [...this.state.sales]
        },{
            name: '库存',
            type: 'bar',
            data: [...this.state.stores]
        }]
        };
    }
    render() {
        return (
            <div>
                <Card>
                    <Button type='primary' onClick={this.update}>刷新</Button>
                </Card>
                <Card title='柱状图'>
                    <ReactECharts option={this.getOption()} />
                </Card>
            </div>
        )
    }
}
