import React, { Component } from 'react'
import { Redirect } from 'react-router-dom';
import memoryUtils from "../../utils/memoryUtils";
import { Layout } from 'antd';
import Header from "../../components/Header";
import LeftNav from "../../components/LeftNav";

const {  Footer, Sider, Content } = Layout;


export default class Admin extends Component {
    render() {
        const user = memoryUtils.user
        //如果内存没有存储user ==> 当前没有登录
        if(!user || !user._id){
            // 自动跳转到登录(在render()中)
            return <Redirect to='/login'/>
        }
        return (
            <Layout style={{width:'100%',height:'100%'}}>
                <Sider>Sider</Sider>
                <Layout>
                    <Header>Header</Header>
                    <Content>Content</Content>
                    <Footer>Footer</Footer>
                </Layout>
            </Layout>
        )
    }
}
