import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Upload,Modal, Icon, message } from "antd";
import { reqDeleteImg } from "../../api";
import { BASE_IMG_URL } from "../../utils/constants";

export default class PicturesWall extends Component {

    static propTypes = {
      imgs:PropTypes.array
    }

    // state = {
    //     previewVisible: false,//标识是否显示大图预览
    //     previewImage: '',//大图的url
    //     fileList: [
    //     //   {
    //     //     uid: '-1', //每个file都有自己唯一的id
    //     //     name: 'image.png',
    //     //     status: 'done', //图片状态：done-已上传 uploading 正在上传 ，remove：已删除
    //     //     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    //     //   },
    //     //   {
    //     //     uid: '-5',
    //     //     name: 'image.png',
    //     //     status: 'error',
    //     //   },
    //     ],
    // };

    constructor(props){
      super(props)
      let fileList = []

      const {imgs} = this.props
      if(imgs && imgs.length>0){
        fileList = imgs.map((img,index)=> ({
            uid: -index,
            name:img,
            status:'done',
            url:BASE_IMG_URL+img
        }))
      }
      this.state={
        previewVisible: false,//标识是否显示大图预览
        previewImage: '',//大图的url
        fileList
      }

    }

    
    handleCancel = () => this.setState({ previewVisible: false });
    
    handlePreview = async file => {
        if (!file.url && !file.preview) {
          file.preview = await PicturesWall(file.originFileObj);
        }
    
        this.setState({
          previewImage: file.url || file.preview,
          previewVisible: true,
        });
    };
    
    /*
        file：当前操作的图片文件(上传/删除)
        fileList:所有已上传图片文件对象的数组
    */
    handleChange = async ({file, fileList }) => {
        console.log('handleChange',file.status,fileList);

        //一旦上传成功。将当前上传的file的信息修正(name,url)
        if(file.status === 'done'){
            const result = file.response //{status:0,data:{name:'xxx.jpg',url:'图片地址'}}
            if(result.status === 0){
                message.success('图片上传成功')
                const {name,url} = result.data
                const file = fileList[fileList.length-1]
                file.name = name
                file.url = url
            } else{
                message.error('图片上传失败')
            }
        } else if(file.status === 'removed'){
            const result =  await reqDeleteImg(file.name)
            if(result.status === 0){
              message.success('删除图片成功！')
            }else{
              message.error('图片删除失败！')
            }
        }

        this.setState({ fileList })
    };

    /*获取所有已上传图片文件名的数组 */
    getImgs = ()=>{
        return this.state.fileList.map(file => file.name)
    }
    
    render() {
        const { previewVisible, previewImage, fileList } = this.state;
        const uploadButton = (
          <div>
            <Icon type="plus" />
            <div className="ant-upload-text">上传图片</div>
          </div>
        );
        return (
          <div >
            <Upload
              action="/manage/img/upload"
              accept='image/*'  /*只接受图片格式 */
              listType="picture-card"
              fileList={fileList} /*卡片样式 */
              name='image' /*请求参数名 */
              onPreview={this.handlePreview}
              onChange={this.handleChange}
            >
              {fileList.length >= 3 ? null : uploadButton}
            </Upload>
            <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
              <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
          </div>
        );
    }
}