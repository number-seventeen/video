<template>
    <el-dialog
        title="调整水印位置"
        :visible.sync="dialogVisible"
        width="680px"
        :append-to-body="true"
        :close-on-click-modal="false"
        class="dialog-change-pos">
        <div class="dcc-container">
            <div class="dcc-area" :style="{width:domWidth+'px',height:domHeight+'px'}">
                <div class="area-cover">
                    <MyDefTool ref="myDefTool" :scaleWH="scaleWH" 
                    :useCtrlScale="true" 
                    @change="defToolHandler"/>
                </div>
                <img :src="previewUrl" :style="imgPosStyle"/>
            </div>
        </div>
        <div class="dcc-footer">
            <div class="dccf-left">
                <MessageAlert promptText="提示：按住ctrl键可按原图等比缩放" :hasClose="true"/>
            </div>
            <div class="dccf-right">
                <el-button size="small" @click="onCancelHandler">取消</el-button>
                <el-button type="primary" size="small" @click="onOkHandler">完成</el-button>
            </div>
        </div>
    </el-dialog>
</template>

<script>

import MessageAlert from '../MessageAlert';
import MyDefTool from '../MyDefTool';
export default {
    name:'dialog-change-pos',
    components:{MyDefTool,MessageAlert},
    props:{
        // hasBack:{
        //     type:Boolean,
        //     default: false
        // },
        // title:{
        //     type:String,
        //     default:''
        // }
    },
    data(){
        return {
            dialogVisible: false,
            callback:null,
            previewUrl:'',
            currentTime:0,
            domWidth:0,
            domHeight:0,
            scaleWH:'0:0',
            pos:{
                x:0,
                y:0,
                w:1,
                h:1
            }
        }
    },
    computed:{
        // ...mapState({
        //     curEditTemplate: state => state.appStore.curEditTemplate
        // })
        imgPosStyle(){
            return {
                left:this.pos.x*100+'%',
                top:this.pos.y*100+'%',
                width:this.pos.w*100+'%',
                height:this.pos.h*100+'%',
            }
        }
    },
    watch:{
        // dialogVisible:{
        //     deep:true,
        //     handler:function (newVal){
        //         if(!newVal){
        //             
        //         }
        //     }
        // }
    },
    created(){
        
    },
    mounted(){
        // console.log('ssssssssssmountedmountedssss',this.$refs.preRoot)
    },
    methods:{
        show(options,callback){
            const info = options.info;
            
            this.dialogVisible = true;
            this.callback = callback;
            if(options.aspectRatio === '16:9'){
                this.domWidth = 640;
                this.domHeight = 360;
            }else if(options.aspectRatio === '9:16'){
                this.domWidth = 202.5;
                this.domHeight = 360;
            }
            this.scaleWH = info.Width+":"+info.Height;

            if(info.Pos){
                this.pos.x = info.Pos.x;
                this.pos.y = info.Pos.y;
                this.pos.w = info.Pos.width || 1;
                this.pos.h = info.Pos.height || 1;
                this.$nextTick(()=>{
                    this.$refs.myDefTool.resetPos(this.pos);
                })
                
            }
            this.previewUrl = info.PreviewUrl;
            console.log('info',info)
        },
        onOkHandler(){
            this.dialogVisible = false;
            if(this.callback){
                this.callback({
                    x:this.pos.x,
                    y:this.pos.y,
                    width: this.pos.w,
                    height: this.pos.h
                })
            }
        },
        onCancelHandler(){
            this.dialogVisible = false;
            
        },
        defToolHandler(scalePos){
            this.pos = Object.assign(this.pos,scalePos)
        }
    }
}
</script>


<style lang="scss" scoped>
.dialog-change-pos{
    ::v-deep .el-dialog__header{
        border-bottom: 1px solid #eeeeee;
    }

    ::v-deep .el-dialog__body{
        padding: 15px 20px;
    }

    .dcc-container{
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        // height: 470px;
        // background-color: aqua;
        // display: flex;

        // .dcc-video-box{
        //     width: 640px;
        //     height: 360px;
        //     background-color: black;
        //     display: flex;
        //     justify-content: center;

            
        // }
        .dcc-area{
            width: 100%;
            height: 100%;
            position: relative;
            // background-color: black;
            background: #eee;
            background-image: linear-gradient(45deg,rgba(0,0,0,.25) 25%,transparent 0,transparent 75%,rgba(0,0,0,.25) 0),linear-gradient(45deg,rgba(0,0,0,.25) 25%,transparent 0,transparent 75%,rgba(0,0,0,.25) 0);
            background-size: 16px 16px;
            background-position: 0 0,24px 24px;
        }

        .area-cover{
            position: absolute;
            top: 0px;
            width: 100%;
            height: 100%;
            // background-color: rgba($color: #000000, $alpha: 0.2);
        }

        img{
            position: absolute;
            width: 100%;
            height: 100%;
        }
        
    }

    .dcc-footer{
        margin-top: 15px;
        width: 100%;
        height: 50px;
        border-top: 1px solid #cccccc;
        display: flex;
        justify-content: space-between;
        align-items:flex-end;

        .dccf-left{
            width: 260px;
            align-items: center;
        }

        .dccf-right{
            width: 140px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
    }
    
}
</style>