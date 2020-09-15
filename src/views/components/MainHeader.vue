<template>
    <div class="main-header">
        <div class="mh-left">
            <span class="back-btn" v-if="hasBack" @click="backHandler">
                <i class="el-icon-back"></i>
            </span>
            <span class="mh-title">{{title}}</span>
        </div>
        <div class="mh-right">
            <div class="children-root">
                <slot></slot>
            </div>
            <div class="right-btn task" v-if="hasTaskBtn" @click="taskBtnClickHandler">
                <svg class="icon svg-icon" aria-hidden="true">
                    <use xlink:href="#iconrenwuliebiao"></use>
                </svg>
            </div>
            <div class="right-btn help" v-if="hasHelpBtn" @click="helpClickHandler">
                <svg class="icon svg-icon" aria-hidden="true">
                    <use xlink:href="#iconwenhao"></use>
                </svg>
            </div>
            
        </div>

    </div>
</template>

<script>
export default {
    name:'MainHeader',
    components:{},
    props:{
        hasBack:{
            type:Boolean,
            default: false
        },
        title:{
            type:String,
            default:''
        },
        hasTaskBtn:{
            type:Boolean,
            default: true
        },
        hasHelpBtn:{
            type:Boolean,
            default: true
        }
    },
    data(){
        return {
           
        }
    },
    computed:{
        isPoster(){
            return this.$store.state.appStore.config.appType == 'poster';
        }
    },
    created(){
        
    },
    mounted(){
        
    },
    methods:{
        backHandler(){
            this.$emit('backHandler');
        },
        taskBtnClickHandler(){
            
        },
        
        helpClickHandler(){
            let url = this.$store.state.appStore.config.helpUrl;
            window.open(url);
        }
    }
}
</script>


<style lang="scss" scoped>
.main-header{
    box-shadow: 0 0 2px rgb(177, 174, 174);
    width: 100%;
    height: 50px;
    background-color: #ffffff;
    display: flex;
    // justify-content: center;
    align-items: center;
    .mh-left{
        padding-left: 20px;
        display: flex;
        align-items: center;
        flex: 1;
        width: 20px;
        height: 20px;

        .back-btn{
            width: 28px;
            height: 28px;
            border: 1px solid #d6d6d6;
            border-radius: 50%;
            align-items: center;
            color: #777777;
            font-size: 18px;
            font-weight: 600;
            line-height: 23px;
            padding-bottom: 2px;
            margin-right: 15px;
            cursor: pointer;
            align-items: center;
            justify-content: center;
            text-align: center;
            .el-icon-back{
                margin-top: 3px;
            }
        }
    }

    .mh-right{
        display: flex;
        align-items: center;
        flex: 1;
        height: 100%;
        margin-right: 10px;

        .children-root{
            flex: 1;
            height: 100%;
            margin-right: 10px;
        }

        .right-btn{
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background-color: #FFAA00;
            margin-right: 10px;
            cursor: pointer;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #ffffff;

            // background-image: url('../../assets/btns/task-btn.png');
        }
    }
}
</style>