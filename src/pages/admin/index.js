import React, { Component } from 'react'
import { Redirect, Route,Switch } from 'react-router-dom';
import memoryUtils from "../../utils/memoryUtils";
import { Layout } from 'antd';
import Header from "../../components/Header";
import LeftNav from "../../components/LeftNav";
import Home from "../home";
import Category from "../category";
import Bar from "../charts/bar";
import Line from "../charts/line";
import Pie from "../charts/pie";
import Product from "../product";
import Role from "../role";
import User from "../user";
import PubSub from "pubsub-js";

const {  Footer, Sider, Content } = Layout;


export default class Admin extends Component {
    state = {
        collapsed: false,
      };

    componentDidMount(){
        this.token = PubSub.subscribe('left-nav',(_,data)=>{
            this.setState(data)
            //console.log('收到的left-nav',data);
        })
    }
    componentWillUnmount(){
        PubSub.unsubscribe(this.token)
    }


    render() {
        const user = memoryUtils.user
        //如果内存没有存储user ==> 当前没有登录
        if(!user || !user._id){
            // 自动跳转到登录(在render()中)
            return <Redirect to='/login'/>
        }
        const {collapsed} = this.state
        return (
            <Layout style={{width:'100%',height:'100%'}}>
                <Sider  trigger={null} collapsible   collapsedWidth='0' collapsed={collapsed}>
                    <LeftNav/>
                </Sider>
                <Layout>
                    <Header></Header>
                    <Content style={{margin: 15, backgroundColor: '#fff'}}>
                        <Switch>
                            <Route path='/home' component={Home}></Route>
                            <Route path='/category' component={Category}></Route>
                            <Route path='/product' component={Product}></Route>
                            <Route path='/role' component={Role}></Route>
                            <Route path='/user' component={User}></Route>
                            <Route path='/charts/bar' component={Bar}></Route>
                            <Route path='/charts/line' component={Line}></Route>
                            <Route path='/charts/pie' component={Pie}></Route>
                            <Redirect to='/home'/>
                        </Switch>
                    </Content>
                    <Footer style={{textAlign: 'center', color: '#cccccc'}}>Footer</Footer>
                </Layout>
            </Layout>
        )
    }
}
