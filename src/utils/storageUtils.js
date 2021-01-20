/*
进行Local数据存储管理的工具模块
原生不太兼容 建议用store
*/
import store from 'store';

const USER_KEY = 'user_key'
export default {
    /*保存user */
    saveUser(user){
        //localStorage.setItem(USER_KEY,JSON.stringify(user))
        store.set(USER_KEY,user)
    },

    /*读取user */
    getUser(){
       //return Json.parse(localStorage.getItem(USER_KEY) || '{}')
       return store.get(USER_KEY)||{}
    },

    /*删除user */
    removeUser(){
        //localStorage.removeItem(USER_KEY)
         store.remove(USER_KEY)
    }

}
// export  const saveUser =(user)=>{
//     store.set(USER_KEY,user)
// }

// export  const getUser =()=>{
//     return store.get(USER_KEY)||{}
// }

// export  const removeUser =(user)=>{
//      store.remove(USER_KEY)
// }

// export {
//     saveUser,removeUser,getUser
// }

