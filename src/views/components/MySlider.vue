<template>
    <div class="my-slider" @mousedown="mousedownHandler">
        <div class="mslider-bg"></div>
        <div class="mslider-progress" :style="{width:pixelPer}"></div>
        <div class="mslider-key" :style="{left:pixelPer}"  @mousedown="mousedownHandler"></div>
    </div>
</template>

<script>
export default {
    props:{
        value:{
            type:Number,
            default: 0
        },
        hiddenKey:{
            type:Boolean,
            default:false
        },
        goes:{
            required:true
        }
    },
    
    data(){
        return {
            sliderValue:0,
            isMouseDown: false
        }
    },
    computed:{
        pixelPer(){
            return this.sliderValue*100+'%';
        }
    },
    watch:{
        value:{
	        deep: true,
            handler:function (newVal,oldVal){
                this.sliderValue = newVal;
                
            }
        },
    },
    methods:{
        setValue(v){
            this.sliderValue = Math.min(1,Math.max(0,v));
            
        },
        mousedownHandler(event){
            let e = event ? event : window.event;
            e.preventDefault();
            e.stopPropagation();
            let self = this;
            self.isMouseDown = true;
            let mouseX = this.$el.getBoundingClientRect().left;//event.clientX;
            let rootW = this.$el.offsetWidth;
            let recordX = event.clientX;
            let record = this.currentTime;
           
            document.addEventListener("mousemove",bodymousemove);
            document.addEventListener("mouseup",bodymouseup);

            self.sliderValue = Math.min(1,Math.max(0,(event.clientX-mouseX)/rootW));
            self.$emit('value_change',self.sliderValue)
            
            function bodymousemove(event){
                event.preventDefault();
                event.stopPropagation();
               
                let willX = event.clientX-mouseX;//+recodeX;
                self.sliderValue = Math.min(1,Math.max(0,willX/rootW));
                self.$emit('value_change',self.sliderValue)
            }

            function bodymouseup(event){
                event.preventDefault();
                event.stopPropagation();
                document.removeEventListener("mousemove",bodymousemove);
                document.removeEventListener("mouseup",bodymouseup);
                self.isMouseDown = false;
            }
        }
    }
}
</script>


<style lang="scss" scoped>
.my-slider{
    width: 100%;
    height: 100%;
    position: relative;
    cursor: pointer;

    .mslider-bg{
        width: 100%;
        height: 100%;
        background-color: #E4E7ED;
        position: absolute;
        z-index: 1;
        left: 0;
        top: 0;
    }

    .mslider-progress{
        width: 50%;
        height: 100%;
        background-color: #409EFF;
        position: absolute;
        z-index: 2;
        left: 0;
        top: 0;
    }

    .mslider-key{
        height: 100%;
        position: absolute;
        z-index: 3;
        display: flex;
        align-items: center;
        &:before{
            content: '';
            position: absolute;
            width: 12px;
            height: 12px;
            background-color: #FFF;
            border-radius: 50%;
            box-shadow: 0px 0px 4px #4e4e4e;
            transform: translate(-7px,0px);
        }
    }
    .mslider-key.hidden{
        display: none;
    }
}
</style>