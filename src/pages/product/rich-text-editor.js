import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import {BASE_IMG_URL} from "../../utils/constants";

export default class RichTextEditor extends Component {

    static propTypes = {
        detail:PropTypes.string
    }
    constructor(props) {
        super(props);
        const html = this.props.detail;
        if(html){
            const contentBlock = htmlToDraft(html);
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            const editorState = EditorState.createWithContent(contentState);
            this.state = {
                editorState,
            };
        }else{
            this.state = {
                editorState:EditorState.createEmpty(),
            };
        }
        
    }

    // state = {
    //     editorState: EditorState.createEmpty(),//创建一个没有内容的编辑对象
    // }
    
    /*输入过程中实时的回调 */
    onEditorStateChange = (editorState) => {
        this.setState({
          editorState,
        });
    };

    getDetail = () => {
        //返回输入数据对应的html对应的格式
        return draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
    }
    uploadImageCallBack = (file)=> {
        return new Promise(
          (resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', '/manage/img/upload');
            xhr.setRequestHeader('Authorization', 'Client-ID XXXXX');
            const data = new FormData();
            data.append('image', file);
            xhr.send(data);
            xhr.addEventListener('load', () => {
              const response = JSON.parse(xhr.responseText);
              const name = response.data.name  //得到图片的url

              resolve({data:{link:BASE_IMG_URL+name}});
            });
            xhr.addEventListener('error', () => {
              const error = JSON.parse(xhr.responseText);
              reject(error);
            });
          }
        );
      }
    
    render() {
        const { editorState } = this.state;
        return (
          <div>
            <Editor
              editorState={editorState}
              editorStyle={{border:'1px solid black',minHeight:200,paddingLeft:10}}
              
              onEditorStateChange={this.onEditorStateChange}
              toolbar={{
                inline: { inDropdown: true },
                list: { inDropdown: true },
                textAlign: { inDropdown: true },
                link: { inDropdown: true },
                history: { inDropdown: true },
                image: { uploadCallback: this.uploadImageCallBack, alt: { present: true, mandatory: true } },
              }}
            />
            {/* <textarea
              disabled
              value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
            /> */}
          </div>
        );
    }
}
