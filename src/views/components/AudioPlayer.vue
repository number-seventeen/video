<template>
    <div class="audio-player"
    @mouseover="apMouseOverHandler"
    @mouseout="apMouseOutHandler">
        <div class="ap-progress">
            <div class="ap-pro" :style="{width:perProgressStr}"></div>
        </div>
        <div class="ap-word">
            <div class="apw-left">
                {{title}}
            </div>
            <div class="apw-right">
                <div class="spinner" :class="{movie:!isPause}">
                    <div class="rect1"></div>
                    <div class="rect2"></div>
                    <div class="rect3"></div>
                    <div class="rect4"></div>
                    <div class="rect5"></div>
                </div>
                <div class="apw-dur">{{durationStr}}</div>
            </div>
        </div>
        <audio ref="myAudio" v-show="false" :src="url"
        @loadedmetadata="loadedmetadataHandler"
        @canplaythrough="canplaythroughHandler"
        @error="errorHandler"
        @play="playHandler"
        @playing="playingHandler"
        @waiting="waitingHandler"
        @pause="pauseHandler"
        @ended="endedHandler"
        @timeupdate="timeupdateHandler"/>
    </div>
</template>

<script>
import Utils from '@/libs/Utils';
export default {
    props:{
        title:{
            type:String,
            default: ''
        },
        url:{
            type:String,
            default: ''
        }
    },
    computed:{
        durationStr(){
            return Utils.getFormatHMS(this.duration);
        },
        perProgressStr(){
            return this.perProgress*100+'%';
        }
    },
    data(){
        return {
            audio:null,
            // title:'这里是音乐的标题这里是音乐的标题这里是音乐的标题这里是音乐的标题这里是音乐的标题这里是音乐的标题这里是音乐的标题这里是音乐的标题',
            duration: 0,
            // url:'http://localhost:8000/media/audio/等一个晴天.mp3',
            isPause:true,
            perProgress:0,
            delayTime:1000,
            delayTimer:null
        }
    },
    created(){},
    mounted(){
        this.audio = this.$refs.myAudio;
    },
    methods:{
        apMouseOverHandler(){
            clearTimeout(this.delayTimer);
            this.delayTimer = setTimeout(()=>{
                this.audio.play();
            },this.delayTime)
            
        },
        apMouseOutHandler(){
            clearTimeout(this.delayTimer);
            if(!this.audio.paused){
                this.audio.pause();
            }
        },
        loadedmetadataHandler(){
            this.duration = this.audio.duration*1000;
        },
        durationchangeHandler(){
            this.duration = this.audio.duration*1000;
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
            this.perProgress = 0;
        },
        endedHandler(){
            this.isPause = true;
        },
        timeupdateHandler(){
            this.perProgress = this.audio.currentTime/this.audio.duration;
        },
    }
}
</script>


<style lang="scss" scoped>
.audio-player{
    width: 100%;
    height: 60px;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
    cursor: default;

    &>*{
        pointer-events: none;
    }

    .ap-progress,.ap-word{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }

    .ap-progress{
        background-color: #f5f5f5;

        .ap-pro{
            width: 50%;
            height: 100%;
            background: #409EFF;
            opacity: 0.35;
        }
    }
    .ap-word{
        padding: 0 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .apw-left{
            flex: 1;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            padding-right: 15px;
        }
        .apw-right{
            width: 100px;
            display: flex;
            justify-content: space-around;
            align-items: center;

            .spinner {
                /* margin: 100px auto; */
                width: 26px;
                height: 20px;
                font-size: 10px;
                display: flex;
                justify-content: space-around;
                // opacity: 0;

                &> div {
                    background-color: #bfbfbf;
                    height: 100%;
                    width: 2px;
                    display: inline-block;
                    transform-origin: bottom;
                    // -webkit-animation: audiowave 1.2s infinite ease-in-out;
                    animation: audiowave 1.2s infinite ease-in-out;
                    animation-play-state:paused;
                }

                .rect2 {
                    // -webkit-animation-delay: -1.1s;
                    animation-delay: -1.1s;
                }
                
                .rect3 {
                    // -webkit-animation-delay: -1.0s;
                    animation-delay: -1.0s;
                }
                
                .rect4 {
                    // -webkit-animation-delay: -0.9s;
                    animation-delay: -0.9s;
                }
                
                .rect5 {
                    // -webkit-animation-delay: -0.8s;
                    animation-delay: -0.8s;
                }
            }

            .spinner.movie{
                &>div{
                    animation-play-state:running;
                }
            }
        }
    }

    
}
</style>