<template>
<div id="app">
	<router-view v-if="isRouterAlive"></router-view>
</div>
</template>

<script>
import {mapState,mapMutations} from 'vuex';
import * as types from '@/store/mutationTypes.js';
import ChangeTheme from './libs/ChangeTheme';//'../libs/ChangeTheme';
export default {
	name: 'App',
	provide(){
		return{
			reload:this.reload
		}
	},
	data(){
		return {
			documentLoaded:false,
			isRouterAlive:true
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
		if (sessionStorage.getItem("store") ) {
        this.$store.replaceState(Object.assign({}, this.$store.state,JSON.parse(sessionStorage.getItem("store"))))
		};
		window.addEventListener("beforeunload",()=>{
        sessionStorage.setItem("store",JSON.stringify(this.$store.state))
    	}) 
	},
	mounted(){
		window.addEventListener('unload', this.saveState)
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
		},
		saveState() {
                sessionStorage.setItem('state', JSON.stringify(this.$store.state))
		},
		reload(){
			this.isRouterAlive=false
			this.$nextTick(function(){
				this.isRouterAlive=true
			})
		}
	}
}
</script>

<style>
html,body{
	width: 100%;
	height: 100%;
	background: white;
	
	
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
    width:2px;
	height:0px;
	
}
::-webkit-scrollbar-thumb {
    background-color: rgb(199, 222, 253);
    background-clip:padding-box;
    min-height:28px;
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
.page-edit{
	min-width: 1365px;
	margin-left: auto;
	margin-right: auto;
	

}

.switchon .el-switch__core{
    height: 24px;
	border-radius: 50px;
	
	
}
.switchon .el-switch__core::after{
	width: 18px;
    height: 18px;
	margin-top: 1px;
	margin-left: 2px;
	
	
}
.el-switch.is-checked .el-switch__core::after {
    left: 100%;
    margin-left: -23px;
}
.choose .el-radio__label{
	font-size: 18px;
	
}
.el-radio__input.is-checked .el-radio__inner {
    border-color:rgba(0, 121, 254, 1);
    background: rgba(0, 121, 254, 1);

	
}
.el-radio__input.is-checked+.el-radio__label{
	color: rgba(0, 121, 254, 1);
	
}
.el-radio__inner:hover{
	border: 1px solid rgba(0, 121, 254, 1);
}
.vcurrent{
	  box-shadow:0 0 15px rgb(15, 49, 85) ;
	  
}
.media-control .control-btns .cb-left[data-v-682a5528] {
	color: #cdcdcd;
}
.t-head #tab-second{
	padding-left: 50px;
	height: 35px;
	
	
}
.t-head .el-tabs {
	height: 40px;
}
.t-head .el-tabs__active-bar{
	background-color: rgb(130, 184, 245);
	height: 2px;
	top: 33px;
	
	
}
.t-head .el-tabs__item.is-active{
	color: rgb(130, 184, 245);
	
}
.t-head .el-tabs__item{
	font-size: 12px;
	letter-spacing: 0.1em;
	outline: none;
	height: 38px;
	
	
}
.t-head .el-tabs__item:hover{
	color: rgb(130, 184, 245);
}
</style>
