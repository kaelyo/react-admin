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
import NotFound from "../not-found/not-found";
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
        //const {collapsed} = this.state
        return (
            <Layout style={{width:'100%',minHeight:'100%'}}>
                {/* trigger={null} collapsible   collapsedWidth='0' collapsed={collapsed} */}
                <Sider  breakpoint="lg"
      collapsedWidth="0">
                    <LeftNav/>
                </Sider>
                <Layout>
                    <Header></Header>
                    <Content style={{margin: 15, backgroundColor: '#fff'}}>
                        <Switch>
                            <Redirect exact={true} from='/' to='/home'/>{/*exact  完全匹配*/}
                            <Route path='/home' component={Home}></Route>
                            <Route path='/category' component={Category}></Route>
                            <Route path='/product' component={Product}></Route>
                            <Route path='/role' component={Role}></Route>
                            <Route path='/user' component={User}></Route>
                            <Route path='/charts/bar' component={Bar}></Route>
                            <Route path='/charts/line' component={Line}></Route>
                            <Route path='/charts/pie' component={Pie}></Route>
                            <Route component={NotFound}/> {/* 上面没有一个匹配，直接显示*/}
                        </Switch>
                    </Content>
                    <Footer style={{textAlign: 'center', color: '#cccccc'}}>Footer</Footer>
                </Layout>
            </Layout>
        )
    }
}
