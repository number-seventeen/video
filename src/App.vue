<template>
<div id="app">
	<router-view></router-view>
</div>
</template>

<script>
import {mapState,mapMutations} from 'vuex';
import * as types from '@/store/mutationTypes.js';
import ChangeTheme from './libs/ChangeTheme';//'../libs/ChangeTheme';
export default {
	name: 'App',
	data(){
		return {
			documentLoaded:false
		}
	},
	computed:{
        ...mapState({
			// fullscreenLoading:state => state.appStore.fullscreenLoading,
            config: state => state.appStore.config
        })
	},
	watch:{
        // config:function(newVal,oldVal){
		// 	console.log('newVal.themeColor',newVal.themeColor)
		// 	ChangeTheme.changeTheme(newVal.themeColor);
		// }
    },
	created(){
		window.addEventListener('load',this.onloadHandler);
		this.initConfig(window.AppConfig);
	},
	mounted(){
		
	},
	methods:{
		...mapMutations({
			initConfig: types.LOAD_CONFIG,
		}),
		onloadHandler(){
			ChangeTheme.initCss().then(data=>{
				console.log('ChangeTheme',data)
				console.log('更改主题颜色',this.config.themeColor)
				ChangeTheme.changeTheme(this.config.themeColor);
			}).catch(error=>{
				console.log('ChangeTheme',error)
			})
			// ChangeTheme.changeTheme(this.config.themeColor);
			window.ChangeTheme = ChangeTheme;
		}
	}
}
</script>

<style>
html,body{
	width: 100%;
	height: 100%;
}
*{
	margin: 0;
	padding: 0;
	box-sizing: border-box;
}
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	/* text-align: center; */
	color: #2c3e50;
	/* margin-top: 60px; */
	width: 100%;
	height: 100%;
	position: relative;
}
/** 修改浏览器默认滚动条样式 **/
::-webkit-scrollbar-track-piece {
    background-color:#eaeaea;
}
::-webkit-scrollbar {
    width:8px;
    height:8px;
}
::-webkit-scrollbar-thumb {
    background-color:#acacac;
    background-clip:padding-box;
    min-height:28px;
    border-radius: 3px;
}
</style>
<style lang="scss">
.el-tabs{
    .el-tabs__item.is-active{
        font-weight: bold;
    }
    .el-tabs__active-bar{
        height: 3px;
    }
}
.el-color-picker__panel{
	.el-color-predefine__color-selector{
		border: 1px solid #ededed;
	}
}
</style>
