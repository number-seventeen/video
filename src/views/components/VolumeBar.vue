<template>
    <div class="volume-bar">
        <!-- <el-slider class="volume-slider" width="300px" v-model="volume" :min="0" :max="1" :step="0.01"
        :format-tooltip="formatTooltipSlider"
        @input="volumeChangeHandler"
        tooltip-class="volume-slider-tooltip"></el-slider> -->
        <div class="vb-silder-box">
            <MySlider :value="volume" @value_change="value_changeHandler"/>
        </div>
        

        <div class="cb-btn btn-volume" @click="muteClickHandler">
            <svg class="icon svg-icon" aria-hidden="true" v-if="volumeStatus=='level0'">
                <use xlink:href="#iconjingyin"></use>
            </svg>
            <svg class="icon svg-icon" aria-hidden="true" v-if="volumeStatus=='level1'">
                <use xlink:href="#iconshengyin2"></use>
            </svg>
            <svg class="icon svg-icon" aria-hidden="true" v-if="volumeStatus=='level2'">
                <use xlink:href="#iconshengyin1"></use>
            </svg>
            <svg class="icon svg-icon" aria-hidden="true" v-if="volumeStatus=='level3'">
                <use xlink:href="#iconshengyin"></use>
            </svg>
        </div>
    </div>
</template>

<script>
import MySlider from './MySlider';
export default {
    props:{
        propVolume:{
            type:Number,
            default:1
        }
    },
    components:{MySlider},
    computed:{
        volumeStatus(){
            if(this.volume === 0) return 'level0';
            if(this.volume <= 0.2) return 'level1';
            if(this.volume <= 0.6) return 'level2';
            return 'level3';
        },
    },
    data(){
        return {
            volume:0.5,
            recordVolume:0.5,
            isMute:false,
        }
    },
    watch:{
        propVolume:{
            deep:true,
            handler(newVal){
                this.volume = newVal;
            }
        }
    },
    mounted(){
        this.volume = 1;
    },
    methods:{
        formatTooltipSlider(value){
            return Math.floor(value*100) + '%'
        },
        value_changeHandler(v){
            this.volume = v;
            this.isMute = this.volume == 0;
            this.$emit('volume_change',this.volume);
        },
        muteClickHandler(){
            
            this.isMute = !this.isMute;
            if(this.isMute){
                this.recordVolume = this.volume;
                this.volume = 0;
            }else{
                this.volume = this.recordVolume || 0.5;
            }
            this.$emit('volume_change',this.volume);
        }
    }
}
</script>


<style lang="scss" scoped>
.volume-bar{
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    
    .vb-silder-box{
        flex: 1;
        height: 4px;
        margin: 0 10px 0 10px;
    }

    .cb-btn{
        width: 30px;
        height: 30px;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;

        &:hover{
            // background-position-x: -30px;
            color: #d6d6d6;
        }
    }
    .btn-volume{
        position: relative;
        color: #bdbdbd;
        font-size: 22px;
    }
        
}
</style>