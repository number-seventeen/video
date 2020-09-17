<template>
  <div>
      <div class="sort-box" >
        <div class="vlists" :class="{'vchoose':numbers==index}" v-for="(v,index) in varr" :key="index"  draggable="true"
            @dragstart="handleDragStart($event, index,v)"
            @dragover.prevent="handleDragOver($event, index,v)"
            @dragenter="handleDragEnter($event, index,v)"
            @dragend="handleDragEnd($event, index,v)" 
            @mousedown="changesort(index)"
            :style="{ transform: 'translateY' + '(' + currentOffset + 'px' + ')'}">
            <div class="biaohao">{{v.id+1}}</div>
            <video :src="v.url"  class="choosens" style="width: 155px;height: 100px; object-fit:fill; margin-top:2px; margin-left:2px;" ></video> 
        </div>  
      </div>

  </div>
</template>

<script>
export default {
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
            currentOffset: 0,
            paginationFactor: 130,

        }
    },
    mounted(){
        this.curSelects = this.$store.state.appStore.curSelects;
        for (this.choosed = 0; this.choosed < this.curSelects.length; this.choosed++) {
             this.vlist=this.curSelects[this.choosed].preUrl
            //  this.times=this.curSelects[this.choosed].duration
            //  this.vvtimes=this.secTotime(this.times/1000) 
            //  this.titie=this.curSelects[this.choosed].title
             this.varr.push({url:this.vlist,id:this.choosed})
                    
        }
    },
    watch:{
        // n:{
	    //     deep: true,
        //     handler:function (newVal,oldVal){
        //         this.n = newVal+oldVal;
                
        //     }
        // },
    },
    methods:{
        handleDragStart(e,index,v){
            this.dragging = v;
            
        },
        handleDragEnd(e,index,v){
            this.dragging.id=this.cc
            this.dragging = null
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
            
            if(dc-e.clientY<=20){
                this.moveCarousel(1,e)

            }
            else if(src>dst){
                this.moveCarousel(-1,e) 
            }
            this.cc=newItems.indexOf(v)
            newItems.splice(dst, 0, ...newItems.splice(src, 1))
            this.numbers=index
            this.varr = newItems
        },
        changesort(index){
            this.numbers=index
           
        },
        moveCarousel(direction,e) {
        // Find a more elegant way to express the :style. consider using props to make it truly generic
            if (direction === 1 ) {
                this.currentOffset -= this.paginationFactor;
            } else if (direction === -1&&this.currentOffset<0) {
                this.currentOffset += this.paginationFactor;
            }
            
        },
       
























        
        
    }
}
</script>

<style lang="scss" scoped src="../../sort.scss">

</style>