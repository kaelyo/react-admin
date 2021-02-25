import React, { Component } from 'react'
import { Card,Icon,List } from "antd";
import LinkButton from "../../components/Linkbutton";
import {BASE_IMG_URL} from '../../utils/constants'
import { reqGetCategoryById } from "../../api";
import memoryUtils from '../../utils/memoryUtils';
const Item = List.Item

export default class ProductDetail extends Component {

    state={
        cName1:'',
        cName2:''
    }
    async componentDidMount(){
        //this.props.location.state.product
        const {pCategoryId,categoryId} = memoryUtils.product
        if(pCategoryId==='0'){
            const result = await reqGetCategoryById(categoryId)
            const cName1 =/* result.data.name */ (result.data || {} ).name
            this.setState({cName1})
        }else{
            /*
            //通过多个await方式发多个请求：后面一个请求是在前一个请求成功之后才发送
            const result1 = await reqGetCategoryById(pCategoryId)
            const result2 = await reqGetCategoryById(categoryId)
            const cName1 = result1.data.name
            const cName2 = result2.data.name 
            */

            //一次性发送多个请求。只有都成功，才正常处理
            const result = await Promise.all([reqGetCategoryById(pCategoryId),reqGetCategoryById(categoryId)])
            const cName1 = result[0].data.name 
            const cName2 = result[1].data.name 
            this.setState({
                cName1,
                cName2
            })
        }
    }
    
    //卸载之前清楚保存数据
    componentWillUnmount(){
        memoryUtils.product = {}
    }
    


    render() {
        const {cName1,cName2} = this.state
        // this.props.location.state.product
        const {name,desc,price,detail,imgs} = memoryUtils.product
        const title=(
            <span>
                <LinkButton>
                    <Icon 
                    type='arrow-left' 
                    style={{color:'#2185D0',marginRight:20}}
                    onClick={() => this.props.history.goBack()}/>
                </LinkButton>
                <span>商品详情</span>
            </span>
        )
        return (
            <Card title={title} className='product-detail'>
                <List>
                    <Item style={{display: 'block'}}>
                        <span className='left'>商品名称:</span>
                        <span>{name}</span>
                    </Item>
                    <Item style={{display: 'block'}}>
                        <span className='left'>商品描述:</span>
                        <span >{desc}</span>
                    </Item>
                    <Item style={{display: 'block'}}>
                        <span className='left'>商品价格:</span>
                        <span >{price}</span>
                    </Item>
                    <Item style={{display: 'block'}}>
                        <span className='left'>所属分类:</span>
                        <span >{cName1} {cName2 ? ' -->'+cName2:''} </span>
                    </Item>
                    <Item style={{display: 'block'}}>
                        <span className='left'>商品图片:</span>
                        <span >
                            {imgs.map(img=>(
                                <img
                                    key={img}
                                    className='product-img'
                                    src={BASE_IMG_URL+img}
                                    alt='img'/>
                            ))}
                            {/* <img className='product-img' src='http://v.bootstrapmb.com/2020/4/a8em7795/img/main_photo.jpg' alt='商品图片'/>
                            <img className='product-img' src='http://v.bootstrapmb.com/2020/4/a8em7795/img/main_photo.jpg' alt='商品图片'/> */}
                        </span>
                    </Item>
                    <Item style={{display: 'block'}}>
                        <span className='left'>商品详情:</span>
                        <span dangerouslySetInnerHTML={{__html: detail}}></span>
                    </Item>
                </List>
            </Card>
        )
    }
}
