<template>
    <div class="source-progress" v-if="isExist">
        <el-tooltip class="item" effect="dark" :content="promptContent" placement="bottom">
            <img src="../../assets/shinning.gif"/>
        </el-tooltip>
        <!-- <div class="sp-bg"></div>
        <div class="sp-progress" :style="{width:pixelPer}"></div> -->
    </div>
</template>

<script>
import App from 'AppCore';
const CORECONTROL = App.CONTROL.CORE;
export default {
    data(){
        return {
            isExist:false,
            progress:0,
            promptContent:'正在加载模板素材，您可先替换素材再预览效果'
        }
    },
    computed:{
        pixelPer(){
            return this.progress*100+'%';
        }
    },
    created(){
        CORECONTROL.$on(CORECONTROL.TGA_LOAD_START,this.tgaStartHandler);
        CORECONTROL.$on(CORECONTROL.TGA_LOAD_PROGRESS,this.tgaProgressHandler);
        CORECONTROL.$on(CORECONTROL.TGA_LOAD_COMPLETE,this.tgaCompleteHandler);
    },
    destroyed(){
        CORECONTROL.$off(CORECONTROL.TGA_LOAD_START,this.tgaStartHandler);
        CORECONTROL.$off(CORECONTROL.TGA_LOAD_PROGRESS,this.tgaProgressHandler);
        CORECONTROL.$off(CORECONTROL.TGA_LOAD_COMPLETE,this.tgaCompleteHandler);
    },
    methods:{
        tgaStartHandler(){
            this.isExist = true;
            // console.log('tgaStartHandler')
        },
        tgaProgressHandler(v){
            this.progress = v;
            // this.promptContent = '提示文字： 正在加载模板素材，您可先替换素材再预览效果'+this.progress;
            // console.log('tgaProgressHandler',v)
        },
        tgaCompleteHandler(){
            this.isExist = false;
            App.activeSequence.seek(App.activeSequence.currentTime);
        }
    }
}
</script>


<style lang="scss" scoped>
.source-progress{
    width: 30px;
    height: 30px;
    position: absolute;
    right: 0px;
    top: 0px;
    z-index: 10;

    img{
        width: 100%;
        height: 100%;
    }
    // width: 100%;
    // height: 4px;
    // position: absolute;
    // top: 0px;
    // left: 0px;
    // z-index: 10;

    // .sp-bg{
    //     width: 100%;
    //     height: 100%;
    //     background-color: #E4E7ED;
    //     position: absolute;
    //     z-index: 1;
    //     left: 0;
    //     top: 0;
    // }

    // .sp-progress{
    //     width: 50%;
    //     height: 100%;
    //     background-color: #409EFF;
    //     position: absolute;
    //     z-index: 2;
    //     left: 0;
    //     top: 0;
    // }
}
</style>