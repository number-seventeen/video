import MD5 from 'js-md5';
class UploadSource{
    constructor(config){
        this.config = Object.assign({
            accept: "image/png,image/jpeg,image/gif,video/mp4",
            limitSize: 100
        },config);
        this.inputfile = document.createElement('input');
        this.inputfile.type = 'file';
        this.inputfile.accept = this.config.accept;
        // this.inputfile.webkitdirectory = true;

        this.inputfile.addEventListener('change',this.selectSourceBack.bind(this));

        // LoadingProgress
    }

    /**开始上传 */
    startUpload(callback){
        // this.value = '';
        this.callback = callback;
        this.inputfile.value = '';
        // document.body.appendChild(this.MainRoot);
        this.inputfile.click();

    }

    /** 文件选择完成返回 */
    selectSourceBack (event) {
        let files = event.target.files;
        if(files.length>0){
            // console.log(files[0])
            let file = files[0];
            let limitSize = this.config.limitSize*1024*1024;
            if(file.size > limitSize){
                alert('不能上传大于'+this.config.limitSize+'M的文件！');
                // document.body.removeChild(this.MainRoot);
                // this.root.hide();
                return;
            }
            this.startPost(file);
        }
    }

    /** 开始上传*/
    startPost(file){
        if(this.callback){
            this.callback({cmd:'start',data:null})
        }
        let self = this;

        console.log(file);
        let str = MD5(file.name+file.lastModified+file.size);
        if(file.type == 'video/mp4'){
            this.callback({cmd:'mediaFile',data:file})
        }
        console.log('fileMd5',str)
        return;
        let formData = new FormData();
        // let file = new File([_blob],'画板图片.png',{type:'image/png'})
        // console.log(file);
        formData.append('file', file);

        let url = 'Configuration.interface.uploadSTUrl';
        if(url === ''){
            // document.body.removeChild(this.MainRoot);
            if(this.callback){
                this.callback({cmd:'end',data:null})
            }
            return;
        }
        // url += Utils.objectToURLParam(Configuration.interface.upLoadImgParam,true,'queryParam');
        let xhr = new XMLHttpRequest();
        xhr.open('POST', url, true);
        // xhr.setRequestHeader("Accept-Encoding", "gzip, deflate");
        // xhr.setRequestHeader("Content-Type","multipart/form-data;");
        // xhr.setRequestHeader("Content-Type","multipart/form-data;boundary=----WebKitFormBoundaryR3jrzTlX5ycOyYN5");
        xhr.responseType = 'json';
        
        xhr.upload.onprogress = function(evt){
            if(self.callback){
                self.callback({cmd:'progress',data:evt.loaded / evt.total})
            }
        }
        xhr.onerror = function(error){
            console.log('上传出错',error)
            if(self.callback){
                self.callback({cmd:'error',data:error})
            }
        }
        xhr.onabort = function(evt){
            console.log('上传被取消或断开',evt)
            if(self.callback){
                self.callback({cmd:'abort',data:evt})
            }
        }
        xhr.onload = function () {
            if(xhr.readyState === 4){
                if((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304){
                    console.log('上传完成', xhr.response)
                    // imgUploadProgress.style.width = '0%';
                    // imgmsg.isUploaded = true;
                    // imgmsg.sourceUrl = xhr.response.returnData || xhr.response.data;
                    // recordImgUpload[file.lastModified+file.name] = imgmsg;
                    // self.startEditImg(imgmsg);
                    if(self.callback){
                        self.callback({cmd:'success',data:xhr.response})
                    }
                }else{
                    console.log('上传完成出错', xhr.response)
                    // Toast.show('上传出错！');
                }
                if(self.callback){
                    self.callback({cmd:'end',data:null})
                }
            }
        }
        xhr.send(formData);
    }
}

export default UploadSource;