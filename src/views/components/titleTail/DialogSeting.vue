<template>
    <el-dialog
        :title="title"
        :visible.sync="dialogVisible"
        width="740px"
        :append-to-body="true"
        class="dialog-titletail">
        <div class="dt-center">
            <div class="dt-li">
                <div class="dt-label">名称：</div>
                <div class="dt-content">
                    <el-input size="mini" style="width:200px" placeholder="请输入模板名称" v-model="tl_name"></el-input>
                </div>
            </div>
            <div class="dt-li">
                <div class="dt-label">画幅比例：</div>
                <div class="dt-content">
                    <el-select v-model="tl_aspectRatio" size="mini" style="width:200px">
                        <el-option value="16:9">16:9</el-option>
                        <el-option value="9:16">9:16</el-option>
                    </el-select>
                </div>
            </div>
            <div class="dt-li">
                <div class="dt-label">选择片头：</div>
                <div class="dt-content">
                    <div class="dtc-media">
                        <div class="dt-add-btn" v-if="!tl_title" @click="clickTitleHandler">
                            <svg class="icon svg-icon" aria-hidden="true">
                                <use xlink:href="#iconjia"></use>
                            </svg>
                        </div>
                        <div class="dt-dis-box" :class="aspectRatioClass" v-if="tl_title" @mouseover="dtDisMouseOver"  @mouseout="dtDisMouseOut">
                            <div class="dt-btn-group">
                                <div class="dt-mini-btn del" @click="event=>tl_title=null">
                                    <svg class="icon svg-icon" aria-hidden="true">
                                        <use xlink:href="#iconqingkong"></use>
                                    </svg>
                                </div>
                            </div>
                            <div class="dt-dis-thumb" >
                                <img :src="tl_title.KeyFrameUrl"/>
                            </div>
                        </div>
                    </div>
                    <div class="dtc-des">
                        <span class="star">*</span>请尽量选择短小的文件，且幅面和当前比例一致
                    </div>
                </div>
            </div>
            <div class="dt-li">
                <div class="dt-label">选择片尾：</div>
                <div class="dt-content">
                    <div class="dtc-media">
                        <div class="dt-add-btn" v-if="!tl_tail" @click="clickTailHandler">
                            <svg class="icon svg-icon" aria-hidden="true">
                                <use xlink:href="#iconjia"></use>
                            </svg>
                        </div>
                        <div class="dt-dis-box"  :class="aspectRatioClass" v-if="tl_tail" @mouseover="dtDisMouseOver"  @mouseout="dtDisMouseOut">
                            <div class="dt-btn-group">
                                <div class="dt-mini-btn del" @click="event=>tl_tail=null">
                                    <svg class="icon svg-icon" aria-hidden="true">
                                        <use xlink:href="#iconqingkong"></use>
                                    </svg>
                                </div>
                            </div>
                            <div class="dt-dis-thumb">
                                <img :src="tl_tail.KeyFrameUrl"/>
                            </div>
                        </div>
                    </div>
                    <div class="dtc-des">
                        <span class="star">*</span>请尽量选择短小的文件，且幅面和当前比例一致
                    </div>
                </div>
            </div>
            <div class="dt-li">
                <div class="dt-label">选择水印：</div>
                <div class="dt-content">
                    <div class="dtc-media">
                        <div class="dt-dis-box water" :class="aspectRatioClass"  v-for="(item,index) in tl_watermark" :key="index" 
                        @mouseover="dtDisMouseOver" @mouseout="dtDisMouseOut">
                            <div class="dt-btn-group">
                                <div class="dt-mini-btn set" :index="index" @click="setWaterMarkHandler">
                                    <svg t="1592551221840" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3175" width="200" height="200"><path d="M318.155208 695.179253a53.749942 53.749942 0 0 0 76.019919 0l588.529367-588.444368a53.921942 53.921942 0 0 0 0-76.189918l-0.169999-0.17a53.749942 53.749942 0 0 0-75.933919 0.17L318.070208 618.989335a53.921942 53.921942 0 0 0 0 76.189918z" p-id="3176"></path><path d="M970.077508 431.202537h-0.256a53.665942 53.665942 0 0 0-53.664942 53.664942v431.372537H107.844434V107.672884l431.371537 0.17a53.749942 53.749942 0 0 0 53.665942-53.834942v-0.17A53.665942 53.665942 0 0 0 539.131971 0.17H53.752492A53.323943 53.323943 0 0 0 0.08855 53.749942L0.00255 970.418958a53.323943 53.323943 0 0 0 53.664942 53.579942H970.419508a53.409943 53.409943 0 0 0 53.494942-53.750942V484.952479a53.749942 53.749942 0 0 0-53.836942-53.663942z" p-id="3177"></path></svg>
                                </div>
                                <div class="dt-mini-btn del" :index="index" @click="delWaterMarkHandler">
                                    <svg class="icon svg-icon" aria-hidden="true">
                                        <use xlink:href="#iconqingkong"></use>
                                    </svg>
                                </div>
                            </div>
                            <div class="dt-dis-thumb" >
                                
                                <img :src="item.KeyFrameUrl"
                                :style="{
                                    left:item.Pos.x*100+'%',
                                    top:item.Pos.y*100+'%',
                                    width:item.Pos.width*100+'%',
                                    height:item.Pos.height*100+'%',
                                }"/>
                            </div>
                        </div>
                        <div class="dt-add-btn" @click="clickWaterMarkHandler">
                            <svg class="icon svg-icon" aria-hidden="true">
                                <use xlink:href="#iconjia"></use>
                            </svg>
                        </div>
                    </div>
                    <div class="dtc-des">
                        <span class="star">*</span>可选择多个水印，图片格式为JPG，PNG
                    </div>
                </div>
            </div>
        </div>
        <div class="dt-footer">
            <el-button type="primary" size="small" @click="onCancelHandler">取消</el-button>
            <el-button type="primary" size="small" @click="onOkHandler">确定</el-button>
        </div>

        <DialogSelectSource ref="selectSource"/>
        <DialogChangePos ref="changePos"/>
    </el-dialog>
</template>

<script>
import DialogSelectSource from '../DialogSelectSource';
import DialogChangePos from './DialogChangePos';
import Utils from '../../../libs/Utils';
export default {
    name:'dialog-titletail',
    components:{DialogSelectSource,DialogChangePos},
    props:{
        // title:{
        //     type:String,
        //     default:''
        // }
    },
    data(){
        return {
            isCreate:true,
            title:'编辑片头片尾模板',
            dialogVisible:false,
            callback:null,
            tl_id:'',
            tl_name:'',
            tl_aspectRatio:'16:9',
            tl_title:null,
            tl_tail:null,
            tl_watermark:[]
        }
    },
    computed:{
        aspectRatioClass(){
            if(this.tl_aspectRatio=='9:16'){
                return 'ar916';
            }
            return '';
        }
    },
    methods:{
        show(options,callback){
            this.dialogVisible = true;
            this.isCreate = !!options.isCreate;
            if(this.isCreate){
                this.title = '新建片头片尾模板';
                this.tl_title = null;
                this.tl_tail = null;
                this.tl_watermark = [];
                this.tl_id = '';
                this.tl_name = '';
                this.tl_aspectRatio = '16:9';
            }else{
                this.title = '编辑片头片尾模板';
                this.tl_id = options.info.templateId;
                this.tl_name = options.info.templateName;
                this.tl_aspectRatio = options.info.aspectRatio;
                const tlData = JSON.parse(options.info.templateData);
                this.tl_watermark = [];
                for(let i=0;i<tlData.TitleTail.length;i++){
                    let item = tlData.TitleTail[i];
                    if(item.ClipType == 'Title_Video'){
                        this.tl_title = item;
                    }else if(item.ClipType == 'Tail_Video'){
                        this.tl_tail = item;
                    }else if(item.ClipType == 'WaterMark_Image'){
                        this.tl_watermark.push(item);
                    }
                }
            }
            this.callback = callback;
        },
        onCancelHandler(){
            this.dialogVisible = false;
        },
        onOkHandler(){
            if(this.tl_name == ''){
                this.$alert('请输入模板名称', '提示', {
					confirmButtonText: '确定'
                });
                return;
            }
            if(!this.title && !this.tl_tail && this.tl_watermark.length == 0){
                this.$alert('请选择模板内容', '提示', {
					confirmButtonText: '确定'
                });
                return;
            }
            let tlData = {
                templateId:this.tl_id,
                templateName: this.tl_name,
                aspectRatio: this.tl_aspectRatio,
                templateData:""
            }
            let obj = {
                TitleTail:[]
            }
            if(this.tl_title){
                obj.TitleTail.push(this.tl_title);
            }
            if(this.tl_tail){
                obj.TitleTail.push(this.tl_tail);
            }
            obj.TitleTail = obj.TitleTail.concat(this.tl_watermark);
            console.log('obj',obj)
            tlData.templateData = JSON.stringify(obj);
            this.$store.dispatch('tl_saveTitleTail',tlData).then( data=>{
                console.log('dddd',data);
                this.$store.dispatch('tl_loadTitleTailList');
                this.dialogVisible = false;
            }).catch(err=>{
                this.$message.error('保存/新建片头片尾失败');
            })
            // this.dialogVisible = false;
            // if(this.callback){
            //     this.callback();
            // }
        },
        clickTitleHandler(){
            this.$refs.selectSource.show({
                    enabledType:'video',
                    enabledRadio:true,
                    isClearChecked:true
                },(arr)=>{
                    let media = arr[0];
                    this.tl_title = {
                        ClipId: media.contentId,
                        ClipType:"Title_Video",
                        Duration: parseInt(media.duration),
                        Width:parseInt(media.width),
                        Height:parseInt(media.height),
                        KeyFrameUrl: media.cover,
                        PreviewUrl: media.preUrl,
                        HighPath: media.path
                    }
                    // this.tl_title = {
                    //     "ClipId":"5ECF2643B0A44A39B35000A20A2A9F8B",
                    //     "ClipType":"Title_Video",
                    //     "Duration":10027,
                    //     "Width":1280,
                    //     "Height":720,
                    //     "KeyFrameUrl":"http://172.29.3.98:8000/media/image/video_title.mp4_20200618_182234242.jpg",
                    //     "PreviewUrl":"http://172.29.3.98:8000/media/video/video_title.mp4",
                    //     "HighPath":"X:/xcontent/vod/default/cpu/video/20200528/5ECF2643C9C044FD971000A10A2A9F8B.mp4"
                    // }
                   
            });
        },
        clickTailHandler(){
            this.$refs.selectSource.show({
                    enabledType:'video',
                    enabledRadio:true,
                    isClearChecked:true
                },(arr)=>{
                    let media = arr[0];
                    this.tl_tail = {
                        ClipId: media.contentId,
                        ClipType:"Tail_Video",
                        Duration: parseInt(media.duration),
                        Width:parseInt(media.width),
                        Height:parseInt(media.height),
                        KeyFrameUrl: media.cover,
                        PreviewUrl: media.preUrl,
                        HighPath: media.path,
                    }
                    // this.tl_tail = {
                    //     "ClipId":"5ECF2643B0A44A39B35000A20A2A9F8B",
                    //     "ClipType":"Tail_Video",
                    //     "Duration":4054,
                    //     "Width":1080,
                    //     "Height":1920,
                    //     "KeyFrameUrl":"http://172.29.3.98:8000/media/image/video_tail.mp4_20200618_182305046.jpg",
                    //     "PreviewUrl":"http://172.29.3.98:8000/media/video/video_tail.mp4",
                    //     "HighPath":"X:/xcontent/vod/default/cpu/video/20200528/5ECF2643C9C044FD971000A10A2A9F8B.mp4"
                    // }
            });
        },
        clickWaterMarkHandler(){
            this.$refs.selectSource.show({
                    enabledType:'image',
                    enabledRadio:true,
                    isClearChecked:true
                },(arr)=>{
                    console.log('clickWaterMarkHandler',arr)
                    let setObj = null;
                    for(let i=0;i<arr.length;i++){
                        let media = arr[i];
                        let obj = {
                            ClipId: media.contentId,
                            ClipType:"WaterMark_Image",
                            Width:parseInt(media.width),
                            Height:parseInt(media.height),
                            KeyFrameUrl: media.cover,
                            PreviewUrl: media.preUrl,
                            HighPath: media.path,
                            Pos:{
                                x:0,
                                y:0,
                                width:1,
                                height:1
                            }
                        }
                        
                        this.tl_watermark.push(obj);
                        if(!setObj) setObj = obj;
                    }
                    // setObj = {
                    //     "ClipId":"5EE82DAD94B84CE7A00B00A90A2A9F8B",
                    //     "ClipType":"WaterMark_Image",
                    //     "Width":1366,
                    //     "Height":768,
                    //     "KeyFrameUrl":"https://nginx1.xctdev.chinamcloud.cn/xcontent/vod/default/cpu/image/20200616/5EE82DAD94B84CE7A00B00A90A2A9F8B.jpg",
                    //     "PreviewUrl":"https://nginx1.xctdev.chinamcloud.cn/xcontent/vod/default/cpu/image/20200616/5EE82DAD94B84CE7A00B00A90A2A9F8B.jpg",
                    //     "HighPath":"X:/xcontent/vod/default/cpu/image/20200616/5EE82DAD94B84CE7A00B00A90A2A9F8B.jpg",
                    //     "Pos":{
                    //         "x":0.2,
                    //         "y":0.3,
                    //         "width":0.3,
                    //         "height":0.2
                    //     }
                    // }
                    // this.tl_watermark.push(setObj)
                    if(setObj){
                        if(setObj.Width == 0 || setObj.Height == 0){
                            Utils.getMediaInfoOfUrl(setObj.PreviewUrl).then((data)=>{
                                if(data){
                                    setObj.Width = data.info.width;
                                    setObj.Height = data.info.height;
                                    console.log('开始启用设置窗口222',setObj)
                                    this.openChangePos(setObj);
                                }
                            }).catch(error=>{

                            })
                        }else{
                            console.log('开始启用设置窗口',setObj)
                            this.openChangePos(setObj);
                        }
                        
                    }
            });
        },
        dtDisMouseOver(event){
            event.stopPropagation();
            let groupdom = event.currentTarget.querySelector('.dt-btn-group');
            if(groupdom){
                groupdom.style.opacity = 1;
            }
        },
        dtDisMouseOut(event){
            event.stopPropagation();
            let groupdom = event.currentTarget.querySelector('.dt-btn-group');
            if(groupdom){
                groupdom.style.opacity = 0;
            }
        },
        delWaterMarkHandler(event){
            let index = parseInt(event.currentTarget.getAttribute('index'));
            this.tl_watermark.splice(index,1);
        },
        setWaterMarkHandler(event){
            // let index = parseInt(event.currentTarget.getAttribute('index'));
            // this.tl_watermark.splice(index,1);
            let index = parseInt(event.currentTarget.getAttribute('index'));
            let info = this.tl_watermark[index];
            this.openChangePos(info);
        },
        openChangePos(info){
            this.$refs.changePos.show({
                info:info,
                aspectRatio:this.tl_aspectRatio
            },(pos)=>{
                info.Pos = pos;
                    // console.log('setWaterMarkHandler',arr)
                    // this.tl_watermark.push(...arr);
            });
        }
    }
}
</script>

<style lang="scss" scoped>
.dialog-titletail{
    ::v-deep .el-dialog__header{
        border-bottom: 1px solid #eeeeee;
    }

    .dt-center{
        width: 100%;
        height: 515px;
        overflow: auto;

        .dt-li{
            width: 100%;
            display: flex;
            margin-bottom: 10px;

            .dt-label{
                width: 100px;
                text-align: right;
            }

            .dt-content{
                flex: 1;
                display: flex;
                margin-left: 15px;

                .dtc-media{
                    width: 160px;
                    margin-right: 15px;
                }

                .dtc-des{
                    flex: 1;
                }
            }

            .dt-add-btn{
                width: 160px;
                height: 90px;
                background-color: #eeeeee;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 36px;
                color: #cccccc;
                cursor: pointer;
                margin-bottom: 10px;
            }
            .star{
                color: #ff0000;
                margin: 0 5px;
            }

            .dt-dis-box{
                width: 160px;
                height: 90px;
                position: relative;
                display: flex;
                justify-content: center;
                align-items: center;
                // border: 1px solid #eeeeee;
                box-shadow: 0px 0px 1px 1px #dedede;
                background-color: #eeeeee;
                margin-bottom: 10px;
            }

            .dt-btn-group{
                width: 100%;
                height: 30px;
                // background-color: #ff000022;
                position: absolute;
                top: 0px;
                z-index: 4;
                display: flex;
                justify-content: flex-end;
                align-items: center;
                transition: all 0.2s;
                opacity: 0;

                .dt-mini-btn{
                    width: 20px;
                    height: 20px;
                    cursor: pointer;
                    color: #ffffff;
                    background: rgba(0,0,0,0.4);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin-right: 5px;

                    &:hover{
                        color: #cfcfcf;
                    }
                }
            }

            .dt-dis-thumb{
                width: 160px;
                height: 90px;
                position: relative;
                display: flex;
                justify-content: center;
                align-items: center;
                background: #eee;
                background-image: linear-gradient(45deg,rgba(0,0,0,.25) 25%,transparent 0,transparent 75%,rgba(0,0,0,.25) 0),linear-gradient(45deg,rgba(0,0,0,.25) 25%,transparent 0,transparent 75%,rgba(0,0,0,.25) 0);
                background-size: 16px 16px;
                background-position: 0 0,24px 24px;

                img{
                    max-width: 100%;
                    max-height: 100%;
                }
            }

            .dt-dis-box.ar916{
                .dt-dis-thumb{
                    width: 50.625px;
                }
                
            }

            .dt-dis-box.water{
                img{
                    position: absolute;
                }
            }
        }
    }

    .dt-footer{
        width: 100%;
        height: 40px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        padding: 0px 20px;

        >*{
            margin-left: 20px;
        }
    }
}
@media screen and (max-width: 1600px) {
    .dialog-titletail{
        ::v-deep .el-dialog{
            margin-top: 1vh !important;
        }

        .dt-center{
            height: 450px;
        }
    }
}
</style>