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