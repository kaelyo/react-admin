/*
包含应用中所有接口请求函数的模块
*/
/*
 export default{
    xxx (){

    },
    xxxx (){

    }
}

export function xx(){

}
 */

 import { message } from 'antd';
import jsonp from 'jsonp'; 
import ajax from "./ajax";

 //登录
 /* 
 export function reqLogin(){
     ajax('/login',{username,password},'POST')
 }
 */
export const reqLogin = (username,password)=>{
   return ajax('/login',{username,password},'POST')
}

//添加用户
export const reqAddUser = (user)=>{
    return  ajax('/addUser',user,'POST')
}
//获取一级/二级分类的列表
export const reqCategorys = (parentId)=>{
    return ajax('/manage/category/list',{parentId})
}

//添加分类
export const reqAddCategory = (categoryName,parentId)=>{
    return ajax('/manage/category/add',{categoryName,parentId},'POST')
}

//更新分类
export const reqUpdateCategory = ({categoryId,categoryName})=>{
    return ajax('/manage/category/update',{categoryId,categoryName},'POST')
}


/*
    jsonp 请求的接口请求函数
 */
export const reqWeather =()=>{

    return new Promise((resolve,reject)=>{
        const url = `http://www.tianqiapi.com/api?version=v9&appid=71146168&appsecret=QCgMtS8C`
    
        //发送jsoup请求
        jsonp(url,{},(err,data)=>{
            //console.log('jsonp',err,data);
            //成功
            if(!err && data.cityid){
                const city = data.city
                const {wea,wea_img} = data.data[0]
                console.log('数据',city,wea,wea_img);
                resolve({wea_img,wea,city})
            }else{
                message.error('获取天气信息失败！')
            }
        })
    })
    
}
reqWeather()