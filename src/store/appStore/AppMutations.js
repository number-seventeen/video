import * as types from '../mutationTypes.js'

export default {
    [types.LOAD_CONFIG](state,data){
        state.config = Object.assign({...state.config},data);
    },
    [types.APP_VERIFY](state,data){
        state.fullscreenLoading = false;
        console.log('state.fullscreenLoading',state.fullscreenLoading,state.config,data)
    },
    [types.SET_CURRENT_MEDIAS](state,data){
        state.curSelects = data;
    },
    [types.TL_LOADTEMPLATE_TT](state,data){
        const arr = data;
        arr.forEach(element => {
            element.isSelected = false;
        });
        state.tlListTT = arr;//Object.assign({...state.config},data);
        // console.log(state.tlListTT)
        // state.fullscreenLoading = false;
    },
    [types.TL_SELECTED_TT](state,data){
        const arr = state.tlListTT;
        state.tlListTT.forEach(element=>{
            element.isSelected = element.templateId == data.templateId;
            
        })
        // state.tlListTT = Object,assign([],arr);
    }


    
    

    
    
} 