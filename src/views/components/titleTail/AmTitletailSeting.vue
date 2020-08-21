<template>
    <div class="am-titletail-seting" :class="{'show':isShow}" :style="{'z-index':zIndex}">
        <div class="ats-top">
            <div class="mh-left">
                <span class="back-btn" @click="backHandler">
                    <i class="el-icon-back"></i>
                </span>
                <span class="mh-title">片头片尾设置</span>
            </div>
            <div class="mh-right">
                
            </div>
        </div>
        <div class="ats-center" :class="{canEdit:!canEdit}">
            <div class="atsc-header" v-if="canEdit">
                <el-button type="primary" size="mini" @click="createHandler">新建模板</el-button>
            </div>
            <!-- <el-alert
                title="提示：双击模板可选中并自动返回主编辑页"
                type="info"
                show-icon>
            </el-alert> -->
            <MessageAlert promptText="提示：双击模板可选中并自动返回主编辑页" :hasClose="true"/>
            <div class="atsc-body">
                <AmItem v-for="(item,index) in tlListTT" :key="index" :info="item" 
                @selected="selectedHandler" 
                @db_selected="db_selectedHandler"
                :canEdit="canEdit">
                </AmItem>
            </div>
        </div>
        
        
        <DialogSeting ref="createWindow" />
    </div>
</template>

<script>
import AmItem from './AmItem';
import Utils from '@/libs/Utils.js';
import DialogSeting from './DialogSeting';
import MessageAlert from '../MessageAlert';
import {mapState,mapMutations} from 'vuex';
import * as types from '@/store/mutationTypes.js';
export default {
    name:'am-titletail-seting',
    props:{
        
    },
    components:{
        AmItem,
        DialogSeting,
        MessageAlert
    },
    data (){
        return {
            isShow: false,
            canEdit: true,
            zIndex:100,
            callback:null
        }
    },
    computed:{
        ...mapState({
            tlListTT: state => state.appStore.tlListTT,
        })
    },
    created(){

    },
    mounted(){
        if(this.$el.parentNode != document.body){
            document.body.appendChild(this.$el);
        }
    },
    watch:{
        // enabledType:{
        //     deep:true,
        //     handler(){
        //         this.enabledTypeChange();
        //     }
        // }
    },
    methods:{
        ...mapMutations({
			selectedTitleTail: types.TL_SELECTED_TT,
		}),
        show(options,callback){
            // console.log('dddddddddddd',options,callback)
            // this.zIndex = Utils.getMaxZindex();
            this.callback = callback
            this.isShow = true;
            this.canEdit = options.canEdit;
        },
        backHandler(){
            
            this.isShow = false;
            // this.$el.remove();
            if(this.callback){
                const arr = this.$store.state.appStore.tlListTT;
                let selectObj = null;
                for(let i=0;i<arr.length;i++){
                    if(arr[i].isSelected){
                        selectObj = arr[i];
                        break;
                    }
                }
                this.callback(selectObj);
                
            }
        },
        createHandler(){
            this.$refs.createWindow.show({isCreate:true},()=>{

            });
        },
        selectedHandler(item){
            this.selectedTitleTail(item);
        },
        db_selectedHandler(item){
           
            this.selectedTitleTail(item);
            // if(!this.canEdit){
                this.backHandler();
                
            // }
        }
    }
}
</script>

<style lang="scss" scoped>
.am-titletail-seting{
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: fixed;
    top: 0px;
    font-size: 14px;
    transform: scale(0);
    transition: all 0.2s;
    user-select: none;

    .ats-top{
        width: 100%;
        height: 50px;
        // position: fixed;
        // top: 0;
        background-color: #ffffff;
        display: flex;
        // justify-content: center;
        align-items: center;

        .mh-left{
            padding-left: 20px;
            display: flex;
            align-items: center;
            flex: 1;
            height: 100%;

            .back-btn{
                width: 30px;
                height: 30px;
                border: 1px solid #d6d6d6;
                border-radius: 50%;
                align-items: center;
                color: #777777;
                font-size: 25px;
                line-height: 31px;
                margin-right: 15px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
            }
        }

        .mh-right{
            display: flex;
            align-items: center;
            flex: 1;
            height: 100%;
        }
    }

    .ats-center{
        width: 100%;
        height: calc(100% - 50px);
        background-color: rgba(245,245,245,1);
        padding: 15px;
        display: flex;
        flex-flow: column;

        .atsc-header{
            width: 100%;
            height: 45px;
            padding-top: 5px;
            // display: flex;
            // align-items: center;
        }
        .atsc-body{
            width: 100%;
            // height: calc(100% - 45px);
            flex: 1;
            background-color: #ffffff;
            padding: 30px;
            overflow: auto;
        }
    }

    // .ats-center.canEdit{

    //     .atsc-body{
    //         height: 100%;
    //     }
        
    // }
}
.am-titletail-seting.show{
    transform: scale(1);
}
</style>