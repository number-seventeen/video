<template>
    <el-dialog
        title="预览"
        :visible.sync="dialogVisible"
        width="680px"
        :append-to-body="true"
        class="preview-dialog">
        <div class="video-box">
            <VideoPlayer ref="myVideo" :url="previewUrl" :poster="posterUrl"/>
        </div>
        <div class="description">{{title}}</div>
    </el-dialog>
</template>

<script>
import VideoPlayer from './VideoPlayer';
export default {
    name:'va-preview',
    components:{VideoPlayer},
    data(){
        return {
            dialogVisible:false,
            previewUrl:'',
            posterUrl:'',
            title:''
        }
    },
    watch:{
        dialogVisible:{
            deep:true,
            handler(newval){
                if(!newval){
                    this.$refs.myVideo.pause();
                }
            }
        }
    },
    methods:{
        show(info){
            // console.log('info',info);
            this.previewUrl = info.preUrl;
            this.title = info.title;
            this.dialogVisible = true;
            this.$nextTick(()=>{
                this.$refs.myVideo.play();
            })
        },
        onOkHandler(){
            this.dialogVisible = false;
        }
    }

}
</script>

<style lang="scss" scoped>
.preview-dialog{
    ::v-deep .el-dialog__header{
        border-bottom: 1px solid #eeeeee;
    }

    .video-box{
        width: 640px;
        height: 360px;
    }
    .description{
        width: 100%;
        height: 30px;
        line-height: 30px;
    }
}

</style>