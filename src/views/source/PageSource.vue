<template>
    <div class="page-source">
        <MainHeader :hasBack="false" title="海报视频模板" :hasTaskBtn="false" :hasHelpBtn="false">
            <div class="edit-top-btns">
                <el-button type="primary" size="small" @click="selectedHandler">选用</el-button>
            </div>
        </MainHeader>
        <div class="page-content">
            <div class="page-source-list">
                <AmSourceSelect 
                ref="sourceSelect"
                :enabledType="enabledType"
                :enabledRadio="enabledRadio"
                :propPageSize="60"
                @flushList="flushListHandler"/>
            </div>
        </div>
    </div>
</template>

<script>
import MainHeader from '@/views/components/MainHeader';
import AmSourceSelect from 'am-source-select';
import * as Interface from '../../store/interfaceUrl.js';
import * as types from '../../store/mutationTypes.js';
import global from '../../plugins/global';
import {mapState,mapMutations} from 'vuex';
export default {
    components:{MainHeader,AmSourceSelect},
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
            enabledType:'video',
            enabledRadio:true,
        }
    },
    created(){
        let config = this.$store.state.appStore.config;
        console.log('config',config)
    },
    methods:{
        ...mapMutations({
			setCurrentMedia: types.SET_CURRENT_MEDIA,
		}),
        selectedHandler(){
            const arr = this.$refs.sourceSelect.getSelectSource();
            if(arr.length > 0){
                let media = arr[0];
                this.setCurrentMedia(media);
                this.$router.push({name:'edit',query:global.params});
            }else{
                this.$message({
                    type: 'error',
                    message: '请先选择视频'
                });
            }
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
    }
}
</script>


<style lang="scss" scoped>
.page-source{
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

        .page-source-list{
            width: 100%;
            height: 100%;
            background: #ffffff;
        }
    }
}
</style>