<template>
    <div class="am-tt-item" :class="{selected:info.isSelected}" @click="radioClickHandler" @dblclick="radioClickHandler2">
        <div class="ati-col col1">
            <div class="ati-radio" >
                <div class="ati-radio-show">
                </div>
            </div>
        </div>
        <div class="ati-col col2">
            <div class="ati-title">
                {{info.templateName}}
            </div>
            <div class="ati-aspect-ratio">
                {{info.aspectRatio}}
            </div>
        </div>
        <div class="ati-col col3">
            <div class="ati-tt-item" :class="aspectRatioClass" v-for="(item,index) in showDataList" :key="index" @click="itemClickHandler(item,$event)">
                <div class="ati-type-name">{{item.typeName}}</div>
                <div class="tt-content">
                    <img v-for="(item2,index2) in item.keyFrameUrls" :key="index2" :src="item2.url" :style="item2.pos"/>
                    <!-- <img :src="item.KeyFrameUrl" :style="imgPosStyle(item)"/> -->
                </div>
            </div>
        </div>
        <div class="ati-col col4" :class="{canEdit:!canEdit}">
            <el-button type="primary" size="mini" @click="previewHandler">预览</el-button>
            <el-button  size="mini"  @click="topHandler">置顶</el-button>
            <el-button  size="mini"  v-if="canEdit" @click="editHandler">编辑</el-button>
            <el-button  size="mini"  v-if="canEdit" @click="deleteHandler">删除</el-button>
            
        </div>

        <DialogSeting ref="createWindow" />
        <DialogPreview ref="previewWindow" />
        <DialogVideoPreview ref="videoPreview"/>
    </div>
</template>
<script>
import DialogSeting from './DialogSeting';
import DialogPreview from './DialogPreview';
import DialogVideoPreview from '../DialogVideoPreview';
export default {
    name:'am-tt-item',
    components:{DialogSeting,DialogPreview,DialogVideoPreview},
    props:{
        info:{
            type:Object,
            default:{}
        },
        canEdit:{
            type:Boolean,
            default:true
        }
    },
    data(){
        return {
            dialogVisible:false,
        }
    },
    computed:{
        dataList(){
            let data = this.info.templateData;  
            if(typeof data === 'string'){
                if(data != ''){
                    data = JSON.parse(data);
                }
            }
            return data.TitleTail;
        },
        showDataList(){
            let rawDataList = this.dataList;
            
            const list = [],water=[];
            for(let i=0;i<rawDataList.length;i++){
                let item = rawDataList[i];
                
                if(item.ClipType === 'Title_Video' || item.ClipType === 'Tail_Video'){
                    let w=256,h=144;
                    if(this.info.aspectRatio=='9:16'){
                        w = 81;
                    }
                    let willX=0,willY=0,willW=w,willH=h;
                    if(w/h > item.Width/item.Height){
                        willH = h;
                        willW = h * item.Width/item.Height;
                        willX = (w - willW)*0.5;
                    }else if(w/h < item.Width/item.Height){
                        willW = w;
                        willH = w * item.Height/item.Width;
                        willY = (h - willH)*0.5;
                    }
                    list.push({
                        typeName:item.ClipType === 'Title_Video'?'片头':'片尾',
                        keyFrameUrls:[
                            {
                                url: item.KeyFrameUrl,
                                preUrl:item.PreviewUrl,
                                pos: {
                                    left:willX+'px',
                                    top:willY+'px',
                                    width:willW+'px',
                                    height:willH+'px',
                                }
                            }
                        ]
                    })
                }else if(item.ClipType === 'WaterMark_Image'){
                    water.push(item);
                    
                }
            }
            if(water.length>0){
                let obj = {
                    typeName:'水印',
                    keyFrameUrls:[]
                }
                for(let i=0;i<water.length;i++){
                    let item = water[i];
                    obj.keyFrameUrls.push({
                        url:item.KeyFrameUrl,
                        preUrl:item.PreviewUrl,
                        pos:{
                            left:item.Pos.x*100+'%',
                            top:item.Pos.y*100+'%',
                            width:item.Pos.width*100+'%',
                            height:item.Pos.height*100+'%',
                        }
                    })
                }
                list.push(obj);
            }
            return list;

        },
        aspectRatioClass(){
            if(this.info.aspectRatio=='9:16'){
                return 'ar916';
            }
            return '';
        }
    },
    created(){
        // {
        //                 "ClipId":"5ECF2643B0A44A39B35000A20A2A9F8B",
        //                 "ClipType":"Title_Video",
        //                 "Duration":10027,
        //                 "Width":1280,
        //                 "Height":720,
        //                 "KeyFrameUrl":"http://172.29.3.98:8000/media/image/5ECF264473104323B4F500D70A2A691A/video_title.mp4_20200618_182234242.jpg",
        //                 "PreviewUrl":"http://172.29.3.98:8000/media/video/video_title.mp4",
        //                 "HighPath":"X:/xcontent/vod/default/cpu/video/20200528/5ECF2643C9C044FD971000A10A2A9F8B.mp4"
        //             },
        //             {
        //                 "ClipId":"5ECF2643B0A44A39B35000A20A2A9F8B",
        //                 "ClipType":"Tail_Video",
        //                 "Duration":4054,
        //                 "Width":1920,
        //                 "Height":1080,
        //                 "KeyFrameUrl":"http://172.29.3.98:8000/media/image/video_tail.mp4_20200618_182305046.jpg",
        //                 "PreviewUrl":"http://172.29.3.98:8000/media/video/video_tail.mp4",
        //                 "HighPath":"X:/xcontent/vod/default/cpu/video/20200528/5ECF2643C9C044FD971000A10A2A9F8B.mp4"
        //             },
        //             {
        //                 "ClipId":"5EE82DAD94B84CE7A00B00A90A2A9F8B",
        //                 "ClipType":"WaterMark_Image",
        //                 "Width":1366,
        //                 "Height":768,
        //                 "KeyFrameUrl":"https://nginx1.xctdev.chinamcloud.cn/xcontent/vod/default/cpu/image/20200616/5EE82DAD94B84CE7A00B00A90A2A9F8B.jpg",
        //                 "PreviewUrl":"https://nginx1.xctdev.chinamcloud.cn/xcontent/vod/default/cpu/image/20200616/5EE82DAD94B84CE7A00B00A90A2A9F8B.jpg",
        //                 "HighPath":"X:/xcontent/vod/default/cpu/image/20200616/5EE82DAD94B84CE7A00B00A90A2A9F8B.jpg",
        //                 "Pos":{
        //                     "x":0.2,
        //                     "y":0.3,
        //                     "width":0.3,
        //                     "height":0.2
        //                 }
        //             }
    },
    methods:{
    
        radioClickHandler(event){
            event.stopPropagation();
            this.$emit('selected',this.info);
        },
        radioClickHandler2(event){
            event.stopPropagation();
            this.$emit('db_selected',this.info);
        },
        previewHandler(event){
            event.preventDefault();
            event.stopPropagation();
            this.$refs.previewWindow.show({
                aspectRatio:this.info.aspectRatio,
                dataList:this.dataList
                
            });
        },
        topHandler(event){
            event.preventDefault();
            event.stopPropagation();
            this.$store.dispatch('tl_topTitleTail',{templateId:this.info.templateId}).then( data=>{
                console.log('置顶片头片尾',data);
                this.$store.dispatch('tl_loadTitleTailList')
            }).catch(err=>{
                this.$message.error('置顶片头片尾失败');
            })
        },
        editHandler(event){
            event.preventDefault();
            event.stopPropagation();
            this.$refs.createWindow.show({
                isCreate:false,
                info: this.info
            },()=>{

            });
        },
        deleteHandler(event){
            event.preventDefault();
            event.stopPropagation();
            this.$confirm('删除后不可恢复，确定删除模板？','提示', {
                confirmButtonText: '删除',
                cancelButtonText: '取消',
                type: 'warning',
                center: true
            }).then(() => {
                this.$store.dispatch('tl_delTitleTail',{ids:this.info.templateId}).then( data=>{
                    console.log('删除模板',data);
                    this.$store.dispatch('tl_loadTitleTailList')
                }).catch(err=>{
                    this.$message.error('删除片头片尾失败');
                })
            }).catch((event) => {
                console.log('event',event)
            })
            
        },
        itemClickHandler(item,$event){
            event.preventDefault();
            event.stopPropagation();
            if(item.typeName == '水印') return;
            // console.log(item)
            this.$refs.videoPreview.show({
                preUrl:item.keyFrameUrls[0].preUrl,
                title:''
            })
            
            // console.log(item.keyFrameUrls)
        }
    }
}
</script>

<style lang="scss" scoped>
.am-tt-item{
    width: 100%;
    height: 204px;
    background-color: #ffffff;
    border:1px solid rgba(238,238,238,1);
    border-radius:4px;
    margin-bottom: 30px;
    display: flex;
    align-items: center;


    &:hover{
        border: 1px solid #66b1ff;
    }

    .ati-col{
        width: auto;
        height: 100%;
    }
    .ati-col.col1{
        width: 40px;
        height: 40px;
        margin: 0px 40px;
        // background-color: antiquewhite;
        cursor: pointer;

        .ati-radio-show{
            width: 20px;
            height: 20px;
            border-radius: 50%;
            border: 1px solid #dddddd;
            position: relative;
            transform: translate(10px, 10px);
        }

    }

    .ati-col.col2{
        width: 130px;
        height: 120px;
        margin: 0px 20px;

        .ati-title{
            width: 100%;
            height: 65px;
            padding: 10px 0px;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .ati-aspect-ratio{
            width: 80px;
            height: 40px;
            background-color: #f5f5f5;
            border-radius: 4px;
            text-align: center;
            font-size: 20px;
            line-height: 40px;
            font-weight: bold;
        }
    }

    .ati-col.col3{
        flex: 1;
        width: 300px;
        height: 144px;
        display: flex;

        .ati-tt-item{
            width: 256px;
            height: 144px;
            border-radius:4px;
            margin:0px 20px;
            border-radius:4px;
            overflow: hidden;
            background-color: #f5f5f5;
            position: relative;
            display: flex;
            justify-content: center;

            .ati-type-name{
                position: absolute;
                top: 0px;
                left: 0px;
                width: 62px;
                height: 30px;
                background-color: rgba(0,0,0,0.5);
                line-height: 30px;
                text-align: center;
                color: #ffffff;
                z-index: 1;
            }

            .tt-content{
                background: #eee;
                background-image: linear-gradient(45deg,rgba(0,0,0,.25) 25%,transparent 0,transparent 75%,rgba(0,0,0,.25) 0),linear-gradient(45deg,rgba(0,0,0,.25) 25%,transparent 0,transparent 75%,rgba(0,0,0,.25) 0);
                background-size: 16px 16px;
                background-position: 0 0,24px 24px;
                width: 100%;
                height: 100%;
                position: relative;

                img{
                    position: absolute;
                }
            }

            &.ar916{
                .tt-content{
                    width: 81px;
                }
            }
            
        }
    }

    .ati-col.col4{
        width: 400px;
        height: 40px;
    }
    .ati-col.col4.canEdit{
        width: 400px;
    }
}

.am-tt-item.selected{
    border: 1px solid #409EFF;
    box-shadow:0px 0px 10px rgba(0,0,0,0.15);

    .ati-radio-show{
        border-color: #409EFF;
        &:before{
            content: '';
            position: absolute;
            width: 10px ;
            height: 10px;
            transform: translate(4px, 4px);
            border-radius: 50%;
            background-color: #409EFF;
        }
    }
}
@media screen and (max-width: 1600px) {
    .am-tt-item{
        .ati-col.col1{
            margin: 0px 20px;
        }

        .ati-col.col2{
            width: 90px;
            margin: 0px 10px;
        }

        .ati-col.col3{
            min-width: 520px;
            .ati-tt-item{
                margin: 0px 10px;
            }
        }

    }
}
</style>