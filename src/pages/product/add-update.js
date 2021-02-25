import React, { Component } from 'react'
import { Icon,Card,Input,Form,Cascader,Button, message } from "antd";
import PicturesWall from "./pictures-wall";
import RichTextEditor from "./rich-text-editor";
import LinkButton from '../../components/Linkbutton';
import { reqCategorys,reqAddUpdateProduct } from "../../api";
import memoryUtils from '../../utils/memoryUtils';
const Item = Form.Item
const {TextArea} = Input



 class ProductAddUpdate extends Component {

    state = {
        options:[],
    };

    constructor(props){
        super(props)

        //创建用来保存ref标识的标签对象的容器
        this.pw = React.createRef()
        this.editor = React.createRef()
    }
    
    initOptions = async (categorys)=>{
        const options = categorys.map(c=>({
            value:c._id,
            label:c.name,
            isLeaf:false
        }))

        //如果是一个二级分类商品的更新
        const {isUpdate,product} = this
        const {pCategoryId} = product
        if(isUpdate && pCategoryId!== '0'){
            //获取二级分类的列表
           const subCategorys = await this.getCategory(pCategoryId)
           //生成二级下拉列表的options
           const childOtions = subCategorys.map(c=>({
                value:c._id,
                label:c.name,
                isLeaf:true
            }))

            //找到当前商品对应的一级option对象
            const targetOption = options.find(option => option.value===pCategoryId)

            //关联到当前option上
            targetOption.children = childOtions
        }


        this.setState({
            options
        })

    }
    getCategory= async (parentId)=>{
        const result = await reqCategorys(parentId)
        if(result.status === 0){
            const categorys = result.data

            if(parentId===0){
                this.initOptions(categorys)
            }else{
                return categorys
            }
           
        }
    }

    componentDidMount(){
        this.getCategory(0)
    }
    UNSAFE_componentWillMount(){
        //this.props.location.state
        const product = memoryUtils.product //如果是添加没值，否则有值
        //保存是否是更新的标识
        this.isUpdate = !!product._id //有值true
        this.product = product || {}
    }
    //卸载之前清楚保存数据
    componentWillUnmount(){
        memoryUtils.product = {}
    }

    
    /*验证价格的自定义验证函数 */
    validateFrice = (rule,value,callback)=>{
        console.log(typeof value);
        if(value*1<=0){
            callback('价格必须大于0')
        }else{
            callback()
        }

    }
    loadData = async selectedOptions => {
        //得到选择的option对象
        const targetOption = selectedOptions[selectedOptions.length - 1];
        //显示loading
        targetOption.loading = true;

        //根据选中的分类，请求获取二级分类列表
        const subCategorys = await this.getCategory(targetOption.value)
        //隐藏loading
        targetOption.loading = false;
        //二级分类数组
        if(subCategorys && subCategorys.length>0){
            const childOtions = subCategorys.map(c=>({
                value:c._id,
                label:c.name,
                isLeaf:true
            }))
            //关联到当前option上
            targetOption.children = childOtions
        }else{
            targetOption.isLeaf = true
        }
        this.setState({
            options: [...this.state.options],
          });
    
      };

    submit=()=>{
        //进行表单验证
        this.props.form.validateFields(async (error,values)=>{
            if(!error){
                //1,收集数据,并封装成product对象
                const {name,price,desc,categoryIds} = values
                let pCategoryId,categoryId
                if(categoryIds.length === 1){
                    pCategoryId = 0
                    categoryId = categoryIds[0]
                }else{
                    pCategoryId = categoryIds[0]
                    categoryId = categoryIds[1]
                }
                const imgs = this.pw.current.getImgs()
                const detail = this.editor.current.getDetail()
                const product = {name,price,desc,imgs,detail,pCategoryId,categoryId}

                if(this.isUpdate){
                    product._id = this.product._id
                }
                //2，调用接口请求函数去添加/更新
                const result = await reqAddUpdateProduct(product)


                //3，根据结果进行提示
                if(result.status===0){
                    message.success(`${this.isUpdate ? '更新':'添加'}商品成功！`)
                    this.props.history.goBack()
                }else{
                    message.error(`${this.isUpdate ? '更新':'添加'}商品成功！`)
                }

                message.success('发送ajax')
                
                console.log('imgs',imgs);
                console.log('detail',detail);

            }
        })

    }

    render() {

        const {isUpdate,product} = this
        const {pCategoryId,categoryId,imgs,detail} = product
        //用来接受级联分类的数组
        const categoryIds = []
        if(isUpdate){
            //商品是一级
            if(pCategoryId === '0'){
                categoryIds.push(categoryId)
            }else{
                categoryIds.push(pCategoryId)
                categoryIds.push(categoryId)
            }

            //商品是二级
        }

        const formItemLayout = {
            labelCol: { span: 3 },
            wrapperCol: { span: 8 },
          };
        const title =( 
        <span>
            <LinkButton onClick={()=>this.props.history.goBack()}>
                <Icon type='arrow-left' style={{fontSize:20}}/>
            </LinkButton>
            <span style={{margin:15}}>{isUpdate ? '修改商品': '添加商品'}</span>
        </span>
        )

        const {getFieldDecorator} = this.props.form
        return (
            <div>
                <Card title={title} >
                    <Form >
                        <Item label='商品名称' {...formItemLayout}>
                            {
                                getFieldDecorator('name',{
                                    initialValue:product.name,
                                    rules:[
                                        {required:true,message:'请输入商品名称'}
                                    ]
                                })(
                                    <Input placeholder='商品名称'/>
                                )
                            }
                        </Item>
                        <Item label='商品描述' {...formItemLayout}>
                            {
                                getFieldDecorator('desc',{
                                    initialValue:product.desc,
                                    rules:[
                                        {required:true,message:'请输入商品描述'}
                                    ]
                                })(
                                    <TextArea placeholder='商品描述' autoSize={{ minRows: 2, maxRows: 5 }}/>
                                )
                            }
                           
                        </Item>
                        <Item label='商品价格' {...formItemLayout}>
                            {
                                getFieldDecorator('price',{
                                    initialValue:product.price,
                                    rules:[
                                        {required:true,message:'请输入商品价格'},
                                        {validator:this.validateFrice}
                                    ]
                                })(
                                    <Input type='number' addonAfter="元" placeholder='商品价格'/>
                                )
                            }
                            
                        </Item>
                        <Item label='商品分类' {...formItemLayout}>
                            {
                                getFieldDecorator('categoryIds',{
                                    initialValue:categoryIds,
                                    rules:[
                                        {required:true,message:'请指定商品分类'},
                                        
                                    ]
                                })(
                                    <Cascader
                                        placeholder='选择分类'
                                        options={this.state.options}
                                        loadData={this.loadData}/>
                                )
                            }
                            
                        </Item>
                        <Item label='商品图片' {...formItemLayout}>
                            <PicturesWall ref={this.pw} imgs={imgs}/>
                        </Item>
                        <Item label='商品详情'  labelCol={{span: 3}} wrapperCol={{span: 19}}>
                            <RichTextEditor ref={this.editor} detail={detail}/>
                        </Item>
                        <Item >
                            <Button type='primary' onClick={this.submit}>提交</Button>
                        </Item>
                    </Form>
                </Card>
            </div>
        )
    }
}

export default Form.create()(ProductAddUpdate)

/*
1. 子组件调用父组件的方法: 将父组件的方法以函数属性的形式传递给子组件, 子组件就可以调用
2. 父组件调用子组件的方法: 在父组件中通过ref得到子组件标签对象(也就是组件对象), 调用其方法
 */

/*
使用ref
1. 创建ref容器: thi.pw = React.createRef()
2. 将ref容器交给需要获取的标签元素: <PictureWall ref={this.pw} />
3. 通过ref容器读取标签元素: this.pw.current
 */