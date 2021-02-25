import React, { Component } from 'react'
import { Card,Select,Input,Button,Icon,Table, message } from "antd";
import LinkButton from "../../components/Linkbutton";
import { reqGetProducts,reqSearchProducts,reqUpdateStatus } from "../../api";
import memoryUtils from '../../utils/memoryUtils';



const Option = Select.Option

export default class ProductHome extends Component {

    state = {
        total:0,//总数量
        products:[],//商品的数组
        loading:false,
        searchName:'',//搜索的关键字
        searchType:'productName',//根据哪个字段来收集
    }

    /*初始化table的列的数组 */
    initColumns = ()=>{
        this.columns = [
            {
              title: '商品名称',
              dataIndex: 'name',
            },
            {
              title: '商品描述',
              dataIndex: 'desc',
            },
            {
              title: '价格',
              dataIndex: 'price',
              render:(price)=>'￥'+price
            },
            {
                width:100,
                title: '状态',
                //dataIndex: 'status',
                render:(product)=>{
                    const {status,_id} = product
                    const newStatus = status === 1?2:1
                    return (
                        <span>
                            <Button 
                            type='primary' 
                            onClick={()=>{this.updateStatu(_id,newStatus)}}> {status===1 ? '下架' : '上架'}</Button>
                            <span>{status===1 ? '在售' : '已下架'}</span>
                        </span>
                    )
                }
            },
            {
                width:100,
                title: '操作',
                render:(product)=>{
                    return (
                        <span>
                            <LinkButton onClick={()=>this.showDetail(product)}>详情</LinkButton>
                            <LinkButton onClick={()=>this.showUpdate(product)}>修改</LinkButton>
                        </span>
                    )
                }
            },
          ];
    }

    showDetail = (product)=>{
        //缓存product对象 ===》 给detail组件使用
        memoryUtils.product = product
        this.props.history.push('/product/productdetail')
    }
    showUpdate = (product)=>{
        //缓存product对象 ===》 给updatel组件使用
        memoryUtils.product = product
        this.props.history.push('/product/ProductAddUpdate')
    }

    /*获取商品 指定页码 */
    getProducts= async (pageNum,pageSize)=>{
        this.pageNum = pageNum
        this.pageSize = pageSize
        const {searchName,searchType} = this.state
        
        let result
        this.setState({loading:true})
        if(searchName){
            result = await reqSearchProducts({pageNum,pageSize,searchName,searchType})
        }else{
            result = await reqGetProducts(pageNum,pageSize)
        }
        this.setState({loading:false})
        if(result.status===0){
            const {total,list} = result.data
            this.setState({
                total,
                products:list
            })
        }
    }
    
    /*更新指定商品的状态 */
    updateStatu = async (productId,status)=>{
        const result = await reqUpdateStatus(productId,status)
        if(result.status===0){
            message.success('更新商品成功')
            this.getProducts(this.pageNum,this.pageSize)
        }
    }
    

    UNSAFE_componentWillMount(){
        this.initColumns()
    }
    componentDidMount(){
        this.getProducts(1,5)
    }
    

    render() {
        const {products,total,loading,searchName,searchType } =  this.state
        const title =(
        <span>
            <Select defaultValue={searchType} style={{width:'30%'}} onChange={value =>this.setState({searchType:value})}>
                <Option value='productName'>按名称搜索</Option>
                <Option value='productDesc'>按描述搜索</Option>
            </Select>
            <Input 
                placeholder='关键字' 
                style={{width:'30%',margin:'0 15px'}} 
                value={searchName}
                onChange={e=>this.setState({searchName:e.target.value})}/>
            <Button type='primary' onClick={()=>{this.getProducts(1,5)}}>搜索</Button>
        </span>)

        const extra = (
        <Button type='primary' onClick={()=>this.props.history.push("/product/ProductAddUpdate")}>
            <Icon type='plus'/>
            添加商品
        </Button>)


  
 
        return (
            <Card title={title} extra={extra}>
                <Table 
                bordered 
                loading={loading}
                rowKey='_id' 
                dataSource={products} 
                columns={this.columns}
                pagination={{
                    showSizeChanger:true,
                    total:total,
                    defaultPageSize:5,
                    showQuickJumper:true,
                    onChange:this.getProducts,
                    onShowSizeChange:this.getProducts	}} 
                />
            </Card>
        )
    }
}
