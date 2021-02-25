

import React ,{Component} from 'react'


import './App.css';
import { HashRouter,Route, Switch } from "react-router-dom";

import Login from './pages/login'
import Admin from './pages/admin'




/*应用根组件 */
export default class App extends Component{
    

    render(){
        return(
            
             <HashRouter>
                <Switch>    {/* 只匹配其中一个 */}
                    {/* path="/login"  斜杠不能删  也不能加. */}
                    <Route path="/login" component={Login}></Route>
                    <Route path="/" component={Admin}></Route>
                </Switch>
             </HashRouter>
        ) 
    }
}