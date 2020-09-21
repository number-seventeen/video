<template>
  <div class="sort_vue" >
      <div class="sorts">
        <div class="sort-title"></div>
        <div class="sort-titles"></div>
        <div class="sort-box" >
            <div class="vlists" :class="{'vchoose':numbers==index}" v-for="(v,index) in varr" :key="index"  draggable="true"
                @dragstart="handleDragStart($event, index,v)"
                @dragover.prevent="handleDragOver($event, index,v)"
                @dragenter="handleDragEnter($event, index,v)"
                @dragend="handleDragEnd($event, index,v)" 
                @mousedown="changesort(index)">
                <div class="biaohao">{{v.id+1}}</div>
                <video :src="v.url"  class="choosens" style="width: 155px;height: 100px; object-fit:fill; margin-top:2px; margin-left:2px;" ></video> 
            </div>  
        </div>
        <div class="changesort">
            <div class="left-button" ><el-button size="medium" @click="sback()">返回</el-button></div><div class="right-button" ><el-button size="medium" @click="ssure()">确定</el-button></div>
        </div>
      </div>

  </div>
</template>

<script>
export default {
    props:{
        vsort:{
            required:true
        }
    },
    data(){
        return{
            choosed:0,
            vlist:"",
            varr:[],
            numbers:0,
            newindex:0,
            willX:0,
            n:0,
            dragging:null,//被拖拽的对象
            target:null,//目标对象
            cc:0,
            timer:null,
            nos:false,
            stime:0,
            sstimes:null,
            stitle:'',

        }
    },
   
    beforeDestroy() {
        clearInterval(this.timer);        
        this.timer = null;
    },
    mounted(){
        this.curSelects = this.$store.state.appStore.curSelects;
        for (this.choosed = 0; this.choosed < this.curSelects.length; this.choosed++) {
             this.vlist=this.curSelects[this.choosed].preUrl
             this.stime=this.curSelects[this.choosed].duration
             this.sstimes=this.secTotime(this.stime/1000) 
             this.stitie=this.curSelects[this.choosed].title
             this.swidth=this.curSelects[this.choosed].width
             this.varr.push({url:this.vlist,id:this.choosed,dur:this.stimes,title:this.stitie,dd:this.stime,width:this.swidth})
                    
        }
    },
    
    methods:{
        handleDragStart(e,index,v){
            this.dragging = v;
            console.log("n",this.varr[0].dd)
            
            
        },
        handleDragEnd(e,index,v){
            this.dragging.id=this.cc
            this.dragging = null
            console.log("o",this.varr[0].dd)
            
            
        },
        handleDragOver(e) {
            e.dataTransfer.dropEffect = 'move'// e.dataTransfer.dropEffect="move";//在dragenter中针对放置目标来设置!
        },
        handleDragEnter(e,index,v){
            e.dataTransfer.effectAllowed = "move"//为需要移动的元素设置dragstart事件
            if(v === this.dragging){
            return
            }
            const newItems = [...this.varr]
            const src = newItems.indexOf(this.dragging)//被拖拽元素
            const dst = newItems.indexOf(v)//拖拽时经过的元素
            // console.log("ddd",dst)
            if(src<dst){
                v.id=v.id-1   
            }   
            else if(src>dst){
                v.id=v.id+1
            }
            var m=this.varr.length
            // console.log(document.getElementsByClassName("vlists")[m-1].offsetTop)
            // console.log(document.getElementsByClassName("vlists")[0].offsetTop)
            var dc=document.getElementsByClassName("sort-box")[0].clientHeight-115
            // console.log("guygy",document.getElementsByClassName("sort-box")[0].scrollHeight)
            if(dc-e.clientY<=10){
                this.timer=setInterval(this.mousemove(1),500)
                clearInterval(this.timer)     
            }
          
            else if(dc-e.clientY>350){
                this.timer=setInterval(this.mousemove(-1),500)
                clearInterval(this.timer)  
            }
            this.cc=newItems.indexOf(v)
            newItems.splice(dst, 0, ...newItems.splice(src, 1))
            this.numbers=index
            this.varr = newItems
        },
        changesort(index){
            this.numbers=index
           
        },
        mousemove(e){
            if(e===1){
                document.getElementsByClassName("sort-box")[0].scrollTop=document.getElementsByClassName("sort-box")[0].scrollTop+80
                document.getElementsByClassName("sort-box")[0].onscroll=function(){
                    console.log("hao")
                } 
            }
            else if(e===-1){
                document.getElementsByClassName("sort-box")[0].scrollTop=document.getElementsByClassName("sort-box")[0].scrollTop-80
                document.getElementsByClassName("sort-box")[0].onscroll=function(){
                    console.log("haobuhao")
                } 
            }
           
            
        },
        sback(){
            this.nos=false
            this.$emit("ssort",this.nos)
        },
        ssure(){
            this.nos=false
            this.$emit("havesort",this.varr)
            console.log(this.varr)
            this.$emit("ssort",this.nos)
            
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
           
        
    }
}
</script>

<style lang="scss" scoped src="../../sort.scss">

</style>