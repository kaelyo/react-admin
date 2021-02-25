import React, { Component } from 'react'
import { Switch,Route,Redirect } from "react-router-dom";
import ProductHome from './home'
import ProductAddUpdate from './add-update'
import ProductDetail from './detail'
import './index.less'

export default class Product extends Component {
    render() {
        return (
            
            <Switch>
                <Route path='/product' component={ProductHome} exact/>
                <Route path='/product/productdetail' component={ProductDetail} />
                <Route path='/product/ProductAddUpdate' component={ProductAddUpdate} />
                <Redirect to='/product'/>
            </Switch>
            
        )
    }
}
