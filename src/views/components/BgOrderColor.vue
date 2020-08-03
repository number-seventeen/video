<template>
    <div class="bg-ordercolor" :class="{horizontal:horizontal}" v-show="bgConfig.bgMode != 0">
        <div class="bo-title">
            背景图顺序
        </div>
        <div class="bo-content">
            <div class="bo-line line1">
                <label>置于视频：</label>
                <span>
                    <el-radio-group v-model="isTop" @change="radioChangeHandler">
                        <el-radio :label="1">上方</el-radio>
                        <el-radio :label="0">下方</el-radio>
                    </el-radio-group>
                </span>
            </div>
            <div class="bo-line line2"  v-show="bgConfig.bgMode == 1">
                <label>背景调整：</label>
                <span>
                    <el-button type="text" @click="changeHandler">调整</el-button>
                </span>
            </div>
            <div class="bo-line line3" v-show="bgConfig.bgMode == 2">
                <label>背景颜色：</label>
                <span>
                    <el-color-picker 
                    v-model="bgcolor" 
                    size="mini" 
                    color-format="hex"
                    :predefine="['#ffffff','#4285f4','#009688','#e82663','#9c27b0','#ff9800','#a0a0a0','#8bc24a']"
                    @active-change="bgcolorChangeHandler"></el-color-picker>
                </span>
            </div>
        </div>

        <DialogChangeContent ref="changeContent"/>
    </div>
</template>

<script>
import {mapState,mapMutations} from 'vuex';
import App from 'AppCore';
import DialogChangeContent from './DialogChangeContent';
export default {
    name:'BgSeting',
    components:{DialogChangeContent},
    props:{
        horizontal:{
            type:Boolean,
            default: false
        }
    },
    data(){
        return {
            isSolidBg:false,
            isTop:0,
            bgcolor:'#000000'
        }
    },
    computed:{
        ...mapState({
            bgConfig: state=>state.appStore.bgConfig
        })
    },
    watch:{
        bgConfig:{
            deep:true,
            handler(newVal){
                if(App.activeSequence.videoTracks[0].dataType2 === 'VideoBg'){
                    this.isTop = 1;
                }else{
                    this.isTop = 0;
                }
            }
        }
    },
    created(){

    },
    mounted(){
        
    },
    methods:{
        radioChangeHandler(){
            console.log('radioChangeHandler',!!this.isTop)
            App.activeSequence.setVideoBgLayer(!!this.isTop);
        },
        bgcolorChangeHandler(v){
            this.bgcolor = v;
            // console.log('bgcolor',this.bgcolor)
            const arr = v.substring(4,v.length-1).split(',');
            const params = {
                r:parseInt(arr[0])/255,
                g:parseInt(arr[1])/255,
                b:parseInt(arr[2])/255,
            }
            let eff = App.activeSequence.EffectAgent.eff_bgMonochrome;
            let videoBg = App.activeSequence.getVideoBgClip();
            if(videoBg && videoBg.effects.length>0){
                eff.params = Object.assign(eff.params,params);
                App.activeSequence.EffectAgent.changeEffect(videoBg,eff);
                App.activeSequence.seek(App.activeSequence.currentTime);
            }
        },
        changeHandler(){
            let videoBgClip = App.activeSequence.getVideoBgClip();
            if(videoBgClip){
                this.$refs.changeContent.show(videoBgClip,(params)=>{
                    // console.log('params',params)
                    // this.clip.inPoint = params.inPoint;
                    // this.clip.outPoint = params.outPoint;
                    // this.clip.trackOut = this.clip.trackIn+(params.outPoint-params.inPoint);
                    Object.assign(videoBgClip.fillPos,params.pos);
                    App.activeSequence.updateEffect2D(videoBgClip,params.pos);
                    App.activeSequence.changeClip(videoBgClip);
                    App.activeSequence.seek(App.activeSequence.currentTime);
                    // App.activeSequence.setVideoBgLayer(params.isVideoBgTop);
                });
            }
            
        },
    }
}
</script>


<style lang="scss" scoped>
.bg-ordercolor{
    position:absolute;
    left: -230px;
    top: 0px;
    width:200px;
    height:160px;
    background: #ffffff;
    box-shadow:0px 0px 10px rgba(0,0,0,0.15);
    // border-radius:4px;
    transition: all 0.2s;
    overflow: hidden;

    &.horizontal{
        left: 0px;
        top: initial;
        bottom: -180px;
    }
    // .bg-seting2{
    //     width:150px;
    //     height:100%;
    //     position:absolute;
    //     right: 0;
    //     display: flex;
    // }

    .bo-title{
        width: 100%;
        height: 40px;
        padding-left: 15px;
        font-size:14px;
        font-family:Microsoft YaHei;
        font-weight:bold;
        background:#f5f5f5;
        line-height: 40px;
        background:#f5f5f5;
    }

    .bo-content{
        width: 100%;
        
        .bo-line{
            width: 100%;
            display: flex;
            padding: 10px 10px 0px 15px;

            >label{
                width: 80px;
                font-size: 14px;
            }

            >span{
                flex:1;
            }
        }

        .bo-line.line1{
            height: 70px;
            .el-radio{
                height: 30px;
                // line-height: 30px;
            }
        }
        .bo-line.line2,.bo-line.line3{
            height: 50px;
            >label{
                padding-top: 5px;
            }
            .el-button{
                padding-top: 7px;
            }
        }
    }

    
}
</style>