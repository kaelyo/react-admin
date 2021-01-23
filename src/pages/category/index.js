import React, { Component } from 'react'
import { Card,Table,Button,Icon,message,Modal } from 'antd';
import LinkButton from "../../components/Linkbutton";
import { reqCategorys,reqUpdateCategory,reqAddCategory } from "../../api";
import AddForm from "./add-form";
import UpdateFrom from "./update-form";


export default class Category extends Component {

    state ={
        loading: false,//是否正在获取数据中
        categorys:[],//一级分类列表
        subCategorys:[],//二级分类列表
        parentId:'0',//当前需要显示的分类列表的parentId
        parentName:'',//当前子列表的分类名
        showStatu:0,//标识添加/更新的确认框是否显示，0：都不显示，1：显示添加，2：显示更新
    }


    /*初始化Table所有列的数组 */
    initColumns = () => {
        this.columns = [
            {
              title: '分类的名称',
              dataIndex: 'name',//显示数据对饮的属性名
            },
            {
              title: '操作',
              width:300,
              render:(category)=>(
                  <div>
                      <LinkButton onClick={()=>{this.showUpdate(category)}}>修改分类</LinkButton>
                      {this.state.parentId==='0' ? <LinkButton onClick={()=>{this.showSubCategorys(category)}}>查看子分类</LinkButton>:null}   
                  </div>)
              
            }
          ];
    }

    /*获取一级/二级分类列表显示 */
    getCategorys= async (parentId)=>{
        //在发请求前，显示loading
        this.setState({loading:true})

         parentId = parentId || this.state.parentId

        //发送ajax请求，获取数据
        const result =await reqCategorys(parentId)

        //在请求完成之后，隐蔽loading
        this.setState({loading:false})
        if(result.status === 0){
            //取出分类数组(可能是一级也可能二级的)
            const categorys = result.data
            if(parentId==='0'){
               //更新一级分类
                this.setState({categorys}) 
            }else{
                //更新二级分类
                this.setState({subCategorys:categorys}) 
            }
            
        }else{
            message.error('获取一级分类失败')
        }
        
    }

    /*显示一级分类对象的二级子列表 */
    showSubCategorys=(category)=>{
        
        this.setState({
            parentId:category._id,
            parentName:category.name
        },()=>{
            
            this.getCategorys()
        })
    }

    /*显示一级分类 */
    showCategory=()=>{
        this.setState({
            parentId:'0',
            parentName:''
        })
    }

    /*响应点击取消 */
    handleCancel = ()=>{
        //清除输入数据
        this.form.resetFields()
        this.setState({
            showStatu:0
        })
    }


    /*显示添加对话框 */
    showAdd=()=>{
        this.setState({
            showStatu:1
        })
    }

    /*添加分类 */
    addCategory=  ()=>{

        //进行表单验证，只有通过了才处理
        this.form.validateFields(async (err,values)=>{
            if(!err){
                this.setState({
                    showStatu:0
                })
                //收集数据
                const {parentId,categoryName} = this.form.getFieldsValue()
                this.form.resetFields()
                const result = await reqAddCategory(categoryName,parentId)
                if(result.status===0){
                    //重新获取分类列表
                    if(parentId === this.state.parentId){
                        this.getCategorys()
                    }else if(parentId === '0'){// 在二级分类列表下添加一级分类, 重新获取一级分类列表, 但不需要显示一级列表
                        this.getCategorys('0')
                    }
                    
                }
            }
        })

        

        
    }

    /*显示修改对话框 */
    showUpdate=(category)=>{
        //保存分类对象
        this.category = category

        //更新状态
        this.setState({
            showStatu:2
        })
    }

    /*更新分类 */
    updateCategory=  ()=>{

        //进行表单验证，只有通过了才处理
        this.form.validateFields(async (err,values)=>{
            if(!err){
                //1，隐蔽确定框
                this.setState({
                    showStatu:0
                })
                //准备数据
                const categoryId = this.category._id
                const categoryName = this.form.getFieldValue('categoryName')
                //清除输入数据
                this.form.resetFields()
                //2，发请求更新分类
                const result = await reqUpdateCategory({categoryId,categoryName})
                if(result.status===0){
                    //3，重新显示列表
                    this.getCategorys()
                }
            }
        })
        

        

    }


    UNSAFE_componentWillMount(){
        this.initColumns()
    }

    /*执行异步任务：发送ajax请求*/
    componentDidMount(){
        this.getCategorys()
    }

    render() {
        const {categorys,loading,parentId,subCategorys,parentName,showStatu} = this.state
        //读取指定的分类
        const category = this.category || {}//如果还没有就指定一个空对象
        const titile = this.state.parentId==='0' ? '一级分类列表' :(
            <span>
                <LinkButton onClick={this.showCategory}>一级分类列表</LinkButton>
                <Icon type='arrow-right'/>
                <span>{parentName}</span>
            </span>
        )

        const extra = (
            <Button type='primary' onClick={this.showAdd}>
                <Icon type='plus'/>
                添加
            </Button>
        )
        
          
          

        return (

            <Card title={titile} extra={extra} style={{ }}>
                <Table
                 bordered
                 rowKey='_id'
                 loading={loading}
                 dataSource={parentId==='0' ? categorys:subCategorys} 
                 columns={this.columns} 
                 pagination={{defaultPageSize:5,showQuickJumper:true}}/>
                 <Modal
                    title="添加分类"
                    visible={showStatu===1}
                    onOk={this.addCategory}
                    onCancel={this.handleCancel}
                    okText='确定'
                    cancelText='取消'
                    >
                    <AddForm categorys={categorys} parentId={parentId} setForm ={(form)=>{this.form = form}}/>
                </Modal>
                <Modal
                    title="更新分类"
                    visible={showStatu===2}
                    onOk={this.updateCategory}
                    onCancel={this.handleCancel}
                    okText='确定'
                    cancelText='取消'
                    >
                    <UpdateFrom categoryName={category.name} setForm ={(form)=>{this.form = form}}/>
                </Modal>    
            </Card>
            
        )
    }
}
