<template>
    <div class="my-range-slider">
        <div class="range-timeline">
            <div class="range-main">
                <div class="range-canvas-box">
                    <canvas ref="rangeCanvas" class="range-canvas" @mousedown="canvasMouseDownHandler"></canvas>
                    <div class="slider-key" :style="{'left':rangeKeyLeft+'px'}"  @mousedown="canvasMouseDownHandler"></div>
                    <div class="slider-time-tip" v-show="showLeftTip" :style="{'left':(leftTipPos-15)+'px'}">{{inPointStr}}</div>
                    <div class="slider-time-tip" v-show="showRightTip" :style="{'left':(rightTipPos+5)+'px'}">{{outPointStr}}</div>
                </div>
                
                <div class="range-option">
                    <div class="range-option2" :style="{'width':rangeOption2Width+'px','left':rangeOption2Left+'px'}">
                        <div class="range-slider" :style="{'width':rangeSliderWidth+'px','left':rangeSliderLeft+'px'}">
                            <div class="slider-bg" @mousedown="ms_rangeMouseDown">
                                <div class="slider-cut-time">{{cutDuration}}</div>
                            </div>
                            <div class="slider-left" :class="{disabled:disabledInOutBar}" @mousedown="ms_rangeLeftMouseDown" @mouseover="event=>showLeftTip=true"  @mouseout="event=>showLeftTip=false"></div>
                            <div class="slider-right" :class="{disabled:disabledInOutBar}" @mousedown="ms_rangeRightMouseDown" @mouseover="event=>showRightTip=true"  @mouseout="event=>showRightTip=false"></div>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
        <div ref="scaleBar" class="range-scale-bar" v-show="hasScaleBar" @mousewheel="mousewheelHandler" @DOMMouseScroll="mousewheelHandler">
            <div ref="scrollBar" class="scroll-bar" @mousedown="scrollBarMouseDown">
                <div class="sb-bar-left" @mousedown="keyLeftMouseDown"></div>
                <div class="sb-bar-right" @mousedown="keyRightMouseDown"></div>
            </div>
        </div>
    </div>
</template>

<script>

const Utils = {
    /**
     * 传入毫秒，取得22：22：22格式
     */
    getFormatHMS(_ms){
        let sec = _ms/1000;
        
        let h = parseInt(sec/3600);
        let m = parseInt(sec/60%60);
        let s = parseInt(sec%60);
        //let ms = parseInt(_ms%1000);
        
        let result = (h<10?"0"+h:h)+":"+(m<10?"0"+m:m)+":"+(s<10?"0"+s:s);
        return result;
    }
}
const MinWidth = 60;
const keyBarWidth = 20;
export default {
    name:'my-range-slider',
    props:{
        hasScaleBar:{
            type:Boolean,
            default:true
        },
        disabledInOutBar:{
            type:Boolean,
            default:false
        }
        // duration:{
        //     type:Number,
        //     default:0
        // }
    },
    data(){
        return {
            sap_scale:1,//秒数和像素的比值1-100   //0.1-51  //最大比值0.004S比1像素
            duration:60,//视频长度
            maxsap_scale: 1/0.004,
            minsap_scale: 0.1,
            currentTime: 0,//当前播放头
            startSeconds: 0,//当前开始时间
            startSecPercentage: 0,//开始时间百分比
            areaWidth: 545,//当前显示像素宽度
            inPoint: 0, //入点
            outPoint: 60, //出点
            showLeftTip:false,
            showRightTip:false,
            rangeOption2Width:60,
            rangeOption2Left:0,
            rangeSliderWidth: 60,
            rangeSliderLeft:0,
            rangeKeyLeft:0,
        }
    },
    computed:{
        cutDuration(){
            return Utils.getFormatHMS((this.outPoint-this.inPoint)*1000);
        },
        inPointStr(){
            return Utils.getFormatHMS((this.inPoint)*1000);
        },
        outPointStr(){
            return Utils.getFormatHMS((this.outPoint)*1000);
        },
        leftTipPos(){
            return this.secondToPixel(this.inPoint-this.startSeconds);
        },
        rightTipPos(){
            return this.secondToPixel(this.outPoint-this.startSeconds);
        }
    },
    watch:{
        value:{
	        deep: true,
            handler:function (newVal,oldVal){
                this.sliderValue = newVal;
            }
        }
    },
    created(){},
    mounted(){
        this.canvas = this.$refs.rangeCanvas;
        this.ctx = this.canvas.getContext('2d');
        this.areaWidth = this.canvas.offsetWidth-keyBarWidth*2;
        this.correctScale(true);
        // this.drawTimeLine();
    },
    methods:{
        resetUI(dur,inPoint,outPoint){
            this.duration = dur;
            if(!inPoint) inPoint = 0;
            if(!outPoint) outPoint = dur;
            this.inPoint = inPoint;
            this.outPoint = outPoint;
            this.correctScale(true);
            // this.currentTime = 0;
        },
        /*
        * 秒数转像素
        * */
        secondToPixel(second){
            return this.sap_scale * second;
        },
        /*
        * 像素转秒数
        * */
        pixelToSecond(pixel){
            return pixel/this.sap_scale;
        },
        /** 校正缩放比值 */
        correctScale(b){
            if(b){
                this.minsap_scale = Math.min(this.maxsap_scale,this.areaWidth/this.duration);
                this.sap_scale = this.minsap_scale;
                this.startSeconds = 0;
                this.startSecPercentage = 0;
                this.zoomValue = 0;//1;
            }else{
                this.minsap_scale = this.areaWidth/this.duration;
                this.sap_scale = Math.max(this.minsap_scale,this.sap_scale);
                this.sap_scale = Math.min(this.maxsap_scale,this.sap_scale);
                let t1 = 1 - Math.pow((1-(this.sap_scale-this.minsap_scale)/(this.maxsap_scale-this.minsap_scale)),2);
                this.zoomValue = Math.pow(t1,1/3);
            }
            this.receivedZoomChange();
            this.receivedScaleChange();
            this.receivedStartSecChange();
        },
        /**
         * 传入 0-1 设置缩放比值
         */
        setScaleValue(v,b){
            v = Math.max(0,v);
            v = Math.min(1,v);
            this.zoomValue = v;
            let v2 = 1-Math.sqrt(1-Math.pow(v,3));
            this.sap_scale = v2*(this.maxsap_scale-this.minsap_scale)+this.minsap_scale;
            this.receivedScaleChange();
            if(b){
                this.receivedZoomChange();
            }

            
            //以time为中心点，计算开始时间位置
            let trackBodyW = this.areaWidth;
            let canShowSec = this.pixelToSecond(trackBodyW);
            let willSec = this.currentTime - canShowSec/2;
            let maxSec = this.duration - canShowSec;
            this.startSeconds = Math.max(0,willSec);
            this.startSeconds = Math.min(maxSec,this.startSeconds);
            this.startSecPercentage = maxSec==0?0:this.startSeconds/maxSec;

            this.receivedStartSecChange();
        },

        /** 设置开始时间 传入百分比 */
        setStartSecond(v) {
            v = Math.max(0,v);
            v = Math.min(1,v);
            let trackBodyW = this.areaWidth;
            let canShowSec = this.pixelToSecond(trackBodyW);
            this.startSeconds = v * (this.duration - canShowSec);
            this.startSecPercentage = v;

            this.receivedStartSecChange();
        },
        /** seek事件 */
        seek(ct,isEmit=true){
            this.currentTime = Math.max(0,Math.min(ct,this.duration));
            this.receivedUpdateCT();
            if(isEmit){
                this.$emit('seek',this.currentTime);
            }
        },
        receivedZoomChange(){

        },
        receivedScaleChange(){
            let willW = Math.max(MinWidth,(1-this.zoomValue)*this.$refs.scaleBar.offsetWidth);
            this.$refs.scrollBar.style.width = willW+'px';
            this.drawTimeLine();

            this.rangeOption2Width = this.secondToPixel(this.duration);
            this.rangeSliderWidth = this.secondToPixel(this.outPoint - this.inPoint);
            this.rangeSliderLeft = this.secondToPixel(this.inPoint);
            this.receivedUpdateCT();
        },
        receivedStartSecChange(){
            let limitW = this.$refs.scaleBar.offsetWidth-this.$refs.scrollBar.offsetWidth;
            let willX = this.startSecPercentage*limitW;
            this.$refs.scrollBar.style.left = willX+'px';

            this.rangeOption2Left = -this.secondToPixel(this.startSeconds)+keyBarWidth;
            this.drawTimeLine();
            this.receivedUpdateCT();
        },
        receivedUpdateCT(){
            this.rangeKeyLeft = this.secondToPixel(this.currentTime-this.startSeconds)+keyBarWidth;
        },
        updateInOutPoint(){
            this.rangeSliderWidth = this.secondToPixel(this.outPoint - this.inPoint);
            this.rangeSliderLeft = this.secondToPixel(this.inPoint);
        },
        /** 绘图 */
        drawTimeLine(){
            // if (st >= 0) {
            //     this.startSeconds = st;
            // }
            let selfW = this.canvas.offsetWidth;
            let selfH = this.canvas.offsetHeight || 30;
            let sap_scale = this.sap_scale;
            let startSeconds = this.startSeconds;
            let leng = (selfW-keyBarWidth*2) / this.sap_scale;
            // if (leng < 100) leng = 100;
            //刻度值为60秒到1秒之间
            let currentKd = 60 / sap_scale;
            let currentInterval = 6;
            if (currentKd % 1 != 0) {
                currentKd = Math.ceil(currentKd);
                currentInterval = sap_scale * currentKd / 10;
            }
            
            let lengNum = Math.ceil(leng / currentKd) ;
            let startX = 0;
            let startY = 20;
            let leng1 = 10;//线的高度
            let leng2 = 7;
            let leng3 = 5;
            startX = -startSeconds % currentKd * sap_scale;
            startX += keyBarWidth;
            let startX2 = startX;
            //let startSec = Math.floor(st/this.currentKd)*this.currentKd;
            let startSec = startSeconds - startSeconds % currentKd;
            //console.log("startX:"+startX);
            this.canvas.width = selfW;
            this.canvas.height = selfH;
            this.ctx.fillStyle = "#999999";
            this.ctx.strokeStyle = "#999999";
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            for (let i = 0; i < lengNum; i++) {
                let sec = currentKd * i + startSec;
                //let minuteStr = String(Math.floor(sec / 60));
                //let secondStr = String(sec % 60);
                //if (minuteStr.length == 1) minuteStr = "0" + minuteStr;
                //if (secondStr.length == 1) secondStr = "0" + secondStr;
                this.ctx.font = '12px arial';
                this.ctx.fillStyle = '#000000';
                this.ctx.textAlign = "center";
                //this.ctx.fillText(minuteStr + ":" + secondStr, startX, 12);
                this.ctx.fillText(Utils.getFormatHMS(sec*1000), startX, 12);
                this.ctx.moveTo(startX, startY);
                this.ctx.lineTo(startX, startY + leng1);
                let tempSX = startX;
                startX += currentInterval;
                if(startX >= selfW-keyBarWidth) break;
                for (let j = 1; j < 10; j++) {
                    this.ctx.moveTo(startX, startY + (leng1 - leng3));
                    this.ctx.lineTo(startX, startY + leng1);
                    startX += currentInterval;
                    if(startX >= selfW-keyBarWidth){
                        // this.ctx.fillText(Utils.getFormatHMS(leng*1000), startX, 12);
                        // this.ctx.moveTo(startX, startY);
                        // this.ctx.lineTo(startX, startY + leng1);
                        break;
                    }
                }
                this.ctx.moveTo(tempSX, 30);
                this.ctx.lineTo(startX, 30);
            }
            this.ctx.closePath();
            this.ctx.stroke();
        },
        /** 滚轮事件 */
        mousewheelHandler(event){
            // console.log(event);
            let e = event ? event : window.event;
            e.preventDefault();
            e.stopPropagation();
            let whellDelta = event.wheelDelta || (~event.detail+1);
            let zoomValue = this.zoomValue;
            let add = whellDelta>0?-0.02:0.02;
            this.setScaleValue(this.zoomValue+add,true);
        },
        /** 滚动条按下事件 */
        scrollBarMouseDown (event) {
            let e = event ? event : window.event;
            e.stopPropagation();
            e.preventDefault();

            let mouseX = e.clientX;
            let X = parseInt(this.$refs.scrollBar.style.left) || 0;
            let limitW = this.$refs.scaleBar.offsetWidth-this.$refs.scrollBar.offsetWidth;
            
            document.addEventListener("mousemove",resizemove);
            document.addEventListener("mouseup",resizeup);
            let self = this;
            function resizemove(event){
                let e = event ? event : window.event;
                e.stopPropagation();
                e.preventDefault();

                let willX = X + (e.clientX-mouseX);
                
                willX = Math.max(0,willX);
                willX = Math.min(limitW,willX);
                // self.scrollBar.style.left = willX+'px';
                let percentage = 0;
                if(limitW>0){
                    percentage = willX/limitW
                }

                self.setStartSecond(percentage);
            }

            function resizeup(event){
                event.preventDefault();
                event.stopPropagation();
                document.removeEventListener("mousemove",resizemove);
                document.removeEventListener("mouseup",resizeup);
            }
        },

        /** 左边key按下事件 */
        keyLeftMouseDown (event) {
            let e = event ? event : window.event;
            e.stopPropagation();
            e.preventDefault();

            let mouseX = e.clientX;
            let parentW = this.$refs.scaleBar.offsetWidth;
            let nowW = this.$refs.scrollBar.offsetWidth;
            
            document.addEventListener("mousemove",resizemove);
            document.addEventListener("mouseup",resizeup);

            let self = this;
            function resizemove(event){
                let e = event ? event : window.event;
                e.stopPropagation();
                e.preventDefault();

                let willW = Math.max(MinWidth,nowW-(e.clientX-mouseX));
                willW = Math.min(willW,parentW);
                let percentage = willW/parentW;
                self.setScaleValue(1-percentage,true);
            }

            function resizeup(event){
                event.preventDefault();
                event.stopPropagation();
                document.removeEventListener("mousemove",resizemove);
                document.removeEventListener("mouseup",resizeup);
            }
        },

        /** 右边key按下事件 */
        keyRightMouseDown (event) {
            let e = event ? event : window.event;
            e.stopPropagation();
            e.preventDefault();

            let mouseX = e.clientX;
            let parentW = this.$refs.scaleBar.offsetWidth;
            let nowW = this.$refs.scrollBar.offsetWidth;
            
            document.addEventListener("mousemove",resizemove);
            document.addEventListener("mouseup",resizeup);
            let self = this;
            function resizemove(event){
                let e = event ? event : window.event;
                e.stopPropagation();
                e.preventDefault();

                let willW = Math.max(MinWidth,nowW+(e.clientX-mouseX));
                willW = Math.min(willW,parentW);
                let percentage = willW/parentW;
                self.setScaleValue(1-percentage,true);
            }

            function resizeup(event){
                event.preventDefault();
                event.stopPropagation();
                document.removeEventListener("mousemove",resizemove);
                document.removeEventListener("mouseup",resizeup);
            }
        },
        /** canvas按下事件 */
        canvasMouseDownHandler(event){
            let mouseX = this.$refs.rangeCanvas.getBoundingClientRect().left;//event.clientX;
            // // let pos = this.mi_mc_tl_box.getBoundingClientRect();
            // // let recodeX = this.mi_tlthumb.position().left;
            // let limitMaxX = this.mi_mc_tl_box.innerWidth();
            event.preventDefault();
            event.stopPropagation();

            // let initx = this.rangeSliderLeft;?
            let recordX = event.clientX;
            let record = this.currentTime;
            
            document.addEventListener("mousemove",bodymousemove);
            document.addEventListener("mouseup",bodymouseup);

            this.seek(this.startSeconds+this.pixelToSecond(event.clientX-mouseX-keyBarWidth));
            let self = this;
            function bodymousemove(event){
                event.preventDefault();
                event.stopPropagation();

                // let willX = event.clientX-mouseX;//+recodeX;
                // willX = Math.max(0,willX);
                // willX = Math.min(willX,limitMaxX);

                self.seek(self.startSeconds+self.pixelToSecond(event.clientX-mouseX-keyBarWidth));
            }

            function bodymouseup(event){
                event.preventDefault();
                event.stopPropagation();
                document.removeEventListener("mousemove",bodymousemove);
                document.removeEventListener("mouseup",bodymouseup);
                
            }
        },
        /** range块按下事件 */
        ms_rangeMouseDown(event){
            event.preventDefault();
            event.stopPropagation();

            // let initx = this.rangeSliderLeft;?
            let recordX = event.clientX;
            let record = this.inPoint;
            let dur = this.outPoint - this.inPoint;
            let self = this;
            // let initx = this.mi_mc_inout[0].getBoundingClientRect().left;
            // let record = MediaInfoCore.inPoint;
            document.addEventListener("mousemove",bodymousemove);
            document.addEventListener("mouseup",bodymouseup);

            
            function bodymousemove(event){
                let e = event ? event : window.event;
                e.preventDefault();
                e.stopPropagation();
                let diff = e.clientX- recordX;//initx;
                let point = record + self.pixelToSecond(diff);
                if(point < 0) point = 0;
                point = Math.max(0,point);
                point = Math.min(point,self.outPoint);
                self.inPoint = point;
                self.outPoint = point + dur;
                if(self.outPoint > self.duration){
                    self.outPoint = self.duration;
                    self.inPoint = self.duration - dur;
                }

                self.updateInOutPoint();
                self.seek(self.inPoint);
            }

            function bodymouseup(event){
                event.preventDefault();
                event.stopPropagation();
                document.removeEventListener("mousemove",bodymousemove);
                document.removeEventListener("mouseup",bodymouseup);
                
            }
        },
        /** range块左边按下事件 */
        ms_rangeLeftMouseDown(event){
            if(this.disabledInOutBar) return;
            event.preventDefault();
            event.stopPropagation();

            // let initx = this.rangeSliderLeft;?
            let recordX = event.clientX;
            let record = this.inPoint;
            let self = this;
            // let initx = this.mi_mc_inout[0].getBoundingClientRect().left;
            // let record = MediaInfoCore.inPoint;
            document.addEventListener("mousemove",bodymousemove);
            document.addEventListener("mouseup",bodymouseup);

            
            function bodymousemove(event){
                let e = event ? event : window.event;
                e.preventDefault();
                e.stopPropagation();
                let diff = e.clientX- recordX;//initx;
                let point = record + self.pixelToSecond(diff);
                if(point < 0) point = 0;
                point = Math.max(0,point);
                point = Math.min(point,self.outPoint);
                self.inPoint = point;

                self.updateInOutPoint();
                self.seek(self.inPoint);
            }

            function bodymouseup(event){
                event.preventDefault();
                event.stopPropagation();
                document.removeEventListener("mousemove",bodymousemove);
                document.removeEventListener("mouseup",bodymouseup);
                
            }
        },
        /** range块右边按下事件 */
        ms_rangeRightMouseDown(event){
            if(this.disabledInOutBar) return;
            event.preventDefault();
            event.stopPropagation();

            // let initx = this.mi_mc_inout[0].getBoundingClientRect().left+this.mi_mc_inout.width();
            // let record = MediaInfoCore.outPoint;
            let recordX = event.clientX;
            let record = this.outPoint;
            document.addEventListener("mousemove",bodymousemove);
            document.addEventListener("mouseup",bodymouseup);

            let self = this;
            function bodymousemove(event){
                let e = event ? event : window.event;
                e.preventDefault();
                e.stopPropagation();
                let diff = e.clientX- recordX;
                let point = record + self.pixelToSecond(diff);
                if(point < self.inPoint) point = self.inPoint;
                self.outPoint = Math.min(point,self.duration);
                self.updateInOutPoint();
                self.seek(self.outPoint);
            }

            function bodymouseup(event){
                event.preventDefault();
                event.stopPropagation();

                document.removeEventListener("mousemove",bodymousemove);
                document.removeEventListener("mouseup",bodymouseup);
                
            }
        }
    }
}
</script>


<style lang="scss" scoped>
.my-range-slider{
    width: 100%;
    // height: 100%;
    position: relative;
    user-select: none;
    // cursor: pointer;

    .range-timeline{
        width: 100%;
        // height: 60px;
        // background-color: #E4E7ED;

        .range-main{
            width: 100%;
            height: 100%;
            position: relative;
            overflow: hidden;

            

            .range-canvas-box{
                width: 100%;
                height: 30px;
                // padding: 0 20px;
                

                .range-canvas{
                    width: 100%;
                    height: 100%;
                }

                .slider-key{
                    position: absolute;
                    width: 1px;
                    height: 78px;
                    top: 0;
                    background-color: #409EFF;
                    cursor: w-resize;
                    z-index: 3;

                    &:before{
                        content: '';
                        position: absolute;
                        width: 0;
                        height: 0;
                        border-style: solid;
                        border-width: 16px 11.5px;
                        margin-left: -11px;
                        border-color: #409EFF transparent transparent;
                    }
                }

                .slider-time-tip{
                    width: 55px;
                    height: 20px;
                    background-color: #409EFF;
                    position: absolute;
                    top: 9px;
                    color: #ffffff;
                    font-size: 12px;
                    line-height: 20px;
                    text-align: center;

                    &:before{
                        content:'';
                        position:absolute;
                        bottom: -16px;
                        left: 25px;
                        width: 0;
                        height: 0;
                        border-style: solid;
                        border-width: 8px 5.5px;
                        margin-left: -5px;
                        border-color: #409EFF transparent transparent;
                    }
                } 
            }
            

            .range-option{
                width: 100%;
                height: 40px;
                margin-top: 8px;
                overflow: hidden;
                position: relative;
            }

            .range-option2{
                width: auto;
                height: 100%;
                // padding: 0 15px;
                // margin-left: 15px;
                // position: relative;
                position: absolute;
                left: 20px;
            }

            .range-slider{
                position: absolute;
                width: 100%;
                height: 100%;

                .slider-bg{
                    width: 100%;
                    height: 100%;
                    background-color: #409EFF88;
                    border:1px solid #409EFF;
                    border-left: none;
                    border-right: none;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    color: #ffffff;
                    font-size: 14px;
                    overflow: hidden;
                    white-space: nowrap;
                    cursor: default;
                }

                .slider-left,.slider-right{
                    position: absolute;
                    top: 0px;
                    width: 20px;
                    height: 100%;
                    background-color: #409EFF;
                    cursor: w-resize;  
                    display: flex;
                    justify-content: center;
                    align-items: center;

                    &:before{
                        content: '';
                        width: 4px;
                        height: 12px;
                        border: 2px solid #ffffff;
                        border-top: none;
                        border-bottom: none;
                    }
                    
                    &.disabled{
                        cursor: not-allowed;
                    }
                }
                .slider-left{
                    left: -20px;
                    border-radius:4px 0px 0px 4px;
                }

                .slider-right{
                    right: -20px;
                    border-radius:0px 4px 4px 0px;
                }
            }

        }
    }

    .range-scale-bar{
        margin-top: 3px;
        width: 100%;
        height: 12px;
        background-color: #eeeeee;
        position: relative;

        .scroll-bar{
            width: 100%;
            height: 100%;
            position: absolute;
            left: 0;
            z-index: 1;
            

            .sb-bar-left,.sb-bar-right{
                width: 12px;
                height: 100%;
                position: absolute;
                cursor: w-resize;
                background-color: #bfbfbf;
                border-radius: 3px;
                // border-radius: 50%;
                // border: 2px solid #ababab;
            }
            .sb-bar-left{
                left: 0;
                // background-color: #00ff00;
            }

            .sb-bar-right{
                right: 0;
                // background-color: #00ffff;
            }

            &:before{
                content: '';
                position: absolute;
                height: 100%;
                left: 5px;
                right: 5px;
                background-color: #e1e1e1;
                z-index: 0;
            }
        }
        .scroll-bar:hover:before{
            background-color: #dbdbdb;
        }
    }

}
</style>