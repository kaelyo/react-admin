import React, { Component } from 'react'
import { Button,Card,Table,Modal, message } from "antd";
import {PAGE_SIZE} from "../../utils/constants"
import { reqRoles ,reqAddRole,reqUpdateRole} from "../../api";
import AddForm from './add-form';
import AuthForm from './auth-form';
import memoryUtils from "../../utils/memoryUtils";
import { formateDate } from "../../utils/dateUtils";
import  storageUtils  from "../../utils/storageUtils";

// const Item = Card.Item

export default class Role extends Component {
    state ={
        roles:[],//所有的角色
        role:{},//选中的role
        isShowAdd: false, // 是否显示添加界面
        isShowAuth: false, // 是否显示设置权限界面
    }
    constructor(props){
        super(props)
        this.auth = React.createRef()
    }
    initColumn = ()=>{
        this.columns = [
            {
                title: '角色名称',
                dataIndex: 'name'
            },
            {
                title: '创建时间',
                dataIndex: 'create_time',
                render:(create_time)=>formateDate(create_time)
            },
            {
                title: '授权时间',
                dataIndex: 'auth_time',
                render:formateDate
            },
            {
                title: '授权人',
                dataIndex: 'auth_name'
            },
        ]
    }
    onRow=(role)=>{
        return {
            onClick: event =>{//点击行
                console.log('onClick: row',event);
                console.log(role);
                //message.success('点击行')
                this.setState({role})
            }
        }
    }
    getRoles= async ()=>{
      const result =  await reqRoles()
      if(result.status === 0){
        const roles = result.data
        console.log(result);
        this.setState({
            roles
        })
      }
    }
    addRole=()=>{
        //进行表单验证
        this.form.validateFields(async (error,values)=>{
            if(!error){
                //
                this.setState({isShowAdd:false})

                //收集数据
                const {roleName} = values
                this.form.resetFields()
                const result = await reqAddRole(roleName)
                if(result.status === 0){
                    message.success('添加角色成功')
                    const role = result.data
                    // //const roles = this.state.roles
                    // const roles = [...this.state.roles]
                    // roles.push(role)
                    // this.setState({roles})

                    //更新roles的状态：基于原本状态更新数据
                    this.setState(state=>({
                        roles:[...state.roles,role]
                    }))
                }else{
                    message.success('添加角色失败')
                }

            }
        })

        
        
    }
    updateRole=async ()=>{
        const role = this.state.role
        const menus = this.auth.current.getMenus()
        role.menus = menus
        role.auth_time = Date.now()
        role.auth_name = memoryUtils.user.username

        this.setState({isShowAuth:false})
        const result = await reqUpdateRole(role)
        if(result.status === 0 ){
            
            //this.getRoles()
            if(role._id === memoryUtils.user.role_id){
                memoryUtils.user = {}
                storageUtils.removeUser()
                this.props.history.replace('/login')
                message.warn('当前用户角色权限修改了，请重新登陆')
            }else{
                message.success('设置角色权限成功')
                this.setState({
                    roles:[...this.state.roles]
                })
            }
            
            
        }
    }
    componentDidMount(){
        this.getRoles()
    }
    UNSAFE_componentWillMount(){
        this.initColumn()
    }
    render() {
        const {roles,role,isShowAdd,isShowAuth} = this.state
        const title = (
            <span>
                <Button type='primary' onClick={()=>{this.setState({isShowAdd:true})}}>创建角色</Button>&nbsp;&nbsp;
                <Button type='primary' disabled={!role._id} onClick={()=>this.setState({isShowAuth:true})}>设置角色权限</Button>&nbsp;&nbsp;
            </span>)
        return (
            <div>
                <Card title={title}>
                    <Table
                        bordered
                        rowKey='_id'
                        columns={this.columns}
                        dataSource={roles}
                        pagination={{defaultPageSize: PAGE_SIZE}}
                        rowSelection={{
                            type: 'radio',
                            selectedRowKeys:[role._id],
                            onSelect:(role)=>{
                                this.setState({role})
                            }
                        }}
                        onRow={this.onRow}
                    />
                    <Modal
                        title="添加角色"
                        visible={isShowAdd}
                        okText='确定'
                        cancelText='取消'
                        onOk={this.addRole}
                        onCancel={() => {
                            this.setState({isShowAdd: false})
                            this.form.resetFields()
                        }}
                        >
                        <AddForm setForm={(form)=>{this.form  = form }}/>
                    </Modal>
                    <Modal
                        title="添加角色"
                        visible={isShowAuth}
                        okText='确定'
                        cancelText='取消'
                        onOk={this.updateRole}
                        onCancel={() => {
                            this.setState({isShowAuth: false})
                        }}
                        >
                        <AuthForm ref={this.auth} role={role}/>
                    </Modal>
                </Card>
            </div>
        )
    }
}
