import mutations from './AppMutations.js'
import actions from './AppActions.js'

const state = {
    fullscreenLoading:true,//全网页加载中
    config:{
        themeColor:'#409EFF',
    },
    currentMedia:null,//当前编辑的素材信息
}

const getters = {
    
}

export default {
    state,
    actions,
    getters,
    mutations
}
