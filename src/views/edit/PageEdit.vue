<template>
    <div class="page-edit">
        <MainHeader :hasBack="true" title="模板编辑" @backHandler="backHandler" :hasTaskBtn="false" :hasHelpBtn="false">
            <div class="edit-top-btns">
                <el-button type="primary" size="small" @click="renderHandler" class="finish">合成</el-button>
            </div>
        </MainHeader>
        <div class="page-content">
            <div class="page-content2">
                <div class="page-area area2">
                    <div class="view_box">
                         <VideoPlayer ref="vp" :videourl="videolist" :setbox="setbox" :headvideos="headvideo" :tailvideos="tailvideo" :waterimgs="waterimg" :waterposx="waterposx" :waterposy="waterposy" :waterposw="waterposw" :waterposh="waterposh" :wimg="wimg" :signal="signal" :gozimu="gozimu" />
                    </div>
<!-- 上面是播放器 -->


                    <div class="set_box"> 
                        <div class="zhimu">
                            <div class="set">
                                <div class="zhimu_set">字幕设置: <i class="tip el-icon-warning" @mouseover="tipshow()" @mouseout="tiphide()"><div class="tips" v-if="s==true">已选视频中若未包含智能识别和智能翻译数据，则自动忽略，并在列表中标识展示！</div></i> </div>
                                <div class="zhimu_tool">
                                    <a href="">智能字幕工具</a>
                                    <i class="el-icon-arrow-right" style=" margin-left: 5px; font-size: 16px; font-weight: 600;"></i>
                                </div>
                                
                            </div>
                            <div class="zhimu_auto">
                                <el-switch class="switchon" v-model="value" active-color="rgba(0, 121, 254, 1)" inactive-color="rgba(204, 204, 204, 1) " :width=70></el-switch>
                                <label>自动加字幕</label>
                                <div class="choose" >
                                    <ul>
                                        <el-radio-group v-model="radio" v-if="value==true">
                                            <li><el-radio :label="3">仅显示源语种</el-radio></li>
                                            <li><el-radio :label="6">仅显示译文语种</el-radio></li>
                                            <li><el-radio :label="9">源语种+译文同时显示</el-radio></li>
                                        </el-radio-group>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div class="suiyin">
                            <div class="suiyin_head">
                                <div class="suiyin_set">片头尾设置</div>
                                <i class="set_icon el-icon-s-tools" @click="titleset"></i>
                            </div>
                            <div class="suiyin_switch">
                                <el-switch class="switchon two" v-model="values" active-color="rgba(0, 121, 254, 1)" inactive-color="rgba(204, 204, 204, 1) " :width=70 ></el-switch>
                                <label>自动加片头片尾水印</label>
                    
                            </div>
                            
                        </div>
                    </div>
                </div>

                <div class="page-area area3">                   
                </div>

                <div class="page-area area4">
                    <div class="bottom_video">
                        <div class="bottom_title">
                        <div class="left_title">
                            <div class="title_one">已选择视频</div>
                            <div class="title_two">(共{{items.length}}个)</div>
                        </div>
                        <div class="right_title">
                            <i class="el-icon-warning-outline" @mouseover="btipshow()" @mouseout="btiphide()"><div class="tips" v-if="st==true">AI标识为红色时,无法添加智能字幕;<br>译标识为红色时，无法添加译字幕;</div></i>
                            <i class="el-icon-plus" @click="addClickHandler"></i>
                        </div>
                    
                        </div>
                        <div class="card-carousel-wrapper">
                        <el-button type="primary" icon="el-icon-arrow-left" @click="moveCarousel(-1)" :disabled="atHeadOfList" class="arrow-left" id="arrow-left" style="color: #FFF;background-color: gray;border-color: gray; "></el-button>
                        <div class="card-carousel">
                            <div class="card-carousel--overflow-container">
                            <div class="card-carousel-cards" :style="{ transform: 'translateX' + '(' + currentOffset + 'px' + ')'}">
                                <div class="card-carousel--card" v-for="(item,index) in items" :key="index" @click="bigplay(index)">
                                <i class="el-icon-circle-close" @click="del(index)"></i>
                                <video v-bind:src="item.url" class="choosen" style="width: 185px;height: 130px; object-fit:fill;" ></video>
                                </div>
                            </div>
                            </div>
                        </div>
                        <el-button type="primary" icon="el-icon-arrow-right" @click="moveCarousel(1)" :disabled="atEndOfList" class="arrow-right" id="arrow-right" style="color: #FFF;background-color: gray;border-color: gray; "></el-button>
                        </div>
                    </div>        
<!-- zheli -->
                </div>
            </div>
        </div>

        <DialogSelectSource ref="dialogSelectSource" />
        <AmTitletailSeting ref="titleTailSet"/>
    </div>
</template>

<script>
import MainHeader from '@/views/components/MainHeader';
import DialogSelectSource from '../components/DialogSelectSource'
import {mapState,mapMutations, Store} from 'vuex';
import global from '@/plugins/global.js';
import Playprograss from './Playprograss.vue'
import VideoPlayer from '../components/VideoPlayer'
import AmTitletailSeting from '../components/titleTail/AmTitletailSeting'

export default {
    inject:['reload'],
    components:{MainHeader,Playprograss,DialogSelectSource,VideoPlayer,AmTitletailSeting},
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
            currentMedia:null,
            value: false,
            values:false,
            radio: 3,
            s:false,
            st:false,
            currentOffset: 0,
            windowSize: 6,
            paginationFactor: 1290,
            items:[],
            videolist:"",
            headvideo:"",
            tailvideo:"",
            waterimg:"",
            waterposx:0,
            waterposy:0,
            waterposw:0,
            waterposh:0,
            wimg:false,
            signal:"nochange",
            waterurl:Object,
            gozimu:false,
            curwidth:0,
            selected:0,
            setbox:false,
            swidth:""
            
           
            
            
            
        }
    },
    watch:{
        values: {
            immediate:true,
            handler:function(){
                if (this.values==true) {
                    this.addwater()
                }
                if (this.values==false) {
                    this.delwater()
                }
                     
            }
        },
        value: {
            immediate:true,
            handler:function(){
                if (this.value==true) {
                    this.gozimus()
                    
                    
                }
                if (this.value==false) {
                    this.nozimus()
                }
                     
            }
        },
        swidth:{
            immediate:true,
            handler:function(){
                // if(this.swidth=="1920"){
                //     console.log("mmm")
                //     this.setbox=false

                // }
                // else if(this.swidth=="1080"){
                //     console.log("hhhh")
                //     this.setbox=true
                // }   
            }
        }
    },
    computed: {
        // ...mapState({
        //     curSelects: state => state.appStore.curSelectss
        // }),
        atEndOfList() {
        return this.currentOffset <= (this.paginationFactor * -1) * (this.items.length - this.windowSize);
        },
        atHeadOfList() {
        return this.currentOffset === 0;
        },
    },
    mounted(){
        this.$store.dispatch('app_loadTitleTailList',{});
        this.tlListTT=this.$store.state.appStore.tlListTT
        this.curSelects = this.$store.state.appStore.curSelects;
        // if(!this.currentMedia){
        //  console.log(this.curSelects.length)   /* 打印当前选择好的视频  */
         for (this.selected = 0; this.selected < this.curSelects.length; this.selected++) {
             this.videolist=this.curSelects[this.selected].preUrl
             this.items.push({url:this.videolist,})
             this.swidth=this.curSelects[this.selected].width 
            //  if(this.items[this.curwidth]== this.u) {   
            //  }
            
         }
        this.curwidth=this.curSelects.length-1
        if(this.curSelects[this.curwidth].width=="1080" ){
            this.setbox=true
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
        },
        tipshow(){
            this.s=true;
        },
        tiphide(){
            this.s=false;
        },
        btipshow(){
            this.st=true;
        },
        btiphide(){
            this.st=false;
        },
        moveCarousel(direction) {
        // Find a more elegant way to express the :style. consider using props to make it truly generic
            if (direction === 1 && !this.atEndOfList) {
                this.currentOffset -= this.paginationFactor;
            } else if (direction === -1 && !this.atHeadOfList) {
                this.currentOffset += this.paginationFactor;
            }
            
        },
        
        del(index) {
            this.$confirm('是否放弃编辑该文件, ', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.curSelects.splice(index,1)
                this.reload()
                });  
           
        },
        bigplay(index){
            var f=document.getElementsByClassName("main")[0]
            var u=this.items[index].url
            f.setAttribute("src",u) 
            if(this.curSelects[index].width=="1920" ){
                this.setbox=false
            }
            else if(this.curSelects[index].width=="1080"){
                this.setbox=true
            }
             
        },
        addClickHandler(){ 
            var oldlength=this.curSelects.length
            this.$refs.dialogSelectSource.show({},(arr)=>{
                for (let a = 0; a < arr.length; a++) {   
                    this.plus=arr[a]
                    this.curSelects.push(this.plus)
                    var newlength=this.curSelects.length
                    var videolist=this.curSelects[newlength-1].preUrl
                    this.items.push({url:this.videolist})
                     
                }
                this.reload()
                    
            })
        },
        titleset(){
            
            this.$refs.titleTailSet.show({canEdit:this.isAdministrator},(data)=>{  
                this.waterurl=JSON.parse(data.templateData)
                this.tlListTT.isSelected==true
                if(this.waterurl.TitleTail.length==1){
                     this.waterimg=this.waterurl.TitleTail[0].PreviewUrl
                     this.waterposx=this.waterurl.TitleTail[0].Pos.x
                     this.waterposy=this.waterurl.TitleTail[0].Pos.y
                     this.waterposw=this.waterurl.TitleTail[0].Pos.width
                     this.waterposh=this.waterurl.TitleTail[0].Pos.height
                     this.wimg=true
                     
                     
                }else if(this.waterurl.TitleTail.length==3){
                     this.headvideo=this.waterurl.TitleTail[0].PreviewUrl
                     this.tailvideo=this.waterurl.TitleTail[1].PreviewUrl
                     this.waterimg=this.waterurl.TitleTail[2].PreviewUrl
                     this.waterposx=this.waterurl.TitleTail[2].Pos.x
                     this.waterposy=this.waterurl.TitleTail[2].Pos.y
                     this.waterposw=this.waterurl.TitleTail[2].Pos.width
                     this.waterposh=this.waterurl.TitleTail[2].Pos.height
                     this.wimg=true
                     if (data.isSelected==true) {
                        document.getElementsByClassName("nochange")[0].setAttribute("class","ischange")
                        this.signal=document.getElementsByClassName("ischange")[0].getAttribute("class")
                         
                     }         
                             
                }
                
            })
            
        },
        addwater(){
            if(this.tlListTT.isSelected!=true&&this.setbox==false){
                this.tlListTT=this.$store.state.appStore.tlListTT
                this.waterurl=JSON.parse(this.tlListTT[0].templateData)
                this.waterimg=this.waterurl.TitleTail[0].PreviewUrl
                this.waterposx=this.waterurl.TitleTail[0].Pos.x
                this.waterposy=this.waterurl.TitleTail[0].Pos.y
                this.waterposw=this.waterurl.TitleTail[0].Pos.width
                this.waterposh=this.waterurl.TitleTail[0].Pos.height
                this.wimg=true
                console.log("noset")
            }
            else if(this.tlListTT.isSelected!=true&&this.setbox==true){
                this.tlListTT=this.$store.state.appStore.tlListTT
                this.waterurl=JSON.parse(this.tlListTT[4].templateData)
                this.waterimg=this.waterurl.TitleTail[0].PreviewUrl
                this.waterposx=this.waterurl.TitleTail[0].Pos.x-0.15
                this.waterposy=this.waterurl.TitleTail[0].Pos.y-0.03
                this.waterposw=this.waterurl.TitleTail[0].Pos.width-0.15
               
                this.waterposh=this.waterurl.TitleTail[0].Pos.height+0.01
                this.wimg=true
                console.log("yesset")
            }            
            
        },
        delwater(){
            this.wimg=false
        },
        gozimus(){
            this.gozimu=true
        },
        nozimus(){
            this.gozimu=false
        }

            
    }   
}
</script>


<style lang="scss" scoped src="../../edit.scss">

</style>