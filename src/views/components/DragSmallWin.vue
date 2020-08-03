<template>
    <div class="drag-small-win" :style="{width:winWidth+'px',height:winHeight+'px'}">
        <div class="drag-resize" @mousedown="resizeMouseDownHandler">
        </div>
        <div class="drag-mouse" @mousedown="dragMouseDownHandler">
        </div>
        <div class="drag-tool">
            <div class="drag-title">
                小窗
            </div>
            <div class="drag-close" @click="closeHandler">
                <i class="el-icon-close"></i>
            </div>
        </div>
        <div class="drag-container">
            <div class="drag-con" ref="Con" :style="transformScale">
            </div>
        </div>
    </div>
</template>

<script>
import Utils from '../../libs/Utils';
const marginBL = 50;
export default {
    name:'dargsmallwin',
    data (){
        return {
            minWinWidth:320,
            // winWidth:320,
            // winHeight:180,
            winWidth:544,
            winHeight:306,
            scale:544/640,
        }
    },
    created(){
        let smallWinConfig = window.localStorage.getItem('smallWin');
        if(smallWinConfig){
            let config = JSON.parse(smallWinConfig);
            this.winWidth = config.winWidth;
            this.winHeight = config.winHeight;
            this.scale = this.winWidth/640;
        }
    },
    mounted(){
        this.$el.style.left = (document.body.offsetWidth-this.winWidth-marginBL)+'px';
        this.$el.style.top = (document.body.offsetHeight-this.winHeight-marginBL)+'px';
        this.hide();
    },
    computed:{
        transformScale(){
            return 'transform:scale('+this.scale+');'
        }
    },
    methods:{
        show(dom){
            let maxLeft = (document.body.offsetWidth-this.winWidth-marginBL);
            let maxTop = (document.body.offsetHeight-this.winHeight-marginBL);
            let nowX = parseInt(this.$el.style.left);
            let nowY = parseInt(this.$el.style.top);
            if(nowX > maxLeft || nowY > maxTop){
                this.$el.style.left = maxLeft+'px';
                this.$el.style.top = maxTop+'px';
            }
            document.body.appendChild(this.$el);
            this.$el.style.zIndex = Utils.getMaxZindex();
            this.$refs.Con.appendChild(dom);
            
        },
        hide(){
            this.$el.remove();
        },
        resizeMouseDownHandler(event){
            let e = event ? event : window.event;
            e.preventDefault();
            e.stopPropagation();

            document.addEventListener('mousemove',mousemoveHandler);
            document.addEventListener('mouseup',mouseupHandler);

            let self = this;
            let recordW =  this.winWidth;
            // let recordH =  this.winHeight;
            let recordMX = e.clientX;
            // let recordMY = e.clientY;

            function mousemoveHandler(event){
                event.preventDefault();
                event.stopPropagation();

                // let addWH = event.clientX-recordMX;
                let willW = recordW + (Math.min(document.body.offsetWidth,event.clientX)-recordMX);
                willW = Math.max(willW,self.minWinWidth);
                let willH = willW*9/16;
                self.winWidth = willW;
                self.winHeight = willH;
                self.scale = willW/640;
            }

            function mouseupHandler(event){
                event.preventDefault();
                event.stopPropagation();

                window.localStorage.setItem('smallWin',JSON.stringify({
                    winWidth:self.winWidth,
                    winHeight:self.winHeight
                }))

                document.removeEventListener('mousemove',mousemoveHandler);
                document.removeEventListener('mouseup',mouseupHandler);


            }
        },
        dragMouseDownHandler(event){
            let e = event ? event : window.event;
            e.preventDefault();
            e.stopPropagation();

            document.addEventListener('mousemove',mousemoveHandler);
            document.addEventListener('mouseup',mouseupHandler);

            let self = this;
            let recordX = Number(this.$el.style.left.replace('px',''));
            let recordY = Number(this.$el.style.top.replace('px',''));
            let recordMX = e.clientX;
            let recordMY = e.clientY;


            function mousemoveHandler(event){
                event.preventDefault();
                event.stopPropagation();
                let x = recordX+(event.clientX-recordMX);
                let y = recordY+(event.clientY-recordMY);
                x = Math.max(0,Math.min(document.body.offsetWidth-self.winWidth,x));
                y = Math.max(0,Math.min(document.body.offsetHeight-self.winHeight,y));
                self.$el.style.left = x+'px';
                self.$el.style.top = y+'px';
            }

            function mouseupHandler(event){
                event.preventDefault();
                event.stopPropagation();

                document.removeEventListener('mousemove',mousemoveHandler);
                document.removeEventListener('mouseup',mouseupHandler);


            }
        },
        closeHandler(){
            this.hide();
            this.$emit('close')
        }
    }
}
</script>

<style lang="scss" scoped>
.drag-small-win{
    width: 320px;
    height: 180px;
    position: absolute;

    .drag-resize{
        position: absolute;
        bottom: 0px;
        right: 0px;
        z-index: 4;
        width: 16px;
        height: 16px;
        cursor: se-resize;
        overflow: hidden;

        &:before,&:after{
            content: '';
            position: absolute;
            left: 11px;
            width: 5px;
            height: 20px;
            border: 1px solid #1d1d1d;
            transform: rotate(45deg);
        }
        &:after{
            left: 7px;
        }
    }

    .drag-mouse{
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0px;
        top: 0px;
        z-index: 3;
        cursor: move;
    }

    .drag-tool{
        width: 100%;
        height: 30px;
        position: absolute;
        left: 0px;
        top: 0px;
        z-index: 4;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .drag-title{
            color: #c0c0c0;
            font-size: 14px;
            margin-left: 10px;
            background: rgba(0,0,0,0.5);
            padding: 2px 5px;
            border-radius: 4px;
            visibility: hidden;
        }

        .drag-close{
            width: 16px;
            height: 16px;
            margin: 5px;
            cursor: pointer;
            color: #1d1d1d;
        }
    }

    .drag-container{
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0px;
        top: 0px;
        z-index: 1;
        background-color: rgb(0, 0, 0);

        .drag-con{
            width: 640px;
            height: 360px;
            display: flex;
            justify-content: center;
            align-items: center;
            transform: scale(0.5);
            transform-origin: 0 0 0;
        }
    }
}
</style>