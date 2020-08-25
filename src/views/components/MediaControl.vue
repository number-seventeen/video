<template>
    <div class="media-control" :class="controlStatus">
        <div class="progress-box">
            <!-- <el-slider v-model="currentTime" 
            @input="progressChangeHandler(this,$event)"
            :min="0"
            :max="duration"></el-slider> -->
            <MySlider :value="progressValue" :hiddenKey="controlStatus=='easy'" @value_change="value_changeHandler"/>
        </div>
        <div class="control-btns">
            <div class="cb-left">
                <div class="cb-btn btn-play" v-if="isPause" @click="playHandler">
                    <svg class="icon svg-icon" aria-hidden="true">
                        <use xlink:href="#iconbofang"></use>
                    </svg>
                    
                </div>
                <div class="cb-btn btn-pause" v-if="!isPause" @click="pauseHandler">
                    <svg class="icon svg-icon" aria-hidden="true">
                        <use xlink:href="#iconzantingtingzhi"></use>
                    </svg>
                </div>
                <div class="cb-time">
                    <span>{{curTimeStr}}</span>
                    <span>/</span>
                    <span>{{durTimeStr}}</span>
                </div>
            </div>
            <div class="cb-right">
                <div class="cb-btn btn-volume" @mouseover="vbtn_mouseover" @mouseout="vbtn_mouseout">
                    <div class="cb-btn-click"  @click="muteClickHandler">
                        <svg class="icon svg-icon" aria-hidden="true" v-if="volumeStatus=='level0'">
                            <use xlink:href="#iconjingyin"></use>
                        </svg>
                        <svg class="icon svg-icon" aria-hidden="true" v-if="volumeStatus=='level1'">
                            <use xlink:href="#iconshengyin2"></use>
                        </svg>
                        <svg class="icon svg-icon" aria-hidden="true" v-if="volumeStatus=='level2'">
                            <use xlink:href="#iconshengyin1"></use>
                        </svg>
                        <svg class="icon svg-icon" aria-hidden="true" v-if="volumeStatus=='level3'">
                            <use xlink:href="#iconshengyin"></use>
                        </svg>
                    </div>
                    <el-slider class="volume-slider" v-show="showVolumeSlider" vertical height="100px" v-model="volume" :min="0" :max="1" :step="0.01"
                    :format-tooltip="formatTooltipSlider"
                    @input="volumeChangeHandler"
                    tooltip-class="volume-slider-tooltip"></el-slider>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import MySlider from './MySlider';
import Utils from '@/libs/Utils.js';
export default {
    components:{MySlider},
    props:{
        isPause:{
            type:Boolean,
            default: false
        },
        controlStatus:{
            type:String,
            default:'easy'
        },
        all:{
            required:true
        },
        mainbox:{
            required:true
        }
        

    },
    watch:{
        currentTime:{
            handler:function(){
                
            }
        },

    },
    data(){
        return {
            currentTime:0,
            duration:0,
            volume:1,
            recordVolume:1,
            isMute:false,
            // curTimeStr:'00:00:00',
            // durTimeStr:'00:00:00',
            showVolumeSlider: false,
            progressValue:0,//0-1
        }
    },
    
    computed:{
        
        volumeStatus(){
            if(this.volume === 0) return 'level0';
            if(this.volume <= 0.2) return 'level1';
            if(this.volume <= 0.6) return 'level2';
            return 'level3';
        },
        curTimeStr(){
            return Utils.getFormatHMS(this.currentTime*1000);
            
        },
        durTimeStr(){
            return Utils.getFormatHMS(this.duration*1000);
            
        }
    },
    methods:{
        setCurrentTime(v){
            this.currentTime=v
            if(this.mainbox=="nochange"){
                this.$emit("mainboxtime",this.currentTime)
            }
            this.progressValue = this.duration == 0?0:(v/this.duration);
        },
        
        setDuration(v){
            this.duration = v;
        },
        setVoume(v){
            this.volume = v;
        },
        vbtn_mouseover(){
            this.showVolumeSlider = true;
        },
        vbtn_mouseout(){
            this.showVolumeSlider = false;
        },
        formatTooltipSlider(value){
            return Math.floor(value*100) + '%'
        },
        volumeChangeHandler(v){
            this.isMute = v==0;
            this.$emit('volume-change',v);
        },
        playHandler(){
            this.$emit('play');
            
        },
        pauseHandler(){
            this.$emit('pause');
        },
        value_changeHandler(v){
            // console.log('value_changeHandler',v,event)
            this.$emit('seek',v*this.duration);
        },
        muteClickHandler(){
            this.isMute = !this.isMute;
            if(this.isMute){
                this.recordVolume = this.volume;
                this.volume = 0;
            }else{
                this.volume = this.recordVolume || 0.5;
            }
            this.$emit('volume_change',this.volume);
        }
    }
}
</script>


<style lang="scss" scoped>
.media-control{
    width: 100%;
    height: 60px;
    background-color: rgba(0,0,0,0.5);
    position: absolute;
    bottom: 0;
    z-index: 5;
    user-select: none;

    .progress-box{
        width: calc(100% - 30px);
        height: 3px;
        position: absolute;
        left: 15px;
        top: 15px;
        z-index: 1;
    }

    .control-btns{
        width: 100%;
        height: calc(100% - 20px);
        position: relative;
        top: 20px;
        // position: absolute;
        // top: 15px;
        display: flex;
        z-index: 2;
        
        .cb-left{
            display: flex;
            align-items: center;
            padding-left: 5px;
            flex: 1;
            font-size: 14px;
            color: #ffffff;
        }
        .cb-right{
            width: 40px;
            display: flex;
            align-items: center;
        }

        .cb-btn{
            width: 30px;
            height: 30px;
            cursor: pointer;
            display: flex;
            justify-content: center;
            align-items: center;

            &:hover{
                // background-position-x: -30px;
                color: #bdbdbd;
            }
        }
        .btn-volume{
            position: relative;
            color: #ffffff;
            font-size: 22px;

            .volume-slider{
                position: absolute;
                bottom: 30px;
                left: -6px;
            }
        }
    }
}
.media-control.easy{
    height: 3px;
    .progress-box{
        height: 3px;
        width: 100%;
        height: 3px;
        position: absolute;
        left: 0px;
        top: initial;
    }
    .control-btns{
        display: none;
    }
}
</style>