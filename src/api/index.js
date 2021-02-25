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

//获取商品
export const reqGetProducts = (pageNum,pageSize)=>{
    return ajax('/manage/product/list',{pageNum,pageSize})
}

//获取按描述/名称搜索商品
export const reqSearchProducts = ({pageNum,pageSize,searchName,searchType})=>{
    return ajax('/manage/product/search',{
        pageNum,
        pageSize,
        [searchType]:searchName
    })
}

/*根据分类ID查分类 */
export const reqGetCategoryById = (categoryId)=>{
    return ajax('/manage/category/info',{categoryId})
}

/*更新商品的状态(上架/下架) */
export const  reqUpdateStatus = (productId,status)=>{
    return ajax('/manage/product/updateStatus',{productId,status},'POST')
}


/*删除商品图片 */
export const  reqDeleteImg = (name)=>{
    return ajax('/manage/img/delete',{name},'POST')
}



/*添加/更新商品 */
export const  reqAddUpdateProduct = (product)=>{
    //return ajax('/manage/product/update',{product},'POST')
    return ajax('/manage/product/'+(product._id?'update':'add'),product,'POST')
}

/*获取角色的列表 */
export const  reqRoles = ()=>{
    return ajax('/manage/role/list')
}

/*添加角色 */
export const  reqAddRole = (roleName)=>{
    return ajax('/manage/role/add',{roleName},'POST')
}

/*更新角色权限 */
export const  reqUpdateRole = (role)=>{
    return ajax('/manage/role/update',role,'POST')
}

// 获取所有用户的列表
export const reqUsers = () => ajax( '/manage/user/list')
// 删除指定用户
export const reqDeleteUser = (userId) => ajax( '/manage/user/delete', {userId}, 'POST')
// 添加/更新用户
export const reqAddOrUpdateUser = (user) => ajax( '/manage/user/'+(user._id ? 'update' : 'add'), user, 'POST')

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