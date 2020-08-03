<template>
    <div class="bg-seting" :class="{'hidden':!expand}" @mouseover="event=>expand=true"  @mouseout="event=>expand=false">
        <div class="bs-title">
            自定义背景
        </div>
        <div class="bs-btngroup">
            <el-radio-group v-model="bgMode" @change="radioChangeHandler">
                <el-radio :label="0">模板默认</el-radio>
                <el-radio :label="1">选择图片</el-radio>
                <el-radio :label="2">纯色背景</el-radio>
            </el-radio-group>
            <!-- <el-radio :label="0" @change="radioChangeHandler1">模板默认</el-radio>
            <el-radio :label="1" @change="radioChangeHandler1">选择图片</el-radio>
            <el-radio :label="2" @change="radioChangeHandler1">纯色背景</el-radio> -->
            <!-- <div class="bs-btngroup"> -->
                <!-- <div class="btn-line"><el-button type="text" @click="replaceHandler">替换</el-button></div>
                <div class="btn-line"><el-button type="text" @click="changeHandler">调整</el-button></div> -->
            <!-- </div> -->
            
        </div>

        <DialogSelectSource ref="selectSource"/>
        <DialogChangeContent ref="changeContent"/>
    </div>
</template>

<script>
import {mapState,mapMutations} from 'vuex';
import * as types from '@/store/mutationTypes.js';
import App from 'AppCore';
import DialogSelectSource from './DialogSelectSource';
import DialogChangeContent from './DialogChangeContent';
import Utils from '../../libs/Utils';
export default {
    name:'BgSeting',
    components:{DialogSelectSource,DialogChangeContent},
    props:{
        hasBack:{
            type:Boolean,
            default: false
        },
        title:{
            type:String,
            default:''
        }
    },
    data(){
        return {
            expand:false,
            bgMode:0,
            beforeMode:0,
        }
    },
    computed:{
        ...mapState({

        })
    },
    created(){

    },
    mounted(){
        this.setBgConfig({bgMode:0});
    },
    methods:{
        ...mapMutations({
			setBgConfig: types.BG_MODE,
        }),
        radioChangeHandler(){
            if(this.bgMode == 1){
                this.bgMode = this.beforeMode;
                let str = '建议选用'+App.activeSequence.preset.width+'*'+App.activeSequence.preset.height+'的尺寸作为背景图片';
                this.$refs.selectSource.show({
                    enabledType:'image',
                    enabledRadio:true,
                    isClearChecked:true,
                    promptText:str
                },(arr)=>{
                    // console.log('dialslslsreplaceHandler',arr)
                    let videoBgClip = App.activeSequence.getVideoBgClip();
                    if(arr.length>0){
                        let selectObj = arr[0];
                        if(selectObj.width == 0 || selectObj.height == 0){
                            Utils.getMediaInfoOfUrl(selectObj.preUrl).then((data)=>{
                                if(data){
                                    selectObj.width = data.info.width;
                                    selectObj.height = data.info.height;
                                    App.activeSequence.replaceClip(videoBgClip,arr);
                                }
                            }).catch(error=>{
                                App.activeSequence.replaceClip(videoBgClip,arr);
                            })
                        }else{
                            App.activeSequence.replaceClip(videoBgClip,arr);
                        }
                        this.bgMode = 1;
                        this.setBgConfig({bgMode:this.bgMode});
                        App.activeSequence.changeBgMode(this.bgMode);
                        App.activeSequence.seek(App.activeSequence.currentTime);
                    }
                    
                });
            }else{
                this.setBgConfig({bgMode:this.bgMode});
                App.activeSequence.changeBgMode(this.bgMode);
                App.activeSequence.seek(App.activeSequence.currentTime);
            }
            if(this.beforeMode != this.bgMode){
                this.beforeMode = this.bgMode;
            }
        },
        replaceHandler(){
            this.$refs.selectSource.show({
                    enabledType:'video,image',
                    enabledRadio:true,
                    isClearChecked:true
                },(arr)=>{
                    // console.log('dialslslsreplaceHandler',arr)
                    let videoBgClip = App.activeSequence.getVideoBgClip();
                    // console.log(videoBgClip)
                    if(videoBgClip){
                        App.activeSequence.replaceClip(videoBgClip,arr);
                    }
            });
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
.bg-seting{
    position:absolute;
    left: 0px;
    top: 90px;
    width:150px;
    height:105px;
    background: #ffffff;
    box-shadow:5px 0px 10px rgba(0,0,0,0.15);
    border-radius:4px;
    transition: all 0.2s;
    overflow: hidden;
    display: flex;
    z-index: 10;

    // .bg-seting2{
    //     width:150px;
    //     height:100%;
    //     position:absolute;
    //     right: 0;
    //     display: flex;
    // }

    .bs-title{
        width: 30px;
        height: 100%;
        padding: 10px 8px;
        font-size:14px;
        font-family:Microsoft YaHei;
        font-weight:400;
        line-height:18px;
        color:rgba(0,0,0,1);
        opacity:0.64;
        background:#f5f5f5;
        line-height: 17px;
    }

    .bs-btngroup{
        width: 120px;
        height: 100%;
        // padding: 8px 0px 0px 15px;

        // .el-radio{
        //     height: 30px;
        //     line-height: 30px;
        // }
        
        .el-radio-group{
            width: 100%;
            height: 100%;
            padding: 8px 0px 0px 15px;

            .el-radio{
                height: 30px;
                line-height: 30px;
            }
        }
    }

    
}
.bg-seting.hidden{
    width:30px;
    border-radius:0px 4px 4px 0px;
}
</style>