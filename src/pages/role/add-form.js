import React, { Component } from 'react'
import { Form,Input } from "antd";
import PropTypes from "prop-types";



const Item = Form.Item

/*添加表单组件 */
 class AddForm extends Component {
    static propTypes = {
        setForm: PropTypes.func.isRequired
    }

    UNSAFE_componentWillMount(){
        this.props.setForm(this.props.form)
    }

            
    render() {

        // 得到更强大功能的form对象
        const { getFieldDecorator } = this.props.form;

        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 18},
          };
        return (
            <Form>
                <Item label='角色名称' {...formItemLayout}>
                    {
                        getFieldDecorator('roleName',{
                            initialValue : '',
                            rules: [
                                {required: true, message: '角色名称必须输入'}
                            ]
                        })(
                            <Input  placeholder='请输入角色名称'/>
                        )
                    }
                    
                </Item>
            </Form>
        )
    }
}
export default Form.create()(AddForm)