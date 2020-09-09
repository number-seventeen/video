<template>
    <div class="v_box">
        <VideoPlayer ref="vp" :videourl="vs" :setbox="setbox" :headvideos="headvide" :tailvideos="tailvide" :waterimgs="waterim" :waterposx="waterposxs" :waterposy="waterposys" :waterposw="waterposws" :waterposh="waterposhs" :wimg="wimg" :signal="signal" :gozimu="gozimu" />
    </div>
</template>

<script>
import VideoPlayer from '../components/VideoPlayer'
export default {
    components:{VideoPlayer},
    data(){
        return{
         vs:"",  
         setboxs:false,
         headvide:"",
         tailvide:"",
         waterim:"",
         waterposxs:0,
         waterposys:0,
         waterposws:0,
         waterposhs:0,
        }
    },
    props:{
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
        } 
        

    },
    mounted(){
        this.vs=this.videourl
        this.setboxs=this.setbox
        this.headvide=this.headvideos
        this.tailvide=this.tailvideos
        this.waterim=this.waterimgs
        this.waterposx=this.waterposxs
        this.waterposy=this.waterposys
        this.waterposw=this.waterposws
        this.waterposh=this.waterposhs
        console.log("hao",this.videourl)
    }

}
</script>

<style>

.v_box{
    width: 781px;
    height: 485px;
    background:pink;
    flex-shrink: 0;
    margin-right: 43px;
    padding: 0;
    box-shadow: 0 0 8px rgb(189, 189, 189);
    margin-top: 12px;   
     
}
</style>