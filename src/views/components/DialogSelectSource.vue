<template>
    <el-dialog
        title="选择素材"
        :visible.sync="dialogVisible"
        width="940px"
        :append-to-body="true"
        class="dialog-select-source">
        <div class="dss-center">
            <AmSourceSelect 
            ref="sourceSelect"
            :enabledType="enabledType"
            :enabledRadio="enabledRadio"
            :propPageSize="60"
            @flushList="flushListHandler"/>
        </div>
        <div class="dss-footer">
            <div class="dssf-left">
                <MessageAlert v-show="promptText.length>0" :promptText="promptText" :hasClose="false"/>
            </div>
            <div class="dssf-right">
                <el-button type="primary" size="small" @click="onCancelHandler">取消</el-button>
                <el-button type="primary" size="small" @click="onOkHandler">确定</el-button>
            </div>
        </div>
        
    </el-dialog>
</template>

<script>
import AmSourceSelect from 'am-source-select';
import MessageAlert from './MessageAlert';
import * as Interface from '../../store/interfaceUrl.js';
import global from '../../plugins/global';
export default {
    name:'dialog-select-source',
    components:{AmSourceSelect,MessageAlert},
    data(){
        return {
            dialogVisible:false,
            enabledType:'all,video,audio,image',
            enabledRadio:false,
            callback:null,
            promptText:''
        }
    },
    methods:{
        show(options,callback){
            this.dialogVisible = true;
            this.enabledType = options.enabledType;
            this.enabledRadio = !!options.enabledRadio;
            this.promptText = options.promptText || '';
            if(options.isClearChecked && this.$refs.sourceSelect){
                this.$refs.sourceSelect.clearChecked();
            }
            this.callback = callback;
            this.$nextTick(()=>{
                this.flushListHandler(this.$refs.sourceSelect.filterParams);
            })
        },
        flushListHandler(params){
            // /svip/resources/outer-resources
            console.log('flushListHandler',params)
			window.axios.post(Interface.getMediaList+global.search,params)
			.then((data)=>{
				// console.log('data',data)
                // this.returnData = data;
                this.$refs.sourceSelect.setReturnData(data.returnData);
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
        height: 50px;
        display: flex;
        justify-content: space-between;
        // align-items: center;
        padding: 0px 20px;

        .dssf-left{
            width: 270px;
        }
        .dssf-right{
            width: 160px;

            >*{
                margin-left: 20px;
            }
        }
    }
}
</style>