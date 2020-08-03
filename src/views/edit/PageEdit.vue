<template>
    <div class="page-edit">
        <MainHeader :hasBack="true" title="模板编辑" @backHandler="backHandler" :hasTaskBtn="false" :hasHelpBtn="false">
            <div class="edit-top-btns">
                <el-button type="primary" size="small" @click="renderHandler">合成</el-button>
            </div>
        </MainHeader>
        <div class="page-content">
            <div class="page-content2">
                <div class="page-area area1">
                    标题区
                </div>
                <div class="page-area area2">
                    预览区
                </div>
                <div class="page-area area3">
                    控制区
                </div>
                <div class="page-area area4">
                    生成区
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import MainHeader from '@/views/components/MainHeader';
import {mapState,mapMutations} from 'vuex';
import global from '@/plugins/global.js';

export default {
    components:{MainHeader},
    props:{
        // hasBack:{
        //     type:Boolean,
        //     default: false
        // },
        // title:{
        //     type:String,
        //     default:''
        // }
    },
    data(){
        return {
            currentMedia:null
        }
    },
    // computed:{
    //     ...mapState({
    //         currentMedia: state => state.appStore.currentMedia
    //     })
    // },
    // watch:{
    //     currentMedia:{
    //         deep:true,
    //         handler:function (newVal,oldVal){
    //             console.log('currentMedia',newVal)
    //         }
    //     }
    // },
    created(){
        
    },
    mounted(){
        this.currentMedia = this.$store.state.appStore.currentMedia;
        if(!this.currentMedia){
            

            this.$alert('未找到当前选择的素材,请返回素材挑选页', '提示', {
                confirmButtonText: '返回',
            }).then(() => {
                this.$router.push({name:'source',query:global.params});
            }).catch((event) => {
                console.log('event',event)
                // this.$router.push({name:'source',query:global.params});
            });
        }
    },
    methods:{
        backHandler(){
            console.log('返回模板页')
            this.$confirm('此操作将放弃当前编辑的模板，是否继续？','提示', {
                    confirmButtonText: '继续返回',
                    cancelButtonText: '取消',
                    type: 'warning',
                    center: true
                }).then(() => {
                    this.$router.push({name:'source',query:global.params});

                }).catch((event) => {
                    console.log('event',event)
                })
        },
        renderHandler(){
            console.log('合成窗口')
        }
    }
}
</script>


<style lang="scss" scoped>
.page-edit{
    width: 100%;
    height: 100%;
    background-color: #f5f5f5;

    .edit-top-btns{
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-end;
    }

    .page-content{
        width: 100%;
        height: calc(100% - 50px);
        padding: 15px;

        .page-content2{
            width: 100%;
            height: 100%;
            background: #ffffff;
            display: flex;
            flex-flow: column;

            .page-area{
                width: 100%;
            }
            .page-area.area1{
                height: 40px;
                background-color: #ff0000;
            }
            .page-area.area2{
                height: 500px;
                background-color: #ffff00;
            }
            .page-area.area3{
                flex: 1;
                background-color: #00ff00;
            }
            .page-area.area4{
                flex: 1;
                background-color: #0000ff;
            }
        }
    }
}
</style>