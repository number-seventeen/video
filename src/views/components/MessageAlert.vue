<template>
    <div class="message-alert" v-if="isShow">
        <i class="el-icon-info"></i>
        <span class="prompt-text">{{promptText}}</span>
        <span class="prompt-close" v-if="hasClose" title="不再显示" @click="closeHandler">
            <i class="el-icon-close"></i>
        </span>
    </div>
</template>

<script>
export default {
    props:{
        promptText:{
            type:String,
            default:'测试'
        },
        hasClose:{
            type:Boolean,
            default: false
        }
    },
    // components:{},
    // computed:{
        
    // },
    data(){
        return {
            isShow:true,
        }
    },
    mounted(){
        // console.log('promptText',this.promptText)
        let messagestr = window.localStorage.getItem('MessageAlerts') || '';
        if(messagestr.indexOf(this.promptText) > -1){
            this.isShow = false;
        }
    },
    methods:{
        closeHandler(){
            this.isShow = false;
            let messagestr = window.localStorage.getItem('MessageAlerts') || '';
            let messages = [];
            if(messagestr){
                messages = messages.concat(JSON.parse(messagestr));
            }
            messages.push(this.promptText);
            window.localStorage.setItem('MessageAlerts',JSON.stringify(messages));
        }
    }
}
</script>


<style lang="scss" scoped>
.message-alert{
    font-size: 12px;
    line-height: 32px;
    border: 1px solid #91D5FF;
    background: #eff9ff;
    position: relative;

    .el-icon-info{
        margin: 0 8px;
        color: #1890FF;
        font-size: 15px;
    }

    .prompt-text{
        color: #595959;
    }

    .prompt-close{
        position: absolute;
        right: 0px;
        padding: 0px 10px 10px 10px;
        cursor: pointer;
        // width: 20px;
        // height: 20px;
        // background: chartreuse;
    }
}
</style>