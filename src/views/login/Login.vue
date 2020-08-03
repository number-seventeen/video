<template>
    <div class="login">
        <MainLoading :show="fullscreenLoading"/>
    </div>
</template>

<script>
import {mapState,mapMutations} from 'vuex';
import MainLoading from '../../views/components/MainLoading';
import * as types from '@/store/mutationTypes.js';
import global from '@/plugins/global.js';
export default {
	name: 'login',
	components: {
		MainLoading
	},
	data(){
		return {
			fullscreenLoading: true
		}
	},
	
	created(){
		this.$store.dispatch('app_verify',(obj)=>{
			console.log('obj',obj)
			if(obj.cmd != 'success'){
				let msg = '权限验证失败';
				if(obj.cmd == 'fail'){
					msg = obj.data.returnDesc;
				}else if(obj.cmd == 'error'){
					msg = '接口调用失败';
				}
				this.$alert(msg, '警告', {
					confirmButtonText: '确定',
					callback: action => {
						this.fullscreenLoading = false;
                        this.$router.push({name:'source',query:global.params});
					}
				});
			}else{
				//写入登录信息
				window.localStorage.setItem('loginMsg',JSON.stringify(obj.data.returnData));
				// this.initConfig({administrator:!!obj.data.returnData.administrator})
				this.fullscreenLoading = false;
                this.$router.push({name:'source',query:global.params});
			}
			
		});
		// this.$store.dispatch('app_loadConfig');
		// this.$store.dispatch('connectSocket');
		// setTimeout(() => {
		// 	ChangeTheme.changeTheme('#17A689');
		// 	// ChangeTheme.changeTheme('#ff0000');
		// }, 2000);
		// let before = +new Date;
		// let currentTime = 0;
		// let currentTime2 = 0;
		// let count = 0;
		// let timer = setInterval(()=>{
		// 	let gmt2 = +new Date;
		// 	currentTime+=40;
		// 	currentTime2 = gmt2 - before;
		// 	// before = gmt2;
		// 	console.log(currentTime,currentTime2)
		// 	count++;
		// 	if(count>500){
		// 		clearInterval(timer);
		// 	}
		// },40)
		
	},
	mounted(){
		
	},
	methods:{
		// ...mapMutations({
		// 	initConfig: types.LOAD_CONFIG,
		// }),
	}
}
</script>

<style lang="scss" scoped>
.login{
    width: 100%;
    height: 100%;
}
</style>
