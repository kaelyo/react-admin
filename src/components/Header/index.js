import React, { Component } from 'react'
import  './index.less'
import { Icon,Modal} from 'antd'
import { withRouter } from "react-router-dom";
import menuList from "../../config/menuConfig";
import {formateDate} from '../../utils/dateUtils'
import Linkbutton from "../Linkbutton";
import {reqWeather} from '../../api'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import qing  from "./img/qing.png";
import PubSub from "pubsub-js";


 class Header extends Component {
    
    state={
        currentTime : formateDate(Date.now()),
        wea_img:'',//天气图片的url
        wea:'',
        city:'',
        collapsed: false,
    }

    toggle = () => {
        //因为setState是异步执行的
         
        this.setState({
            collapsed: !this.state.collapsed,
          },()=>{
            PubSub.publish('left-nav',{collapsed: this.state.collapsed})
          });
         
      };
    getTime=()=>{
        this.interval = setInterval(()=>{
            const currentTime = formateDate(Date.now())
            this.setState({currentTime})
        },1000)
    }
    getWeather=async ()=>{
        const {wea,wea_img,city} = await reqWeather()
        console.log(wea_img);
        this.setState({wea,wea_img,city})
    }

    /*第一次render()之后执行一次
        一般在此执行以部操作：发ajax请求/启动定时器 */
    componentDidMount(){
        this.getTime()
        this.getWeather()
    }
    getTitle = ()=>{
        //得到当前请求路径
        const path = this.props.location.pathname
        let title
        menuList.forEach(item=>{
            if(item.key === path){ //如果当前的item对象的key与path相等
                title = item.title
            }else if (item.children){ //如果有子列表
                const cItem = item.children.find(cItem =>cItem.key === path)
                if(cItem){
                    title = cItem.title
                }
            }
        })
        return title
    }
    logout = ()=>{
        //显示确认框
        Modal.confirm({
            title: '您确定要退出么?',
            content: '',
            onOk:()=> {//此处要使用箭头函数 因为这里this不是所需要的this
              console.log('OK');
              //删除保存的user数据
                storageUtils.removeUser()
                memoryUtils.user ={}

                //跳转到login
              this.props.history.replace('/login')
            },
            onCancel() {
              console.log('Cancel');
            },
            cancelText:'取消',
            okText:'确定'
          });

    }
    /*
    不能这么做；不会更新显示
    UNSAFE_componentWillMount(){
        this.title = this.getTitle()
    }
    */
    /*当前组件卸载之前调用 */
    
    componentWillUnmount(){
        //清除定时器
        clearInterval(this.interval)
    } 

    render() {
        const {currentTime,wea,} = this.state
        const username = memoryUtils.user.username
        const title = this.getTitle()
        return (
            <div className='header'>
                <div className='header-top'>
                     <Icon
                    className="trigger"
                    type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                    onClick={this.toggle} 
                    />
                    <Icon type='user'/> &nbsp;
                    <span >{username}</span>
                    <Linkbutton type='primary'  onClick={this.logout}>退出</Linkbutton>
                </div>
                <div className='header-bottom'>
                    <div className='header-bottom-left'>
                        {title}
                    </div>
                    <div className='header-bottom-right'>
                        <span>{currentTime}</span>
                        <img src={qing} alt='weather'/>
                        <span >{wea}</span>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Header)