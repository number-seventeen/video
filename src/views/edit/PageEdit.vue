<template>
    <div class="page-edit">
        <MainHeader :hasBack="true"  @backHandler="backHandler" :hasTaskBtn="false" :hasHelpBtn="false">
            <div class="edit-top-btns">
                <el-button type="primary" size="small" @click="renderHandler" class="finish" style="width:50px; height:25px;"><span>合成</span></el-button>
            </div>
        </MainHeader>
        <div class="page-content">
            <div class="page-content2">
                <div class="page-area area2">
                    <div class="view_box">
                         <VideoPlayer ref="vp" :videourl="vstart" :setbox="setbox" :headvideos="headvideo" :tailvideos="tailvideo" :waterimgs="waterimg" :waterposx="waterposx" :waterposy="waterposy" :waterposw="waterposw" :waterposh="waterposh" :wimg="wimg" :signal="signal" :gozimu="gozimu" />
                    </div>
<!-- 上面是播放器 -->
                    <div class="set_box" v-show="tool"> 
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
                                <div class="title_one">已选素材</div>
                                <div class="title_two">(当前已选{{items.length}})</div>
                            </div>
                            <div class="right_title">
                                <i class="el-icon-plus" @click="addClickHandler" ></i>
                                <i class="el-icon-delete" id="alldel" @mouseover="btipshow()" @mouseout="btiphide()" @click="alldel()" style="font-weight:200;font-size:19px; color:black; position:relative; right:5px;" ></i>
                                
                            </div>
                        </div>
                        <div class="card-carousel-wrapper">
                        <el-button type="primary" icon="el-icon-arrow-left" @click="moveCarousel(-1)" :disabled="atHeadOfList" class="arrow-left" id="arrow-left" style="color:gray;background-color:white;border-color:white; width:30px; height:30px; font-size:25px; font-weight:700;"></el-button>
                        <div class="card-carousel">
                            <div class="card-carousel--overflow-container">
                                <div class="card-carousel-cards" :style="{ transform: 'translateX' + '(' + currentOffset + 'px' + ')'}">
                                    <div class="card-carousel--card" :class="{'vcurrent':nu==index}" v-for="(item,index) in items" :key="index" @click="bigplay(index)"  @mouseover="set_show(index)" @mouseout="move_show(index)" >
                                        <div class="v_del" v-show="vdel">
                                            <i class="el-icon-delete" @click="del(index)"></i>
                                        </div>
                                        <div class="biaohao">{{item.id+1}}</div>
                                        <div class="vtimes">{{item.dur}}</div>
                                        <div class="vinfo"  v-show="vdel">
                                            <div class="info">
                                                <ul>
                                                    <li>
                                                        <span>名称:</span><span> 电视剪辑</span>
                                                    </li>
                                                    <li>
                                                        <span>格式:</span><span> MP4</span>
                                                    </li>
                                                    <li>
                                                        <span>时长:</span><span>{{item.dur}}</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                        <video v-bind:src="item.url"  class="choosen" style="width: 185px;height: 130px; object-fit:fill; border-radius: 4px;"></video>
                                    </div>
                                    <div class="bigadd" @click="addClickHandler">
                                        <i class="el-icon-plus" ></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <el-button type="primary" icon="el-icon-arrow-right" @click="moveCarousel(1)" :disabled="atEndOfList" class="arrow-right" id="arrow-right" style="color: gray; border-color:white; background-color: white; width:30px; height:30px; font-size:25px; font-weight:700;" ></el-button>
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
            paginationFactor: 1275,
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
            swidth:"",
            vdel:false,
            nu:0,
            vstart:"",
            vtimes:0,
            vvtimes:"",
            tool:false
   
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
        // this.vstart=this.curSelects[0].preUrl
        for (this.selected = 0; this.selected < this.curSelects.length; this.selected++) {
             this.videolist=this.curSelects[this.selected].preUrl
             this.times=this.curSelects[this.selected].duration
             this.vvtimes=this.secTotime(this.times/1000) 
             this.items.push({url:this.videolist,id:this.selected,dur:this.vvtimes})
                 
              
        }

        
        this.curwidth=this.curSelects.length-1
        if(this.curSelects.length>0){
             if(this.curSelects[this.curwidth].width=="1080" ){
                this.setbox=true
            }
            this.vstart=this.items[0].url
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
        secTotime(s) {
            var t
            if(s > -1){
                var hour = Math.floor(s/3600)
                var min = Math.floor(s/60) % 60
                var sec = s % 60
                if(hour < 10) {
                    t = '0'+ hour + ":"
                } else {
                    t = hour + ":"
                }
                if(min < 10){
                    t += "0"
                }
                    t += min + ":"
                if(sec < 10){
                    t += "0"
                }
                t += sec.toFixed(0)
            }
            return t
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
        alldel(index){
          this.$confirm('是否删除全部已添加视频, ', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                for (var inds = 0; inds < this.curSelects.length; inds++) { 
                    // Object.keys(this.curSelects[inds]).forEach(key => (this.curSelects[inds][key] = ''));
                    this.curSelects.splice(inds,this.curSelects.length)
                    this.reload()
                    
                }
                console.log("删除成功")
                });  
                

               
            
            
        },
         bigplay(index){
            var f=document.getElementsByClassName("main")[0]
            var u=this.items[index].url
            f.setAttribute("src",u) 
            this.nu=index
            if(this.curSelects.length>0){
                if(this.curSelects[index].width=="1920" ){
                    this.setbox=false
                }
                else if(this.curSelects[index].width=="1080"){
                    this.setbox=true
                }
                if (this.values==true) {
                    this.addwater()
                } 
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
                    this.reload()     
                }       
            })
           
        },
        titleset(){ 
            this.$refs.titleTailSet.show({canEdit:this.isAdministrator},(data)=>{  
                this.waterurl=JSON.parse(data.templateData)
                this.tlListTT.isSelected==true
                if(this.waterurl.TitleTail.length==1&&(this.curSelects.length>0)){
                    //  this.waterimg=this.waterurl.TitleTail[0].PreviewUrl
                    //  this.waterposx=this.waterurl.TitleTail[0].Pos.x
                    //  this.waterposy=this.waterurl.TitleTail[0].Pos.y
                    //  this.waterposw=this.waterurl.TitleTail[0].Pos.width
                    //  this.waterposh=this.waterurl.TitleTail[0].Pos.height
                    //  this.wimg=true
                    if(this.setbox==false){
                        this.waterimg=this.waterurl.TitleTail[0].PreviewUrl
                        this.waterposx=this.waterurl.TitleTail[0].Pos.x
                        this.waterposy=this.waterurl.TitleTail[0].Pos.y
                        this.waterposw=this.waterurl.TitleTail[0].Pos.width
                        this.waterposh=this.waterurl.TitleTail[0].Pos.height
                        this.wimg=true 
                    } 
                    if(this.setbox==true){
                        this.waterimg=this.waterurl.TitleTail[0].PreviewUrl
                        this.waterposx=this.waterurl.TitleTail[0].Pos.x-0.14
                        this.waterposy=this.waterurl.TitleTail[0].Pos.y+0.01
                        this.waterposw=this.waterurl.TitleTail[0].Pos.width-0.2
                        this.waterposh=this.waterurl.TitleTail[0].Pos.height-0.02
                        this.wimg=true 
                    }
                     
                }else if(this.waterurl.TitleTail.length==3&&(this.curSelects.length>0)){
                    this.headvideo=this.waterurl.TitleTail[0].PreviewUrl
                    this.tailvideo=this.waterurl.TitleTail[1].PreviewUrl
                    document.getElementsByClassName("nochange")[0].setAttribute("class","ischange")
                    this.signal=document.getElementsByClassName("ischange")[0].getAttribute("class")
                    if(this.setbox==false){
                        this.waterimg=this.waterurl.TitleTail[2].PreviewUrl
                        this.waterposx=this.waterurl.TitleTail[2].Pos.x
                        this.waterposy=this.waterurl.TitleTail[2].Pos.y
                        this.waterposw=this.waterurl.TitleTail[2].Pos.width
                        this.waterposh=this.waterurl.TitleTail[2].Pos.height
                        this.wimg=true 
                    } 
                    if(this.setbox==true){
                        this.waterimg=this.waterurl.TitleTail[2].PreviewUrl
                        this.waterposx=this.waterurl.TitleTail[2].Pos.x-0.14
                        this.waterposy=this.waterurl.TitleTail[2].Pos.y+0.01
                        this.waterposw=this.waterurl.TitleTail[2].Pos.width-0.2
                        this.waterposh=this.waterurl.TitleTail[2].Pos.height-0.02
                        this.wimg=true 
                    }     
                            
                             
                }
                
            })
            
        },
        addwater(){
            if(this.tlListTT.isSelected!=true&&this.setbox==false&&(this.curSelects.length>0)){
                this.tlListTT=this.$store.state.appStore.tlListTT
                this.waterurl=JSON.parse(this.tlListTT[0].templateData)
                this.waterimg=this.waterurl.TitleTail[0].PreviewUrl
                this.waterposx=this.waterurl.TitleTail[0].Pos.x
                this.waterposy=this.waterurl.TitleTail[0].Pos.y
                this.waterposw=this.waterurl.TitleTail[0].Pos.width
                this.waterposh=this.waterurl.TitleTail[0].Pos.height
                this.wimg=true
               
            }
            else if(this.tlListTT.isSelected!=true&&this.setbox==true&&(this.curSelects.length>0)){
                this.tlListTT=this.$store.state.appStore.tlListTT
                this.waterurl=JSON.parse(this.tlListTT[4].templateData)
                this.waterimg=this.waterurl.TitleTail[0].PreviewUrl
                this.waterposx=this.waterurl.TitleTail[0].Pos.x-0.15
                this.waterposy=this.waterurl.TitleTail[0].Pos.y-0.03
                this.waterposw=this.waterurl.TitleTail[0].Pos.width-0.15
                this.waterposh=this.waterurl.TitleTail[0].Pos.height+0.01
                this.wimg=true
                
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
        },
        set_show(index){
            document.getElementsByClassName("card-carousel--card")[index].getElementsByTagName("div")[0].setAttribute("style","display:block;")
            document.getElementsByClassName("card-carousel--card")[index].getElementsByClassName("vinfo")[0].setAttribute("style","display:block;") 
            
        },
        move_show(index){
            document.getElementsByClassName("card-carousel--card")[index].getElementsByTagName("div")[0].setAttribute("style","display:none;")
            document.getElementsByClassName("card-carousel--card")[index].getElementsByClassName("vinfo")[0].setAttribute("style","display:none;")
        }
       
        

            
    }   
}
</script>


<style lang="scss" scoped src="../../edit.scss">

</style>