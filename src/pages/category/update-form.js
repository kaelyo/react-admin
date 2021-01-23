import React, { Component } from 'react'
import { Form,Input } from "antd";
import PropTypes from "prop-types";

const Item = Form.Item


/*添加分类表单组件 */
 class UpdateForm extends Component {

    static propTypes = {
        categoryName:PropTypes.string.isRequired,
        setForm: PropTypes.func.isRequired
    }

    UNSAFE_componentWillMount(){
        this.props.setForm(this.props.form)
    }
            
    render() {
        
        const {categoryName} = this.props 

        // 得到更强大功能的form对象
        const { getFieldDecorator } = this.props.form;

        return (
            <Form>
                <Item>
                    {
                        getFieldDecorator('categoryName',{
                            initialValue : categoryName,
                            rules: [
                                {required: true, message: '分类名称必须输入'}
                            ]
                        })(
                            <Input  placeholder='请输入分类名称'/>
                        )
                    }
                    
                </Item>
            </Form>
        )
    }
}
export default Form.create()(UpdateForm)