import React, { Component } from 'react'
import './index.less'
import logo from '../../assets/images/logo.png'
import { NavLink,Link,withRouter } from "react-router-dom";
import { Menu, Icon } from 'antd';
import menuList from '../../config/menuConfig';//默认暴露的可以写任何名字
import memoryUtils from "../../utils/memoryUtils";


const { SubMenu } = Menu;
/*
    左侧导航的组件
*/
 class LeftNav extends Component {

    /**判断当前用户对item是否有权限 */
    hasAuth=(item)=>{
        const {key,isPublic}  = item
        const menus = memoryUtils.user.role.menus
        const username = memoryUtils.user.username
        /*
        1.如果当前用户是admin
        2.isPublic
        3.当前用户有此item的权限；看key有没有在menus中 
        */
       if(username === 'admin' || isPublic || menus.indexOf(key)!==-1){
            return true
       }else if(item.children){//4.如果当前用户有此item的某个子item的权限
           return !!item.children.find(children => menus.indexOf(children.key) !== -1)//找到了就true 没找到就false
       }
       
    }

    /*
    根据menu的数组生成对应的标签数组 
    使用map+加递归调用
    */
    getMenuNodes_map = (menuList)=>{
        return menuList.map(item=>{
            if(!item.children){
                return (
                    <Menu.Item key={item.key}>
                        <NavLink to={item.key}>
                            <Icon type={item.icon} />
                            <span>{item.title}</span>
                        </NavLink>
                    </Menu.Item>
                )
            }else{
                return (
                    <SubMenu
                        key={item.key}
                        title={
                        <span>
                            <Icon type={item.icon} />
                            <span>{item.title}</span>
                        </span>
                        }
                    >
                        {
                            this.getMenuNodes_map(item.children)
                        }
                        
                    </SubMenu>
                )
            }
             
        })
    }

    /*
    根据menu的数组生成对应的标签数组 
    使用reduce()+加递归调用

    */
   getMenuNodes = (menuList) => {
    //得到当前路径
    const path = this.props.location.pathname
    

    return menuList.reduce((pre, item) => {

      //如果当前用户有item对应的权限，才需要显示对应的菜单项
      if(this.hasAuth(item)){
              // 向pre添加<Menu.Item>
        if(!item.children) {
            pre.push((
              <Menu.Item key={item.key}>
                <Link to={item.key}>
                  <Icon type={item.icon}/>
                  <span>{item.title}</span>
                </Link>
              </Menu.Item>
            ))
          } else {
  
              //查找一个与当前请求路径匹配的子Item
              const cItem = item.children.find(cItem => path.indexOf(cItem.key) ===0)
              //如果存在，就打开item的子列表需要打开
              if(cItem){
                  this.openKey = item.key
              }
  
  
            // 向pre添加<SubMenu>
            pre.push((
              <SubMenu
                key={item.key}
                title={
                  <span>
                <Icon type={item.icon}/>
                <span>{item.title}</span>
              </span>
                }
              >
                {this.getMenuNodes(item.children)}
              </SubMenu>
            ))
          }
      }
      
      
      
      return pre
    }, [])
  }

  /**
    在第一次render()之前执行一次
    为第一次render()准备数据(必须同步)
   */
  UNSAFE_componentWillMount(){
      this.menuNodes = this.getMenuNodes(menuList)
  }

    render() {

        //得到当前路径
        let path = this.props.location.pathname
        if(path.indexOf('/product')===0){
            //console.log('1111111111');
            path = '/product'
        }
        //得到需要打开菜单项的key
        const open = this.openKey

        return (
            <div className='left-nav'>
               
                <Link to='/' className='left-nav-header'>
                    <img src={logo} alt='logo'/>
                    <h1>美食后台</h1>
                </Link>
                
                <Menu
                    //defaultSelectedKeys={['1']}
                    selectedKeys={[path]}
                    defaultOpenKeys={[open]}
                    mode="inline"
                    theme="dark"
                    // inlineCollapsed={this.state.collapsed}
                    >
                    {/* <Menu.Item key="/home">
                        <NavLink to='/home'>
                            <Icon type="home" />
                            <span>首页</span>
                        </NavLink>
                    </Menu.Item>
                   
                    <SubMenu
                        key="sub1"
                        title={
                        <span>
                            <Icon type="appstore" />
                            <span>商品</span>
                        </span>
                        }
                    >
                        <Menu.Item key="/category">
                            <NavLink to='/category'>
                                <Icon type="solution" />
                                <span>品类管理</span>
                            </NavLink>
                        </Menu.Item>
                        <Menu.Item key="6">
                            <NavLink to='/product'>
                                <Icon type="tool" />
                                <span>商品管理</span>
                            </NavLink>
                        </Menu.Item>
                    </SubMenu>
                    <Menu.Item key="/user">
                        <NavLink to='/user'>
                            <Icon type="user" />
                            <span>用户管理</span>
                        </NavLink>
                    </Menu.Item>

                    <Menu.Item key="/role">
                        <NavLink to='/role'>
                            <Icon type="usergroup-delete" />
                            <span>角色管理</span>
                        </NavLink>
                    </Menu.Item> */}
                    {
                        this.menuNodes
                    }
                    
                </Menu>
            </div>
            
        )
    }
}

/*withRouter高阶组件：
    包装非路由组件，返回一个新的组件
    新的组件向非路由组件传递3个属性：history/location/match */
export default withRouter(LeftNav)