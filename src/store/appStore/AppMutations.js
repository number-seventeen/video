import * as types from '../mutationTypes.js'

export default {
    [types.LOAD_CONFIG](state,data){
        state.config = Object.assign({...state.config},data);
    },
    [types.APP_VERIFY](state,data){
        state.fullscreenLoading = false;
        console.log('state.fullscreenLoading',state.fullscreenLoading,state.config,data)
    },
    [types.SET_CURRENT_MEDIA](state,data){
        state.currentMedia = data;
    }
} 