<template>
	<div id="play" >
        <video :src="it[0].url"  ref="player" class="vs"></video>
        <div class="v-control">
            <div class="button_menu">
                <el-button type="primary" size="mini" icon="el-icon-arrow-left" ></el-button> 
                <el-button type="primary" size="mini" :icon="status" @click="audioState"  class="control_button
                "></el-button> 
                <el-button type="primary" size="mini" icon="el-icon-arrow-right"></el-button> 
            </div>
            <div class="pro">
                <p>{{cTime}}</p>
                <div class="bar">
                    <div class="progressbar" ref="runfatbar" @click="playMusic">
                        <div class="greenbar" ref="runbar">
                        </div>

                    </div>
                </div>
                <p>{{dTime}}</p>
            </div>
        </div>
    </div>

</template>

<script>
export default {

		props:{	
            it:{
                type:Array
            }    
		},
        data(){
			return{
				cTime:'00:00',
            	dTime:'00:00',
            	play:false,
                status:'el-icon-video-play',
                currentMedia:null,
                currentOffset: 0,	
                
               	
			}
            
        },
        mounted(){
            const music = this.$refs.player;  
            const musicBar = this.$refs.runbar;  // 颜色进度条所在对象
            const musicWidth = this.$refs.runfatbar.offsetWidth; // 底部进度条总宽
            
            // 初始化音频信息
            music.addEventListener('canplay', () => {
                const musicTime = music.duration; // 获得音频时长
                const branch = Math.floor(musicTime / 60); // 计算音频分钟
                const second = Math.ceil(musicTime % 60); // 计算音频秒
                if(branch < 10 && second < 10){  // 四种情况判断音频总时间
                    this.dTime = `0${branch}:0${second}`;
                }else if(branch < 10){
                    this.dTime = `0${branch}:${second}`;
                }else if(second < 10){
                    this.dTime = `${branch}:0${second}`;
                }else{
                    this.dTime = `${branch}:${second}`;
                }
            })

            // 音频正在播放
            music.addEventListener('timeupdate',() => {
                const musicTime = music.duration; // 获得音频时长
                const stopTime = music.currentTime // 获得已播放的音频时长

                musicBar.style.width = `${(stopTime / musicTime) * 100}%`; // 计算进度条所在比例宽度
                const branch = Math.floor(stopTime / 60); // 计算已播放的音频分钟
                const second = Math.floor(stopTime % 60); // 计算已播放的音频秒

                if (branch < 10 && second < 10) { // 四种情况判断显示音频已播放时间
                    this.cTime = `0${branch}:0${second}`;
                } else if (branch < 10) {
                    this.cTime = `0${branch}:${second}`;
                } else if (second < 10) {
                    this.cTime = `${branch}:0${second}`;
                } else {
                    this.cTime = `${branch}:${second}`;
                }
            })

            // 移动端监听进度条触摸拖动
            musicBar.addEventListener('touchmove',(event) => {
                const events = event.targetTouches[0].pageX; // 获得触摸拖动的距离
                musicBar.style.width = `${(events / musicWidth) * 100}%`; // 计算进度条所在比例宽度
                music.pause(); // 触摸拖动时停止播放
            })

            // 移动端监听进度条触摸拖动结束
            musicBar.addEventListener('touchend',() => {
                const touwidth = (musicBar.offsetWidth / musicWidth); // 计算进度条所在比例
                music.currentTime = music.duration * touwidth; // 通过所在比例赋值给音频应在的播放时间
                music.pause(); // 根据播放时间开始播放
                this.play = false; // 更改播放暂停按钮为播放
            })
        },
        methods:{
            // 播放暂停
            audioState(){
                this.play = !this.play;
                const music = this.$refs.player;
                if(this.play){
                    music.play();
                    this.status = 'el-icon-video-play';
                   
                }else{
                    music.pause();
                    this.status = 'el-icon-video-pause';
                    
                }
            },
            // 点击进度条事件
            playMusic(e){
                const music = this.$refs.player; // 音频所在对象
                const barWidth = e.pageX / this.$refs.runfatbar.offsetWidth; // 计算点击位置相对父元素总宽的比例
                console.log(this.$refs.runfatbar.offsetWidth)
                this.$refs.runbar.style.width = `${barWidth * 100}%`; // 进度条应所在的比例总宽
                music.currentTime = music.duration * barWidth; // 计算点击时应播放所在的时间
                music.pause(); // 播放音频
                this.play = false; // 更改播放暂停按钮为播放
                
			},
			
			
        }
    

}
</script>

<style scoped src="../../play.css">

   
</style>