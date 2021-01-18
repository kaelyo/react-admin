

import React ,{Component} from 'react'
import { Button,message } from "antd";
import './App.less';



/*应用根组件 */
export default class App extends Component{
    alertM=()=>{
        message.success('你是憨憨')
    }

    render(){
        return(<div>
             <Button type="primary" onClick={this.alertM}>Primary Button</Button>
        </div>) 
    }
}