import React, { Component } from 'react'
import  "./index.less";
import { Col,Row,Card,Statistic,Icon } from "antd";
import  Line  from "../../components/Line";

export default class Home extends Component {
    render() {
        return (
            <div className='home' style={{margin:15}}>
               <Row>
                   <Col span={8}>
                        <Card title='商品总量'>
                        <Statistic
                            title={<span style={{fontSize:23}}>商品总量</span>}
                            value={9.3}
                            precision={2}
                            valueStyle={{ color: '#cf1322' }}
                            prefix={<Icon type="arrow-down" />}
                            suffix="%"
                        />
                         <Statistic
                            title={<span style={{fontSize:23}}>同比增长</span>}
                            value={11.28}
                            precision={2}
                            valueStyle={{ color: '#3f8600' }}
                            prefix={<span><Icon type="arrow-up" /></span>}
                            //suffix={ss }
                            suffix="%"
                        />
                        </Card>
                   </Col>
                   <Col span={1}>
                   </Col>
                   <Col span={15}>
                    <Line/>
                   </Col>
               </Row>
            </div>
        )
    }
}
