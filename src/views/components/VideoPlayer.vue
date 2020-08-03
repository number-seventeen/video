<template>
    <div class="video-player" ref="myRoot" @mouseover="mouseoverHandler"  @mouseout="mouseoutHandler">
        <!-- <div class="media-con-box">
            
        </div> -->
        <video ref="myVideo" class="default-video"
        :src="url"
        @loadedmetadata="loadedmetadataHandler"
        @canplaythrough="canplaythroughHandler"
        @error="errorHandler"
        @play="playHandler"
        @playing="playingHandler"
        @waiting="waitingHandler"
        @pause="pauseHandler"
        @ended="endedHandler"
        @timeupdate="timeupdateHandler"
        @click="playAndpauseHandler"></video>
        <MediaControl ref="mediaControl"
            :isPause="isPause"
            v-show="isControl"
            :controlStatus="controlStatus"
            @volume-change="mc_volumeHandler"
            @play="mc_playHandler"
            @pause="mc_pauseHandler"
            @seek="mc_seekHandler"/>
    </div>
</template>

<script>
import MediaControl from './MediaControl';
export default {
    components:{MediaControl},
    props:{
        url:{
            type:String,
            default:''
        },
        isControl:{
            type:Boolean,
            default: true
        },
        toFirstFrame:{
            type:Boolean,
            default: false
        }
    },
    data(){
        return {
            video:null,
            isPause:true,
            controlStatus:'easy'
            // volume:1,
        }
    },
    watch:{
        // url:{
	    //     deep: true,
        //     handler:function (newVal,oldVal){
        //         console.log('url',newVal)
        //         this.video.src = newVal;
        //         this.isPause = true;
        //     }
        // }
    },
    created(){
        this.$nextTick(()=>{
            this.video = this.$refs.myVideo;
        })
    },
    mounted(){
        this.$refs.mediaControl.setCurrentTime(0);
        this.$refs.mediaControl.setDuration(0);
    },
    destroyed(){
        
    },
    methods:{
        play(){
            if(!this.video){
                this.$nextTick(()=>{
                    this.$refs.myVideo.play();
                })
                return;
            }
            this.video.play();
        },
        pause(){
            this.video.pause();
        },
        seek(v){
            this.video.currentTime = v;
        },
        playAndpauseHandler(){
            if(this.video.paused){
                this.video.play();
            }else{
                this.video.pause();
            }
        },
        loadedmetadataHandler(){
            if(!this.$refs.mediaControl) return;
            this.$refs.mediaControl.setDuration(this.video.duration);
        },
        durationchangeHandler(){
            if(!this.$refs.mediaControl) return;
            this.$refs.mediaControl.setDuration(this.video.duration);
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
            if(this.toFirstFrame){
                this.video.currentTime = 0;
            }
        },
        timeupdateHandler(){
            if(this.$refs.mediaControl){
                this.$refs.mediaControl.setCurrentTime(this.video.currentTime);
            }
        },
        mc_volumeHandler(v){
            if(this.video){
                this.video.volume = v;
            }
        },
        mc_playHandler(v){
            this.video.play();
        },
        mc_pauseHandler(v){
            this.video.pause();
        },
        mc_seekHandler(v){
            // console.log('v',v);
            this.video.currentTime = v;
        },
        mouseoverHandler(){
            this.controlStatus = 'all';
        },
        mouseoutHandler(){
            this.controlStatus = 'easy';
        }
    }
}
</script>

<style lang="scss" scoped>
.video-player{
    width: 100%;
    height: 100%;
    position: relative;

    .default-video{
        width: 100%;
        height: 100%;
    }

    // .media-con-box{
    //     width: 100%;
    //     height: 50px;
    //     position: absolute;
    //     bottom: 0;
    //     z-index: 5;
    // }
}
</style>