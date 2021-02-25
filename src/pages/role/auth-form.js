import React, { Component } from 'react'
import { Form,Input,Tree } from "antd";
import PropTypes from "prop-types";
import menuList from "../../config/menuConfig";

const { TreeNode } = Tree;
const Item = Form.Item

/*添加表单组件 */
export default class AuthForm extends Component {

    

    constructor(props){
        super(props)
        const {menus} = this.props.role
        this.state={
            checkedKeys:menus
        }
    }

    static propTypes = {
        role: PropTypes.object.isRequired
    }
    UNSAFE_componentWillMount(){
        this.treeNodes= this.getTreeNodes(menuList)
    }

    getTreeNodes=(menuList)=>{
        return menuList.reduce((pre,item)=>{
            pre.push(
                <TreeNode title={item.title} key={item.key}>
                    {item.children ? this.getTreeNodes(item.children):null}
                </TreeNode>
            )
            return pre
        },[])
    }

    //选中某个node时的回调
    onCheck=(checkedKeys)=>{
        this.setState({checkedKeys})
    }

    /**
     * 为父组件提供最新数据
     */
    getMenus = ()=> this.state.checkedKeys
    

    //根据新传入的role来更新checkedKeys 状态
    /*
        当组件接受到新的属性时自动调用
    */
    UNSAFE_componentWillReceiveProps(nextProps){
        const menus = nextProps.role.menus
        this.setState({
            checkedKeys:menus
        })
    }
            
    render() {

        
        const { role } = this.props;
        const {checkedKeys} =  this.state

        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 18},
          };
        return (
            <Form>
                <Item label='角色名称' {...formItemLayout}>
                    
                    <Input value={role.name} disabled  placeholder='请输入角色名称'/>
                    
                </Item>
                <Tree
                    checkable
                    defaultExpandAll={true}
                    checkedKeys={checkedKeys}
                    onCheck={this.onCheck}
                >
                    <TreeNode title="平台权限" key="all">
                        {this.treeNodes}
                    </TreeNode>
                </Tree>
            </Form>
        )
    }
}
