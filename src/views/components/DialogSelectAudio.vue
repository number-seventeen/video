<template>
    <el-dialog
        title="选择音频素材"
        :visible.sync="dialogVisible"
        width="940px"
        :append-to-body="true"
        class="dialog-select-source">
        <div class="dss-center">
            <AmSourceSelect 
            ref="sourceSelect"
            :enabledType="enabledType"
            :enabledRadio="enabledRadio"
            @flushList="flushListHandler"/>
        </div>
        <div class="dss-footer">
            <el-button type="primary" size="small" @click="onCancelHandler">取消</el-button>
            <el-button type="primary" size="small" @click="onOkHandler">确定</el-button>
        </div>
        
    </el-dialog>
</template>

<script>
import AmSourceSelect from 'am-source-select';
export default {
    name:'dialog-select-source',
    components:{AmSourceSelect},
    data(){
        return {
            dialogVisible:false,
            enabledType:'all,video,audio,image',
            enabledRadio:false,
            callback:null
        }
    },
    methods:{
        show(options,callback){
            this.dialogVisible = true;
            this.enabledType = options.enabledType;
            this.enabledRadio = !!options.enabledRadio;
            if(options.isClearChecked && this.$refs.sourceSelect){
                this.$refs.sourceSelect.clearChecked();
            }
            this.callback = callback;
        },
        flushListHandler(params){
			window.axios.post('/postervideo/getMediaList',params)
			.then((data)=>{
				// console.log('data',data)
                // this.returnData = data;
                this.$refs.sourceSelect.setReturnData(data);
			}).catch( ()=>{

			})
        },
        onCancelHandler(){
            this.dialogVisible = false;
        },
        onOkHandler(){
            this.dialogVisible = false;
            const arr = this.$refs.sourceSelect.getSelectSource();
            if(this.callback && arr.length > 0){
                this.callback(arr);
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.dialog-select-source{
    ::v-deep >.el-dialog>.el-dialog__body{
        padding: 5px;
    }
    ::v-deep .el-dialog__header{
        border-bottom: 1px solid #eeeeee;
    }

    .dss-center{
        width: 100%;
        height: 600px;
    }

    .dss-footer{
        width: 100%;
        height: 40px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        padding: 0px 20px;

        >*{
            margin-left: 20px;
        }
    }
}
</style>