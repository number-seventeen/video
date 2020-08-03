<template>
    <el-dialog
        title="调整内容片断"
        :visible.sync="dialogVisible"
        width="680px"
        :append-to-body="true"
        :close-on-click-modal="false"
        class="dialog-change-content">
        <div class="dcc-container">
            <div class="dcc-video-box">
                <div class="dcc-video-box2" :style="{width:videoDomWidth+'px',height:videoDomHeight+'px'}">
                    <div class="video-cover">
                        <MyDefTool ref="myDefTool" :scaleWH="scaleWH" :minLimitScale="0.25"/>
                    </div>
                    <video v-if="type=='video'" ref="myVideo"
                    :src="previewUrl"
                    @loadedmetadata="loadedmetadataHandler"
                    @canplaythrough="canplaythroughHandler"
                    @error="errorHandler"
                    @play="playHandler"
                    @playing="playingHandler"
                    @waiting="waitingHandler"
                    @pause="pauseHandler"
                    @ended="endedHandler"
                    @timeupdate="timeupdateHandler">
                    </video>
                    <img v-if="type=='image'" :src="previewUrl"/>
                </div>

                <div class="play-btn-box" v-if="type=='video'">
                    <div class="cb-btn btn-play" v-if="isPause" @click="playBtnHandler">
                        <svg class="icon svg-icon" aria-hidden="true">
                            <use xlink:href="#iconbofang"></use>
                        </svg>
                    </div>
                    <div class="cb-btn btn-pause" v-if="!isPause" @click="pauseBtnHandler">
                        <svg class="icon svg-icon" aria-hidden="true">
                            <use xlink:href="#iconzantingtingzhi"></use>
                        </svg>
                    </div>
                </div>
            </div>
            <div class="dcc-range-slider" v-show="showRange">
                <MyRangeSlider ref="myRangeSlider" :disabledInOutBar="disabledInOutBar" @seek="seekHandler"/>
            </div>
            <!-- <div class="dcc-video-bg" v-if="type2=='VideoBg'">
                <el-switch
                v-model="isVideoBgTop"
                active-text="置于视频上方"
                inactive-text="置于视频下方">
                </el-switch>
            </div> -->
        </div>
        <div class="dcc-footer">
            <div class="dccf-left">
                <span v-if="disabledInOutBar && type=='video'">提示：当前模板限定素材段的持续时长，不可拖动调节长短。</span>
            </div>
            <div class="dccf-right">
                <el-button size="small" @click="onCancelHandler">取消</el-button>
                <el-button type="primary" size="small" @click="onOkHandler">完成</el-button>
            </div>
        </div>
    </el-dialog>
</template>

<script>
import App from 'AppCore';
import MyDefTool from './MyDefTool';
import MyRangeSlider from './MyRangeSlider';
import DataType from "@/model/DataType";
export default {
    name:'dialog-change-content',
    components:{MyDefTool,MyRangeSlider},
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
            // videoWidth:0,
            // videoHeight:0,
            videoDomWidth:0,
            videoDomHeight:0,
            scaleWH:'0:0',
            inPoint:0,
            outPoint:60,
            duration:60,
            type:'video',
            type2:'',
            disabledInOutBar:false,
            isPause:true,
            // isVideoBgTop:true,
        }
    },
    computed:{
        // ...mapState({
        //     curEditTemplate: state => state.appStore.curEditTemplate
        // })
        showRange(){
            // if(type=='video')
            return this.type=='video' && this.type2 !== 'VideoBg'
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
        show(info,callback){
            let isPoster = this.$store.state.appStore.config.appType === 'poster';
            this.dialogVisible = true;
            this.callback = callback;
            this.videoDomHeight = 360; 
            this.videoDomWidth = this.videoDomHeight*info.imageWidth/info.imageHeight;
            // this.videoWidth = info.imageWidth;
            // this.videoHeight = info.imageHeight;
            if(info.fillScale){
                this.scaleWH = info.fillScale.width+":"+info.fillScale.height;
            }else{
                this.scaleWH = info.imageWidth+":"+info.imageHeight;
            }

            if(info.dataType === DataType.CLIP_VIDEO){
                this.type = 'video';
            }else if(info.dataType === DataType.CLIP_VIDEO_IMAGE || info.dataType === DataType.CLIP_CG_IMAGE){
                this.type = 'image';
            }
            // console.log('Appp',App.activeSequence.systemConfig.isFixedDuration)
            // this.disabledInOutBar = !isPoster;
            this.disabledInOutBar = App.activeSequence.systemConfig.isFixedDuration;
            this.$nextTick(()=>{
                if(info.fillPos){
                    this.$refs.myDefTool.resetPos(info.fillPos);
                }
                if(this.type == 'video'){
                    this.$refs.myRangeSlider.resetUI(info.duration/1000,info.inPoint/1000,info.outPoint/1000);
                }
            })
            // if(info.fillPos){
            //     this.$nextTick(()=>{
            //         this.$refs.myDefTool.resetPos(info.fillPos);
            //     })
                
            // }
            
            this.type2 = info.dataType2;
            this.previewUrl = info.previewUrl;
            // console.log('this.isVideoBgTop',this.isVideoBgTop)
            // this.isVideoBgTop = App.activeSequence.videoTracks[0].dataType2 === 'VideoBg';
            // console.log('this.isVideoBgTop',this.isVideoBgTop)
            // console.log('info',info)
        },
        onOkHandler(){
            this.dialogVisible = false;
            if(this.callback){
                this.callback({
                    // info:info,
                    pos:this.$refs.myDefTool.getPos(),
                    inPoint: this.$refs.myRangeSlider.inPoint*1000,
                    outPoint: this.$refs.myRangeSlider.outPoint*1000,
                    // isVideoBgTop: this.isVideoBgTop
                })
            }
        },
        onCancelHandler(){
            this.dialogVisible = false;
            
        },
        loadedmetadataHandler(){
            this.videoWidth = this.$refs.myVideo.videoWidth;
            this.videoHeight = this.$refs.myVideo.videoHeight;
            this.duration = this.$refs.myVideo.duration;
            this.outPoint = this.duration;

            // this.videoDomHeight = 360; 
            // this.videoDomWidth = this.videoDomHeight*this.videoWidth/this.videoHeight;
            // console.log(this.videoDomWidth,this.videoDomHeight)

            
        },
        seekHandler(ct){
            this.$refs.myVideo.currentTime = ct;
        },
        playBtnHandler(){
            // this.$emit('play');
            this.inPoint = this.$refs.myRangeSlider.inPoint;
            this.outPoint = this.$refs.myRangeSlider.outPoint;
            let ct = this.$refs.myVideo.currentTime;
            if(ct<this.inPoint || ct > this.outPoint){
                this.$refs.myVideo.currentTime = this.inPoint;
            }
            this.$refs.myVideo.play();
            // console.log('this.$refs.myVideo',this.$refs.myVideo)
        },
        pauseBtnHandler(){
            // this.$emit('pause');
            this.$refs.myVideo.pause();
        },
        durationchangeHandler(){
            // this.$refs.mediaControl.setDuration(this.video.duration);
        },
        canplaythroughHandler(){
            //  this.isPause = false;
        },
        errorHandler(){
            this.isPause = true;
        },
        playHandler(){
            this.isPause = false;
        },
        playingHandler(){
            this.isPause = false;
        },
        waitingHandler(){
            this.isPause = true;
        },
        pauseHandler(){
            this.isPause = true;
        },
        endedHandler(){
            this.isPause = true;
        },
        timeupdateHandler(){
            let ct = this.$refs.myVideo.currentTime;
            if(this.$refs.myRangeSlider){
                this.$refs.myRangeSlider.seek(ct,false);
            }
            if(ct>=this.outPoint){
                this.$refs.myVideo.pause();
            }
        }
    }
}
</script>


<style lang="scss" scoped>
.dialog-change-content{
    ::v-deep .el-dialog__header{
        border-bottom: 1px solid #eeeeee;
    }

    ::v-deep .el-dialog__body{
        padding: 15px 20px;
    }

    .dcc-container{
        width: 100%;
        // height: 470px;
        // background-color: aqua;
        // display: flex;

        .dcc-video-box{
            width: 640px;
            height: 360px;
            background-color: black;
            display: flex;
            justify-content: center;
            position: relative;

            .dcc-video-box2{
                height: 100%;
                position: relative;
            }

            .video-cover{
                position: absolute;
                top: 0;
                width: 100%;
                height: 100%;
                // background-color: rgba($color: #000000, $alpha: 0.2);
            }


            video{
                width: 100%;
                height: 100%;
                object-fit: fill;
            }

            img{
                width: 100%;
                height: 100%;
            }


            .play-btn-box{
                position: absolute;
                left: 0;
                bottom: 0;
                width: 36px;
                height: 36px;
                background: rgba(0,0,0,0.5);
                z-index: 4;
                display: flex;
                justify-content: center;
                align-items: center;
                color: #ffffff;
                cursor: pointer;
            }
        }

        .dcc-range-slider{
            width: 100%;
            margin-top: 10px;
            // height: 100px;
            // background-color: rgb(138, 138, 32);
        }

        .dcc-video-bg{
            width: 100%;
            height: 36px;
            padding-top: 15px;
        }
        
    }

    .dcc-footer{
        margin-top: 15px;
        width: 100%;
        height: 50px;
        border-top: 1px solid #cccccc;
        display: flex;
        justify-content: space-between;
        // align-items:flex-end;
        .dccf-left{
            flex: 1;
            height: 100%;
            padding-top: 15px;
            font-size: 14px;
            color: #848484;
        }

        .dccf-right{
            width: 123px;
            height: 100%;
            padding-top: 10px;
        }
    }
    
}
</style>