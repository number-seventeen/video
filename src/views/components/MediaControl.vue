<template>
    <div class="media-control" style="background:white;">
       
        <div class="control-btns">
            <div class="cb-left">
                <div class="cb-btn btn-back" style="margin-left:8px;" @click="goback()">
                    <img src="../../../public/houtui.png" style="width:22px;height:22px;" />  
                </div>
                <div class="cb-btn btn-play" v-if="isPause" @click="playHandler" id="pplay">
                    <svg class="icon svg-icon" aria-hidden="true">
                        <use xlink:href="#iconbofang"></use>
                    </svg>    
                </div>
                <div class="cb-btn btn-pause" v-if="!isPause" @click="pauseHandler" id="ppause">
                    <svg class="icon svg-icon" aria-hidden="true">
                        <use xlink:href="#iconzantingtingzhi"></use>
                    </svg>
                </div>
                <div class="cb-btn btn-go"  @click="goit()">
                    <img src="../../../public/qianjin.png" style="width:22px;height:22px;" />  
                </div>
                <div class="cb-time" style="margin-left:5px;">
                    <span style="color:gray;">{{curTimeStr}}</span>
                    <span style="color:gray;">/</span>
                    <span style="color:gray;">{{durTimeStr}}</span>
                </div>
                    <div class="progress-box" style="width:486px;">
                        <MySlider :value="progressValue"  @value_change="value_changeHandler" :goes="goes" />
                    </div>
            </div>
            <div class="cb-right">
                <div class="cb-btn btn-volume">
                   <i class="el-icon-full-screen"  style="color:#cdcdcd;"></i>
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
       
        all:{
            required:true
        },
        mainbox:{
            required:true
        }
        

    },
    watch:{
        currentTime:{
            handler:function(newVal){
                this.cc=newVal
                
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
            gogo:true,
            goes:0,
            ttt:0,
            cc:0,
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
    mounted:function () {
            this.monitor();
            
            
    },
    methods:{
        setCurrentTime(v){
            // console.log("vvv", this.progressValue)
            this.currentTime=v
            if(this.mainbox=="nochange"){
                this.$emit("mainboxtime",this.currentTime)
            } 
            this.progressValue = this.duration == 0?0:(v/this.duration);   
        },
        monitor:function(){
                var that = this;
                var plays=document.getElementsByClassName("cb-left")[0].getElementsByTagName("div")[1]
                var backs=document.getElementsByClassName("cb-left")[0].getElementsByTagName("div")[0]
                var gos=document.getElementsByClassName("cb-left")[0].getElementsByTagName("div")[2]
                document.onkeydown = function(e) {   //按下回车提交
                    let key = window.event.keyCode;
                    //事件中keycode=13为回车事件
                    if (key == 32&&plays.getAttribute("id")=="pplay") {
                        that.playHandler();
                    }
                    else if(key == 32&&plays.getAttribute("id")=="ppause"){
                        that.pauseHandler();
                    }
                    if (key == 37&&backs.getAttribute("class")=="cb-btn btn-back") {
                        that.goback();
                    }
                    else if(key == 39&&gos.getAttribute("class")=="cb-btn btn-go"){
                        that.goit()
                    }
                };
        },
        goit(){
            this.ttt=this.ttt+1  
            this.gogo=true
            if(this.goes<1){
                if(this.ttt>=1){
                   console.log("cu",this.cc)
                    
                    this.goes=(this.cc/this.duration)+0.02
                }  
            }
            else if(this.goes>1){
                 this.goes=1
            }
            this.$emit("gogov",this.gogo)  
            this.$emit("gogoes",this.goes*this.duration)
            
                 
        },
        goback(){
            this.ttt=this.ttt+1 
            this.gogo=false
            if(this.ttt=1){
                this.goes=0.015
            }
            if(this.goes>=0.015){
    
                this.goes=(this.cc/this.duration)-0.015 
         
            }
            if(this.goes<0.015){
                   this.goes=0 
            }
                
            this.$emit("gogov",this.gogo)  
            this.$emit("gogoes",this.goes*this.duration)
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
        },
        
    }
}
</script>


<style lang="scss" scoped>

.media-control{
    width: 100%;
    height: 50px;
    background: white;
    position: absolute;
    bottom: 0;
    z-index: 5;
    user-select: none;


    .control-btns{
        width: 100%;
        height: calc(100% - 20px);
        position: relative;
        top:10px;
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
            .progress-box{
                width: calc(100% - 30px);
                height: 3px;
                left: 15px;
                top: 15px;
                z-index: 1;
                margin-left: 21px;
            }
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