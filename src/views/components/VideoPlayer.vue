<template>
    <div class="video-player" ref="myRoot" @mouseover="mouseoverHandler"  @mouseout="mouseoutHandler">
         <div class="nochange"></div>
         <div class="media-head-box" v-show="one" >
            <div class="setboxs" v-show="this.setbox"></div>
            <video ref="headVideo" class="default-video head" 
            :src="headvideos"
            @loadedmetadata="loadedmetadataHandler"
            @play="playHandler"
            @pause="pauseHandler"
            @timeupdate="timeupdateHandler"
            @click="playAndpauseHandler" ></video>   
        </div>


        <!-- 这是主视频盒子 -->
        <div class="media-con-box watermark-box" v-show="two">
            <div class="setboxs" v-show="this.mainshow"></div>
            <video ref="mainVideo" class="default-video main "
            :src="videourl"
            @loadedmetadata="loadedmetadataHandler"
            @play="playHandler"
            @pause="pauseHandler"
            @timeupdate="timeupdateHandler"
            @click="playAndpauseHandler"></video> 
             
            
            <img class="render-img" :src="waterimgs" v-show="wimg" :style="{
                left:(waterposx-0.01)*100+'%',
                top:(waterposy-0.08)*100+'%',
                width:waterposw*100+'%',
                height:waterposh*100+'%',
            }" />
            <div class="zimu">
                <Zimu ref="zimu" :zimuplay="zimuplay" :playvalue="playvalue" :nozimu="nozimu" :simplezimu="simplezimu" :zimushow="zimushow" :maincutime="maincutime" :headtime="headtime" :miantime="maintime" :mas="mas"/>
            </div>

        </div>
         <div class="media-tail-box" v-show="three" >
            <div class="setboxs" v-show="this.setbox"></div>
            <video ref="tailVideo" class="default-video tail"
            :src="tailvideos"
            @loadedmetadata="loadedmetadataHandler"
            @play="playHandler"
            @pause="pauseHandler"
            @timeupdate="timeupdateHandler"
            @click="playAndpauseHandler"></video>   
        </div>
        <MediaControl ref="mediaControl"
            :isPause="isPause"
            v-show="isControl"
            :controlStatus="controlStatus"
            @volume-change="mc_volumeHandler"
            @play="mc_playHandler"
            @pause="mc_pauseHandler"
            @seek="mc_seekHandler"  :mainbox="mainbox" @gogov="getgogov" @gogoes="getgoes" :all="all"  :pvalue="pvalue" :ptailvalue="ptailvalue" @mainboxtime="getmainbox" @fullscreen="getfull"/>
    </div>
</template>

<script>
import MediaControl from './MediaControl';
import Zimu from './Zimu'
export default {
    components:{MediaControl,Zimu},
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
        },
        videourl:{
            required:true
        } ,
        headvideos:{
            required:true
        },
        tailvideos:{
            required:true
        },
        waterimgs:{
            required:true
        },
        waterposx:{
            required:true
        },
        waterposy:{
            required:true
        },
        waterposw:{
            required:true
        },
        waterposh:{
            required:true
        },
        wimg:{
            required:true 
        },
        signal:{
            required:true 
        },
        gozimu:{
            required:true
        },
        setbox:{
            required:true
        },
        mainshow:{
            required:true
        }, 
        plays:{
            required:true
        }
        
    },
    data(){
        return {
            video:null,
            isPause:true,
            controlStatus:'easy',
            one:false,
            two:true,
            three:false,
            headtime:0,
            tailtime:0,
            tailcutime:0,
            maintime:0,
            mas:0,
            maincutime:0,
            headcutime:0,
            all:0,
            playvalue:0,
            pvalue:0,
            ptailvalue:0,
            cu:0,
            twocu:0,
            threecu:0,
            zimuplay:false,
            nozimu:false,
            simplezimu:"",
            zimushow:false,
            mainp:0,
            timer:null,
            whichpaly:"",
            currentTime:0,
            mainbox:"",
            va:0,
            gfull:false,
            
        }
    },
    beforeDestroy() {
      clearInterval(this.timer);
    },
    watch:{
        signal: {
            immediate:true,
            handler:function(){
                this.chan()            
            }
        },
        gozimu:{
            immediate:true,
            handler:function(){
                if(this.gozimu==false) {
                    this.zimushow=false
                    this.pauseHandler()
                }
                else if(this.gozimu==true) {
                    this.zimushow=true
                }         
            } 
        },
        
    },
    mounted(){
        this.$emit("playandpause",this.isPause)
   },
    created(){
        this.$nextTick(()=>{
            this.video=this.$refs.mainVideo
            // this.head=this.$refs.headVideo
            // this.tail=this.$refs.tailVideo    
        })    
    },
    destroyed(){
        
    },
    methods:{
        play(){
            
            if(this.signal=="ischange"){
                this.headtime=document.getElementsByClassName("head")[0].duration*1000
                this.tailtime=document.getElementsByClassName("tail")[0].duration*1000
                this.maintime=document.getElementsByClassName("main")[0].duration*1000
                this.all=this.headtime+this.tailtime+this.maintime
                if(this.currentTime < this.all-200){
                    clearInterval(this.timer);
                    this.timer = setInterval(this.enterframeHandler,40);
                    this.isPause = false;  
                    this.$emit("playandpause",this.isPause)  
                }
            }
            else{
                this.video.play()  
                this.isPause=false
                this.$emit("playandpause",this.isPause)
            }    
        },
        getgogov(m){
            this.va=m
            // console.log("nnn",this.va)
        },
        getfull(f){
            this.gfull=f
            this.$emit("gotfull",this.gfull)
        },
        getgoes(v){
            v=v*1000
            var ms=v
            if(this.signal=="ischange"){
                this.headtime=document.getElementsByClassName("head")[0].duration*1000
                this.tailtime=document.getElementsByClassName("tail")[0].duration*1000
                this.maintime=document.getElementsByClassName("main")[0].duration*1000
                this.all=this.headtime+this.tailtime+this.maintime
                v = Math.min(this.all,Math.max(0,v));
                this.currentTime = v;
                if(v>=0 && v<this.headtime){
                    this.one = true;
                    this.two = false;
                    this.three = false;
                    this.$refs.headVideo.currentTime = v/1000;
                }else if(v>= this.headtime && v < (this.headtime+this.maintime)){
                    // console.log("gogo")
                    this.one = false;
                    this.two = true;
                    this.three = false;
                    this.$refs.mainVideo.currentTime = (v-this.headtime)/1000;
                    // console.log("main",this.$refs.mainVideo.currentTime)
                    this.mas=((this.currentTime/1000)-(this.headtime/1000))
                }else if(v>= (this.headtime+this.maintime) && v<= this.all){
                    this.one = false;
                    this.two= false;
                    this.three = true;
                    this.$refs.tailVideo.currentTime = (v-(this.headtime+this.maintime))/1000;
                }
                this.$refs.mediaControl.setCurrentTime(v/1000);
                
            }
            else{
                this.$refs.mediaControl.setCurrentTime(v/1000)
                this.$refs.mainVideo.currentTime = v/1000;
            }
        },
        enterframeHandler(){
            this.currentTime += 40;
            let v = this.currentTime;
            if(v>=0 && v<this.headtime){
                this.one = true;
                this.two = false;
                this.three = false;
                if(this.$refs.headVideo.paused){
                    this.$refs.headVideo.play();
                }
            }else if(v>= this.headtime && v < (this.headtime+this.maintime)){
                this.one = false;
                this.two = true;
                this.three= false;
                if(this.$refs.mainVideo.paused){
                    this.$refs.mainVideo.play();
                }
                 
                this.mas=((this.currentTime/1000)-(this.headtime/1000))
            }else if(v>= (this.headtime+this.maintime) && v<= this.all){
                this.one = false;
                this.two = false;
                this.three = true;
                if(this.$refs.tailVideo.paused){
                    this.$refs.tailVideo.play();
                }
            }
            this.$refs.mediaControl.setCurrentTime(v/1000);
            if(v>this.all-40){
                this.pause();
            }
        },
        pause(){
            clearInterval(this.timer);
            this.isPause = true;
             this.$emit("playandpause",this.isPause)
            if(!this.$refs.headVideo.paused){
                this.$refs.headVideo.pause();
            }
            if(!this.$refs.tailVideo.paused){
                this.$refs.tailVideo.pause();
            }
            if(!this.$refs.mainVideo.paused){
                this.$refs.mainVideo.pause();
            }
        },
        seek(v){ 
            if(this.signal=="ischange"){
                this.headtime=document.getElementsByClassName("head")[0].duration*1000
                this.tailtime=document.getElementsByClassName("tail")[0].duration*1000
                this.maintime=document.getElementsByClassName("main")[0].duration*1000
                this.all=this.headtime+this.tailtime+this.maintime
                v = Math.min(this.all,Math.max(0,v));
                this.currentTime = v;
               
                if(v>=0 && v<this.headtime){
                    this.one = true;
                    this.two = false;
                    this.three = false;
                    this.$refs.headVideo.currentTime = v/1000;
                }else if(v>= this.headtime && v < (this.headtime+this.maintime)){
                    // console.log("gogo")
                    this.one = false;
                    this.two = true;
                    this.three = false;
                    this.$refs.mainVideo.currentTime = (v-this.headtime)/1000;
                    // console.log("main",this.$refs.mainVideo.currentTime)
                    this.mas=((this.currentTime/1000)-(this.headtime/1000))
                }else if(v>= (this.headtime+this.maintime) && v<= this.all){
                    this.one = false;
                    this.two= false;
                    this.three = true;
                    this.$refs.tailVideo.currentTime = (v-(this.headtime+this.maintime))/1000;
                }
                this.$refs.mediaControl.setCurrentTime(v/1000);
                
            }
            else{
                this.$refs.mediaControl.setCurrentTime(v/1000)
                this.$refs.mainVideo.currentTime = v/1000;
            }

        },
        playAndpauseHandler(){
            if(this.isPause){
                this.play();
            }else{
                this.pause();
            }
        },
        loadedmetadataHandler(){
            if(!this.$refs.mediaControl) return;
                if (this.signal=="ischange") { 
                    this.headtime=document.getElementsByClassName("head")[0].duration*1000
                    this.tailtime=document.getElementsByClassName("tail")[0].duration*1000
                    this.maintime=document.getElementsByClassName("main")[0].duration*1000
                    this.all=this.headtime+this.tailtime+this.maintime
                    this.$refs.mediaControl.setDuration(this.all/1000)
                   
                }else{
                    this.$refs.mediaControl.setDuration(this.video.duration)
                }
           
                
            
        },
        durationchangeHandler(){
            if(!this.$refs.mediaControl) return;
                if (this.signal=="ischange") {
                    this.headtime=document.getElementsByClassName("head")[0].duration*1000
                    this.tailtime=document.getElementsByClassName("tail")[0].duration*1000
                    this.maintime=document.getElementsByClassName("main")[0].duration*1000
                    this.all=this.headtime+this.tailtime+this.maintime            
                   this.$refs.mediaControl.setDuration(this.all/1000) 
                }else{
                   this.$refs.mediaControl.setDuration(this.video.duration)
                }
        },
        playHandler(){
            this.isPause = false;
            if ((this.gozimu==true)||(this.simplezimu=="nochange"&&this.gozimu==true)) {   
                this.zimushow=true
                this.zimuplay=true
                this.simplezimu=this.signal
                    
            }
            
        },
        
        pauseHandler(){
            this.isPause = true;
            this.zimuplay=false
        },
        
        timeupdateHandler(){
             if(this.$refs.mediaControl&&this.signal=="nochange"){
                this.$refs.mediaControl.setCurrentTime(this.video.currentTime);
                
            }
        },
        mc_volumeHandler(v){
            if(this.video){
                this.video.volume = v;
            }
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
            this.seek(v*1000)
        },
        mouseoverHandler(){
            this.controlStatus = 'all';    
            
        },
        mouseoutHandler(){
            this.controlStatus = 'easy';
        },
        chan(){
            if(this.signal=="ischange"){
                this.headtime=document.getElementsByClassName("head")[0].duration*1000
                this.tailtime=document.getElementsByClassName("tail")[0].duration*1000
                this.maintime=document.getElementsByClassName("main")[0].duration*1000
                this.all=this.headtime+this.maintime+this.tailtime
                this.one=true
                this.two=false
                this.three=false 
                this.video=this.$refs.headVideo 
                this.mainbox=this.signal 
                this.simplezimu=this.signal    
            } 
            else if(this.signal=="nochange"){
                this.timeupdateHandler()
                this.mainbox=this.signal
                this.simplezimu=this.signal  
            }     

        },
        getmainbox(maincu){
            this.mas=maincu
        },
        goFullScreen(){
            //    var ele = document.getElementsByClassName("main")[0];
            //     if (ele.requestFullscreen) {
            //         ele.requestFullscreen();
            //     } else if (ele.mozRequestFullScreen) {
            //         ele.mozRequestFullScreen();
            //     } else if (ele.webkitRequestFullScreen) {
            //         ele.webkitRequestFullScreen();
            //     }
        },
        nofull(){
            this.$parent.gotfulls()
           
        },
        changep(){
            console.log("ok",this.isPause)
            console.log("zzzz",this.plays)
            if(this.plays==false){
                    this.isPause==true
                    console.log("hghg",this.isPause)
                    this.pauseHandler()
                    
                   
            } 
        }

            
    }
}
</script>

<style lang="scss" scoped src="../../videoplay.scss">
</style>