<template>
    <div class="video-player" ref="myRoot" @mouseover="mouseoverHandler"  @mouseout="mouseoutHandler">
         <div class="nochange"></div>
         <div class="media-head-box" v-show="one" >
            <video ref="headVideo" class="default-video head" 
            :src="headvideos"
            @loadedmetadata="loadedmetadataHandler"
            
            @play="playHandler"
            @playing="playingHandler"
            @waiting="waitingHandler"
            @pause="pauseHandler"
            @ended="endedHandler"
            @timeupdate="timeupdateHandler"
            @click="playAndpauseHandler" ></video>   
        </div>


        <!-- 这是主视频盒子 -->
        <div class="media-con-box watermark-box" v-show="two">
            <video ref="mainVideo" class="default-video main "
            :src="videourl"
            @loadedmetadata="loadedmetadataHandler"
            @play="playHandler"
            @playing="playingHandler"
            @waiting="waitingHandler"
            @pause="pauseHandler"
            @ended="endedHandler"
            @timeupdate="timeupdateHandler"
            @click="playAndpauseHandler"></video> 
             
            
            <img class="render-img" :src="waterimgs" v-show="wimg" :style="{
                left:waterposx*100+'%',
                top:(waterposy-0.1)*100+'%',
                width:waterposw*100+'%',
                height:waterposh*100+'%',
            }" />
            <div class="zimu">
                <Zimu ref="zimu" :zimuplay="zimuplay" :playvalue="playvalue" :nozimu="nozimu" :simplezimu="simplezimu" :zimushow="zimushow" :maincutime="maincutime" :headtime="headtime" :miantime="maintime" :mas="mas"/>
            </div>

           
           
        </div>
         <div class="media-tail-box" v-show="three" >
            <video ref="tailVideo" class="default-video tail"
            :src="tailvideos"
            @loadedmetadata="loadedmetadataHandler"
            @play="playHandler"
            @playing="playingHandler"
            @waiting="waitingHandler"
            @pause="pauseHandler"
            @ended="endedHandler"
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
            @seek="mc_seekHandler" @current="getcurrents" :all="all" @vplayvalue="getvalue" :pvalue="pvalue" :ptailvalue="ptailvalue" @vcurrenttime="getcurrenttime" :twocu="twocu" :threecu="threecu" :headcutime="headcutime" :maincutime="maincutime" :tailcutime="tailcutime"/>
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
        su:{
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
            whichpaly:""

            
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
            } 
        },
        twocu:{
            immediate:true,
            handler:function(){
                this.goplay()
            } 
        },
        whichpaly:{
            immediate:true,
            handler:function(){
                if(this.whichpaly=="head"){
                    this.play()
                }
                else if(this.whichpaly=="main"){
                    this.play()
                }
                else if(this.whichpaly=="tail"){
                    this.play()
                }
                else if(this.whichpaly=="pause"){
                     this.endedHandler()
                }
            } 
        },
        su:{
            immediate:true,
            handler:function(){
                this.sumargin()
            }   
        }
       
        
    },
    
    created(){
        this.$nextTick(()=>{
            this.video=this.$refs.mainVideo
            // this.head=this.$refs.headVideo
            // this.tail=this.$refs.tailVideo
            
        })
        
    },

    mounted(){
         
    },
    destroyed(){
        
    },
    methods:{
        sumargin(){
           
        },
        play(){
            if(!this.video){
                this.$nextTick(()=>{
                    this.video.play()  
                })
                return;
            }
            this.video.play();
        },
        pause(){
            this.video.pause();
        },
        seek(v){ 
            this.currentTime = v;
            
            

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
                if (this.signal=="ischange") { 
                    this.headtime=document.getElementsByClassName("head")[0].duration
                    this.headcutime=document.getElementsByClassName("head")[0].currentTime
                    this.tailtime=document.getElementsByClassName("tail")[0].duration
                    this.maintime=document.getElementsByClassName("main")[0].duration
                    this.all=this.headtime+this.tailtime+this.maintime
                    this.$refs.mediaControl.setDuration(this.all)
                   
                }else{
                    this.$refs.mediaControl.setDuration(this.video.duration)
                }
           
                
            
        },
        durationchangeHandler(){
            if(!this.$refs.mediaControl) return;
                if (this.signal=="ischange") {
                    this.headtime=document.getElementsByClassName("head")[0].duration
                    this.tailtime=document.getElementsByClassName("tail")[0].duration
                    this.maintime=document.getElementsByClassName("main")[0].duration
                    this.all=this.headtime+this.tailtime+this.maintime            
                   this.$refs.mediaControl.setDuration(this.all) 
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
        playingHandler(){
            this.isPause = false;
        },
        waitingHandler(){
            this.isPause = true;
        },
        pauseHandler(){
            this.isPause = true;
            this.zimuplay=false
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
        },
        chan(){
            if(this.signal=="ischange"){
                this.headtime=document.getElementsByClassName("head")[0].duration
                this.tailtime=document.getElementsByClassName("tail")[0].duration
                this.maintime=document.getElementsByClassName("main")[0].duration
                this.all=this.headtime+this.maintime+this.tailtime
                this.one=true
                this.two=false
                this.three=false 
                this.video=this.$refs.headVideo       
            }      

        },
        getvalue(pv){
             this.playvalue=pv      
            
        },
        getcurrenttime(ctime){
            this.cu=ctime
            
            this.maincutime=document.getElementsByClassName("main")[0].currentTime
            this.maincutime=this.maincutime
            this.mas=this.maincutime
            this.headcutime=document.getElementsByClassName("head")[0].currentTime
            this.headcutime=this.headcutime
            this.tailcutime=document.getElementsByClassName("tail")[0].currentTime
            this.tailcutime=this.tailcutime
            this.threecu=this.headcutime+this.maincutime+this.tailcutime
            
        },
        goplay(){ 
            if(this.signal=="ischange"){  
                if(this.twocu>=0&&this.twocu<this.headtime){
                    this.whichpaly="head"  
                    this.$refs.mediaControl.setCurrentTime(this.threecu)
                }
                else if(this.twocu>=this.headtime&&this.twocu<(this.maintime+this.headtime)){
                    this.nozimu=true
                    this.one=false
                    this.two=true
                    this.three=false 
                    this.video=this.$refs.mainVideo
                    this.whichpaly="main" 
                    this.$refs.mediaControl.setCurrentTime(this.threecu)      

                }
                else if(this.twocu>=(this.maintime+this.headtime)&&this.twocu<(this.headtime+this.maintime+this.tailtime)){  
                    this.one=false
                    this.two=false
                    this.three=true 
                    this.video=this.$refs.tailVideo
                    this.whichpaly="tail"
                }
                
                if(this.twocu==(this.headtime+this.maintime+this.tailtime)){
                this.whichpaly="pause"
            }  
            }
        },
        
        getcurrents(cutime){
            this.twocu=cutime
            console.log("curren",this.twocu)

        }
        
       

        
        
        
    }
}
</script>

<style lang="scss" scoped>
.video-player{
    width: 100%;
    height: 100%;
    position: relative;
    .head{
          position: absolute;
            width: 829px;
            height: 470px;
            object-fit: fill;
            z-index: 1;  
           
    } 
    .tail{
          position: absolute;
            width: 829px;
            height: 460px;
            object-fit: fill;
            z-index: 1;  
            
    } 
    .watermark-box{
       .main{ 
           position: absolute;
            height: 470px;  
            object-fit: fill;
            z-index: 1;
       }

       .render-img{
            position: absolute;
            z-index: 3;    
           
       }
       .zimu{
           position: absolute;
           z-index: 10;
           width: 620px;
           height: 30px;
           top: 80%;
           left: 13%;
           text-align: center;
           line-height: 30px;
           color: pink;
           font-weight: 700;
           letter-spacing: 0.15em;
       }
       
    }
    .media-control{
        background:gray;
        
    }

}

</style>