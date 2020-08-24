<template>
    <el-dialog
        title="预览片头片尾"
        :visible.sync="dialogVisible"
        width="680px"
        :append-to-body="true"
        class="dialog-preview-tt">
        <div class="dpt-container">
            <div class="dpt-preview-box" @mouseover="mouseoverHandler"  @mouseout="mouseoutHandler">
                <div class="dpt-preview-con" :class="aspectRatioClass" @click="playAndpauseHandler">
                    <video ref="videoTitle" class="render-box default-video" v-show="conshow1"></video>
                    <div  ref="videoCenter" class="render-box watermark-box" v-show="conshow2">
                        <div class="render-default">
                        </div>
                        <div class="render-img">
                            <img v-for="(item,index) in tt_watermarks" :key="index" :src="item.PreviewUrl" 
                            :style="{
                                left:item.Pos.x*100+'%',
                                top:item.Pos.y*100+'%',
                                width:item.Pos.width*100+'%',
                                height:item.Pos.height*100+'%',
                            }"/>
                        </div>
                    </div>
                    <video ref="videoTail" class="render-box default-video" v-show="conshow3"></video>
                </div>
                <DialogMediaControl ref="mediaControl"
                    :isPause="isPause"
                    v-show="isControl"
                    :controlStatus="controlStatus"
                    @volume-change="mc_volumeHandler"
                    @play="mc_playHandler"
                    @pause="mc_pauseHandler"
                    @seek="mc_seekHandler"/>
            </div>
        </div>
    </el-dialog>
</template>

<script>

import DialogMediaControl from '../DialogMediaControl';
export default {
    name:'dialog-preview-tt',
    components:{DialogMediaControl},
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
            aspectRatio: '16:9',
            tt_title:null,
            tt_tail:null,
            tt_watermarks:[],
            dur_title:0,
            dur_tail:0,
            dur_content:2000,
            currentTime:0,
            seqDuration:0,
            controlStatus:'easy',
            isPause:true,
            isControl:true,
            conshow1:false,
            conshow2:false,
            conshow3:false,
            timer:0,
            twocu:0,
            pvalue:0
            
        }
    },
    computed:{
        imgPosStyle(item){
            console.log('itemitemitemitem',item)
            return {
                left:item.Pos.x*100+'%',
                top:item.Pos.y*100+'%',
                width:item.Pos.width*100+'%',
                height:item.Pos.height*100+'%',
            }
        },
        aspectRatioClass(){
            if(this.aspectRatio=='9:16'){
                return 'ar916';
            }
            return '';
        }
    },
    watch:{
        dialogVisible:{
            deep:true,
            handler:function (newVal){
                if(!newVal){
                    this.pause();
                }
            }
        }
    },
    created(){
        
    },
    mounted(){
        // console.log('ssssssssssmountedmountedssss',this.$refs.preRoot)
        // this.$refs.mediaControl.setCurrentTime(0);
        // this.$refs.mediaControl.setDuration(0);
    },
    methods:{
        show(options,callback){
            this.dialogVisible = true;
            // console.log('optionsoptionsoptions',options)
            this.tt_title = null;
            this.tt_tail = null;
            this.tt_watermarks = [];

            this.dur_title = 0;
            this.dur_tail = 0;
            this.aspectRatio = options.aspectRatio;
            const dataList = options.dataList || [];
            for(let i=0;i<dataList.length;i++){
                let item = dataList[i];
                if(item.ClipType == 'Title_Video'){
                    this.tt_title = item;
                    this.dur_title = this.tt_title.Duration;
                }else if(item.ClipType == 'Tail_Video'){
                    this.tt_tail = item;
                    this.dur_tail = this.tt_tail.Duration;
                }else if(item.ClipType == 'WaterMark_Image'){
                    this.tt_watermarks.push(item);
                }
            }
            this.seqDuration = this.dur_content+this.dur_title+this.dur_tail;
            
            this.$nextTick(()=>{
                this.$refs.mediaControl.setCurrentTime(0);
                this.$refs.mediaControl.setDuration(this.seqDuration/1000);

                if(this.tt_title){
                    this.$refs.videoTitle.src = this.tt_title.PreviewUrl;
                }
                if(this.tt_tail){
                    this.$refs.videoTail.src = this.tt_tail.PreviewUrl;
                }
                this.seek(0);
            })
        },
        mc_volumeHandler(v){
            this.$refs.videoTitle.volume = v;
            this.$refs.videoTail.volume = v;
            // if(this.video){
            //     this.video.volume = v;
            // }
        },
        mc_playHandler(v){
            // this.video.play();
            this.play();
        },
        mc_pauseHandler(v){
            // this.video.pause();
            this.pause();
        },
        mc_seekHandler(v){
            // console.log('v',v);
            // this.video.currentTime = v;
            this.seek(v*1000);
        },
        mouseoverHandler(){
            this.controlStatus = 'all';
        },
        mouseoutHandler(){
            this.controlStatus = 'easy';
        },
        playAndpauseHandler(){
            if(this.isPause){
                this.play();
            }else{
                this.pause();
            }
        },
        play(){
           
            if(this.currentTime < this.seqDuration-200){
            
                clearInterval(this.timer);
                this.timer = setInterval(this.enterframeHandler,40);
                this.isPause = false;
            }
        },
        pause(){
            clearInterval(this.timer);
            this.isPause = true;
            if(!this.$refs.videoTitle.paused){
                this.$refs.videoTitle.pause();
            }
            if(!this.$refs.videoTail.paused){
                this.$refs.videoTail.pause();
            }
        },
        enterframeHandler(){
            this.currentTime += 40;
            let v = this.currentTime;
            
            if(v>=0 && v<this.dur_title){
                this.conshow1 = true;
                this.conshow2 = false;
                this.conshow3 = false;
                if(this.$refs.videoTitle.paused){
                    this.$refs.videoTitle.play();
                }
            }else if(v>= this.dur_title && v < (this.dur_title+this.dur_content)){
                this.conshow1 = false;
                this.conshow2 = true;
                this.conshow3 = false;
            }else if(v>= (this.dur_title+this.dur_content) && v<= this.seqDuration){
                this.conshow1 = false;
                this.conshow2 = false;
                this.conshow3 = true;
                if(this.$refs.videoTail.paused){
                    this.$refs.videoTail.play();
                }
            }
            this.$refs.mediaControl.setCurrentTime(v/1000);
            if(v>this.seqDuration-40){
                this.pause();
            }
        },
        seek(v){
            console.log("seek",v)
            v = Math.min(this.seqDuration,Math.max(0,v));
            this.currentTime = v;
            if(v>=0 && v<this.dur_title){
                this.conshow1 = true;
                this.conshow2 = false;
                this.conshow3 = false;
                this.$refs.videoTitle.currentTime = v/1000;
            }else if(v>= this.dur_title && v < (this.dur_title+this.dur_content)){
                this.conshow1 = false;
                this.conshow2 = true;
                this.conshow3 = false;
            }else if(v>= (this.dur_title+this.dur_content) && v<= this.seqDuration){
                this.conshow1 = false;
                this.conshow2 = false;
                this.conshow3 = true;
                this.$refs.videoTail.currentTime = (v-(this.dur_title+this.dur_content))/1000;
            }
        }
    }
}
</script>


<style lang="scss" scoped>
.dialog-preview-tt{
    ::v-deep .el-dialog__header{
        border-bottom: 1px solid #eeeeee;
    }

    ::v-deep .el-dialog__body{
        padding: 20px 20px;
    }

    .dpt-container{
        width: 100%;
        
        .dpt-preview-box{
            width: 640px;
            height: 360px;
            background-color: #eeeeee;
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;

            .dpt-preview-con{
                width: 100%;
                height: 100%;
                position: relative;
                background-color: #000000;
            }

            .dpt-preview-con.ar916{
                width: 202.5px;
            }

        }
        

        .render-box {
            width: 100%;
            height: 100%;
            position: absolute;
            left: 0;
            top: 0;

            .render-default{
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                z-index: 1;
                background-color: rgb(52, 105, 105);
            }

            .render-img{
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                z-index: 2;
            }

            &.watermark-box img{
                position: absolute;
            }
        }
    }

    
    
}
</style>