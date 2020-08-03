<template>
    <div class="mydef-tool absolute">
        <div class="mydef-mask absolute"
        :style="{'border-left-width':borderLeft,'border-right-width':borderRight,'border-top-width':borderTop,'border-bottom-width':borderBottom}">
        </div>
        <div class="mydef-tool-child absolute" 
        :style="{'left':defPos.x+'px','top':defPos.y+'px','width':defPos.w+'px','height':defPos.h+'px'}"
        moveType="0" 
        @mousedown="btnsMouseDownHandler">
            <div class="mintool min-left-top absolute" moveType="1" @mousedown="btnsMouseDownHandler"></div>
            <div class="mintool min-left-center absolute" moveType="2" @mousedown="btnsMouseDownHandler"></div>
            <div class="mintool min-left-bottom absolute" moveType="3" @mousedown="btnsMouseDownHandler"></div>
            <div class="mintool min-center-top absolute" moveType="4" @mousedown="btnsMouseDownHandler"></div>
            <div class="mintool min-center-bottom absolute" moveType="5" @mousedown="btnsMouseDownHandler"></div>
            <div class="mintool min-right-top absolute" moveType="6" @mousedown="btnsMouseDownHandler"></div>
            <div class="mintool min-right-center absolute" moveType="7" @mousedown="btnsMouseDownHandler"></div>
            <div class="mintool min-right-bottom absolute" moveType="8" @mousedown="btnsMouseDownHandler"></div>
            <!-- <div class="mintool min-bg-drag absolute"></div> -->
        </div>
    </div>
</template>

<script>
export default {
    name:'mydef-tool',
    props:{
        scaleWH:{
            type:String,
            default:'0:0'
        },
        useCtrlScale:{
            type:Boolean,
            default:false
        },
        minLimitWH:{
            type:String,
            default:'16:16'
        },
        minLimitScale:{
            type:Number,
            default:0
        }
    },
    data (){
        return {
            limitPos:{
                x:0,
                y:0,
                w:0,
                h:0
            },
            defPos:{
                x:0,
                y:0,
                w:0,
                h:0
            },
            scalePos:{
                x:0,
                y:0,
                w:1,
                h:1
            },
            scaleW:0,
            scaleH:0,
            minLimitW:16,
            minLimitH:16,
            ctrlKey:false,
        }
    },
    computed:{
        borderLeft(){
            return this.defPos.x+'px';
        },
        borderRight(){
            return (this.limitPos.w-this.defPos.w-this.defPos.x)+'px';
        },
        borderTop(){
            return this.defPos.y+'px';
        },
        borderBottom(){
            return (this.limitPos.h-this.defPos.h-this.defPos.y)+'px';
        }
    },
    watch:{
        minLimitWH:{
            deep:true,
            handler(newVal){
                let arr = newVal.split(':');
                this.minLimitW = parseInt(arr[0]);
                this.minLimitH = parseInt(arr[1]);
            }
        }
    },
    created(){
        document.addEventListener('keydown',this.keydownHandler);
        document.addEventListener('keyup',this.keydownHandler);
    },
    destroyed(){
        document.removeEventListener('keydown',this.keydownHandler);
        document.removeEventListener('keyup',this.keydownHandler);
    },
    mounted(){
        this.limitPos.w = this.$el.offsetWidth;
        this.limitPos.h = this.$el.offsetHeight;
        if(this.minLimitScale > 0){
            this.minLimitW = this.minLimitScale * this.limitPos.w;
            this.minLimitH = this.minLimitScale * this.limitPos.h;
        }

        this.defPos = Object.assign(this.defPos,this.limitPos);
        const resizeObserver = new ResizeObserver(this.resizeChangeWH);
        resizeObserver.observe(this.$el);
    },
    methods:{
        resizeChangeWH(entries){
			// console.log(entries)
            for (let entry of entries) {
                if(entry.target == this.$el){
                    
                    this.limitPos.w = entry.contentRect.width;//this.$el.offsetWidth;
                    this.limitPos.h = entry.contentRect.height;//this.$el.offsetHeight;

                    this.defPos.x = this.scalePos.x * this.limitPos.w;
                    this.defPos.y = this.scalePos.y * this.limitPos.h;
                    this.defPos.w = this.scalePos.w * this.limitPos.w;
                    this.defPos.h = this.scalePos.h * this.limitPos.h;

                    if(this.minLimitScale > 0){
                        this.minLimitW = this.minLimitScale * this.limitPos.w;
                        this.minLimitH = this.minLimitScale * this.limitPos.h;
                    }
                }
            }
        },
        btnsMouseDownHandler(event) {
            let e = event ? event : window.event;
            e.preventDefault();
            e.stopPropagation();

            let self = this;
            let moveType = parseInt(e.target.getAttribute('movetype'));//0为移动
            // console.log('moveType',moveType)
            let mouseX = e.clientX,mouseY = e.clientY;
            let beforePos = Object.assign({},self.defPos);

            let arr = this.scaleWH.split(':');
            let scaleW = parseInt(arr[0]);
            let scaleH = parseInt(arr[1]);
            
            document.addEventListener('mousemove',mousemoveHandler);
            document.addEventListener('mouseup',mouseupHandler);


            function mousemoveHandler(event){
                event.preventDefault();
                if(self.useCtrlScale){
                    if(self.ctrlKey){
                        self.scaleW = scaleW;
                        self.scaleH = scaleH;
                    }else{
                        self.scaleW = 0;
                        self.scaleH = 0;
                    }
                }else{
                    self.scaleW = scaleW;
                    self.scaleH = scaleH;
                }
                self.computerPos(moveType,beforePos,event.clientX-mouseX,event.clientY-mouseY);
            }

            function mouseupHandler(event){
                event.preventDefault();

                document.removeEventListener('mousemove',mousemoveHandler);
                document.removeEventListener('mouseup',mouseupHandler);


            }
            // console.log(e.target.classList,e.target === btnLT,moveType)
        },
        /**
         * 计算最终位置
         */
        computerPos (moveType,beforePos,diffX,diffY){
            const curPos = {
                x:0,
                y:0,
                w:0,
                h:0
            }
            
            const rectPos = {
                centerx: 0,
                centery: 0,
                curx: 0,
                cury: 0
            }
            //仅移动
            if(moveType === 0){
                curPos.x = Math.max(beforePos.x + diffX,0);
                curPos.x = Math.min(this.limitPos.w - beforePos.w,curPos.x);
                curPos.y = Math.max(beforePos.y + diffY,0);
                curPos.y = Math.min(this.limitPos.h - beforePos.h,curPos.y);
                curPos.w = beforePos.w;
                curPos.h = beforePos.h;
            }
            //左上
            else if(moveType === 1){
                rectPos.centerx = beforePos.x + beforePos.w;
                rectPos.centery = beforePos.y + beforePos.h;
                rectPos.curx = beforePos.x + diffX;
                rectPos.cury = beforePos.y + diffY;
                
                let minW = this.minLimitW;
                let minH = this.minLimitH;
                curPos.w = Math.min(rectPos.centerx - rectPos.curx,rectPos.centerx);
                curPos.w = Math.max(curPos.w,minW);
                curPos.h = Math.min(rectPos.centery - rectPos.cury,rectPos.centery);
                curPos.h = Math.max(curPos.h,minH);
                if(this.scaleW > 0 && this.scaleH > 0){
                    minW = minH * this.scaleW/this.scaleH;
                    curPos.w = Math.max(curPos.w,minW);
                    curPos.w = Math.min((rectPos.centery) * this.scaleW/this.scaleH,curPos.w);
                    curPos.h = curPos.w * this.scaleH/this.scaleW;
                }

                curPos.x = rectPos.centerx - curPos.w;
                curPos.y = rectPos.centery - curPos.h;
                
            }
            //左中
            else if(moveType === 2){
                rectPos.centerx = beforePos.x + beforePos.w;
                // rectPos.centery = beforePos.y + beforePos.h/2;
                rectPos.curx = beforePos.x + diffX;
                // rectPos.cury = beforePos.y + diffY;
                
                let minW = this.minLimitW;
                let minH = this.minLimitH;
                curPos.w = Math.min(rectPos.centerx - rectPos.curx,rectPos.centerx);
                curPos.w = Math.max(curPos.w,minW);
                curPos.h = beforePos.h;
                if(this.scaleW > 0 && this.scaleH > 0){
                    minW = minH * this.scaleW/this.scaleH;
                    curPos.w = Math.max(curPos.w,minW);
                    curPos.w = Math.min((this.limitPos.h - beforePos.y) * this.scaleW/this.scaleH,curPos.w);
                    curPos.h = curPos.w * this.scaleH/this.scaleW;
                }

                curPos.x = rectPos.centerx - curPos.w;
                curPos.y = beforePos.y;
            }
            //左下
            else if(moveType === 3){
                rectPos.centerx = beforePos.x + beforePos.w;
                rectPos.centery = beforePos.y;
                rectPos.curx = beforePos.x + diffX;
                rectPos.cury = beforePos.y + beforePos.h + diffY;

                let minW = this.minLimitW;
                let minH = this.minLimitH;
                curPos.w = Math.min(rectPos.centerx - rectPos.curx,rectPos.centerx);
                curPos.w = Math.max(curPos.w,minW);
                curPos.h = Math.min(rectPos.cury - rectPos.centery,this.limitPos.h - rectPos.centery);
                curPos.h = Math.max(curPos.h,minH);
                if(this.scaleW > 0 && this.scaleH > 0){
                    minW = minH * this.scaleW/this.scaleH;
                    curPos.w = Math.max(curPos.w,minW);
                    curPos.w = Math.min((this.limitPos.h - rectPos.centery) * this.scaleW/this.scaleH,curPos.w);
                    curPos.h = curPos.w * this.scaleH/this.scaleW;
                }

                curPos.x = rectPos.centerx - curPos.w;
                curPos.y = rectPos.centery;
            }
            //中上
            else if(moveType === 4){
                rectPos.centery = beforePos.y + beforePos.h;
                rectPos.cury = beforePos.y + diffY;
                
                let minW = this.minLimitW;
                let minH = this.minLimitH;
                curPos.h = Math.min(rectPos.centery - rectPos.cury,rectPos.centery);
                curPos.h = Math.max(curPos.h,minH);
                curPos.w = beforePos.w;
                if(this.scaleW > 0 && this.scaleH > 0){
                    minH = minH * this.scaleH/this.scaleW;
                    curPos.h = Math.max(curPos.h,minH);
                    curPos.h = Math.min( (this.limitPos.w - beforePos.x) * this.scaleH/this.scaleW,curPos.h);
                    curPos.w = curPos.h * this.scaleW/this.scaleH;
                }

                curPos.x = beforePos.x;
                curPos.y = rectPos.centery - curPos.h;
            }
            //中下
            else if(moveType === 5){
                rectPos.centery = beforePos.y;
                rectPos.cury = beforePos.y  + beforePos.h + diffY;
                
                let minW = this.minLimitW;
                let minH = this.minLimitH;
                curPos.h = Math.min(rectPos.cury - rectPos.centery,this.limitPos.h - rectPos.centery);
                curPos.h = Math.max(curPos.h,minH);
                curPos.w = beforePos.w;
                if(this.scaleW > 0 && this.scaleH > 0){
                    minH = minH * this.scaleH/this.scaleW;
                    curPos.h = Math.max(curPos.h,minH);
                    curPos.h = Math.min( (this.limitPos.w - beforePos.x) * this.scaleH/this.scaleW,curPos.h);
                    curPos.w = curPos.h * this.scaleW/this.scaleH;
                }

                curPos.x = beforePos.x;
                curPos.y = beforePos.y;
            }
            //右上
            else if(moveType === 6){
                rectPos.centerx = beforePos.x;
                rectPos.centery = beforePos.y + beforePos.h;
                rectPos.curx = beforePos.x + beforePos.w + diffX;
                rectPos.cury = beforePos.y + diffY;

                let minW = this.minLimitW;
                let minH = this.minLimitH;
                curPos.w = Math.min(rectPos.curx - rectPos.centerx,this.limitPos.w - rectPos.centerx);
                curPos.w = Math.max(curPos.w,minW);
                curPos.h = Math.min(rectPos.centery - rectPos.cury,rectPos.centery);
                curPos.h = Math.max(curPos.h,minH);
                if(this.scaleW > 0 && this.scaleH > 0){
                    minW = minH * this.scaleW/this.scaleH;
                    curPos.w = Math.max(curPos.w,minW);
                    curPos.w = Math.min((rectPos.centery) * this.scaleW/this.scaleH,curPos.w);
                    curPos.h = curPos.w * this.scaleH/this.scaleW;
                }

                curPos.x = rectPos.centerx;
                curPos.y = rectPos.centery - curPos.h;
            }
            //右中
            else if(moveType === 7){
                rectPos.centerx = beforePos.x;
                // rectPos.centery = beforePos.y + beforePos.h/2;
                rectPos.curx = beforePos.x + beforePos.w + diffX;
                // rectPos.cury = beforePos.y + diffY;
                
                let minW = this.minLimitW;
                let minH = this.minLimitH;
                curPos.w = Math.min(rectPos.curx - rectPos.centerx,this.limitPos.w - rectPos.centerx);
                curPos.w = Math.max(curPos.w,minW);
                curPos.h = beforePos.h;
                if(this.scaleW > 0 && this.scaleH > 0){
                    minW = minH * this.scaleW/this.scaleH;
                    curPos.w = Math.max(curPos.w,minW);
                    curPos.w = Math.min((this.limitPos.h - beforePos.y) * this.scaleW/this.scaleH,curPos.w);
                    curPos.h = curPos.w * this.scaleH/this.scaleW;
                }

                curPos.x = rectPos.centerx;
                curPos.y = beforePos.y;
            }
            //右下
            else if(moveType === 8){
                rectPos.centerx = beforePos.x;
                rectPos.centery = beforePos.y;
                rectPos.curx = beforePos.x + beforePos.w + diffX;
                rectPos.cury = beforePos.y + beforePos.h + diffY;
                curPos.x = beforePos.x;
                curPos.y = beforePos.y;

                let minW = this.minLimitW;
                let minH = this.minLimitH;
                curPos.w = Math.min(rectPos.curx - rectPos.centerx,this.limitPos.w-rectPos.centerx);
                curPos.w = Math.max(curPos.w,minW);
                curPos.h = Math.min(rectPos.cury - rectPos.centery,this.limitPos.h-rectPos.centery);
                curPos.h = Math.max(curPos.h,minH);
                if(this.scaleW > 0 && this.scaleH > 0){
                    minW = minH * this.scaleW/this.scaleH;
                    curPos.w = Math.max(curPos.w,minW);
                    curPos.w = Math.min((this.limitPos.h-rectPos.centery) * this.scaleW/this.scaleH,curPos.w);
                    curPos.h = curPos.w * this.scaleH/this.scaleW;
                }
                
            }
            this.defPos = curPos;
            
            this.scalePos.x = this.defPos.x/this.limitPos.w;
            this.scalePos.y = this.defPos.y/this.limitPos.h;
            this.scalePos.w = this.defPos.w/this.limitPos.w;
            this.scalePos.h = this.defPos.h/this.limitPos.h;

            this.$emit('change',this.scalePos);
        },
        keydownHandler(event){
            // console.log('event',event)
            this.ctrlKey = event.ctrlKey;
        },
        resetPos(scalePos){
            Object.assign(this.scalePos,scalePos);
        },
        getPos(){
            return Object.assign({},this.scalePos);
        },
    }
}
</script>

<style lang="scss" scoped>
//方块宽度
$rectW: 16px;
//defmintool边框宽度
$borderW: 3px;

.absolute{
    position: absolute;
}
.mydef-tool{
    width: 100%;
    height: 100%;
    // border: 1px solid #000;
    position: absolute;

    .mydef-mask{
        width: 100%;
        height: 100%;
        border-style: solid;
        border-color: rgba(0,0,0,0.5);
    }

    .mydef-tool-child {
        z-index: 30;
        width: 100%;
        height: 100%;
        // border: 1px dashed #ffffff;
        border: 1px solid #00c0fe;
        cursor: move;

        .mintool{
            width: $rectW;
            height: $rectW;
            // background: #000000;
            border: $borderW solid #00c0fe;
        }

        .mintool.hide{
            display: none;
        }

        // .min-bg-drag{
        //     width: 100%;
        //     height: 100%;
        //     background-color: rgba(255,0,0,0.2);
        //     border: none;
        // }

        .min-left-top{
            left: -$borderW;
            top: -$borderW;
            border-right: none;
            border-bottom: none;
            // transform: translate(-$rectW/2,-$rectW/2);
            cursor: nw-resize;
        }

        .min-left-center{
            left: -$borderW;
            top: 50%;
            transform: translate(0,-$rectW/2);
            border-top: none;
            border-right: none;
            border-bottom: none;
            cursor: w-resize;
        }

        .min-left-bottom{
            left: -$borderW;
            bottom: -$borderW;
            border-top: none;
            border-right: none;
            // transform: translate(-$rectW/2,$rectW/2);
            cursor: ne-resize;
        }

        .min-center-top{
            left: 50%;
            top: -$borderW;
            transform: translate(-$rectW/2,0);
            border-left: none;
            border-right: none;
            border-bottom: none;
            cursor: n-resize;
        }

        .min-center-bottom{
            left: 50%;
            bottom: -$borderW;
            transform: translate(-$rectW/2,0);
            border-top: none;
            border-left: none;
            border-right: none;
            cursor: n-resize;
        }

        .min-right-top{
            left: initial;
            right: -$borderW;
            top: -$borderW;
            border-left: none;
            border-bottom: none;
            // transform: translate($rectW/2,-$rectW/2);
            cursor: ne-resize;
        }

        .min-right-center{
            left: initial;
            right: -$borderW;
            top: 50%;
            transform: translate(0,-$rectW/2);
            border-top: none;
            border-left: none;
            border-bottom: none;
            cursor: w-resize;
        }

        .min-right-bottom{
            left: initial;
            right: -$borderW;
            bottom: -$borderW;
            // transform: translate($rectW/2,$rectW/2);
            border-left: none;
            border-top: none;
            cursor: nw-resize;
        }

    }
}
    
</style>