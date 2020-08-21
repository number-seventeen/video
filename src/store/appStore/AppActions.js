
import * as Action from '../actions.js';
import * as types from '../mutationTypes.js';
import * as Interface from '../interfaceUrl.js';

import global from '../../plugins/global';
import MySocket from '../../plugins/socket';

export default {
    app_verify({commit},callback){
        Action.getJsonData(Interface.verify+global.search,{}).then( data =>{
            if(callback){
                let msg = {
                    cmd:'success',
                    data: data
                }
                if(data.returnCode == 1){
                    msg.cmd = 'fail';
                }
                callback(msg);
            }
            
        }).catch( err =>{
            if(callback){
                callback({
                    cmd:'error',
                    data: err
                });
            }
        })
    },
    app_loadConfig({commit}){
        // Action.postJsonData(Interface.config,{}).then( data =>{
        //     commit(types.LOAD_CONFIG,data);
            
        // }).catch( err =>{
        //     console.log('配置项加载错误',err)
        // })
            
    },
    connectSocket({commit,state}){
        
        
    },
    app_loadTitleTailList({commit}){
        Action.getJsonData(Interface.titleTailList+global.search,{}).then( data =>{
            // console.log('dataTL_LOADTEMPLATE_TT',data)
            commit(types.TL_LOADTEMPLATE_TT,data.returnData);
        }).catch( err =>{
            console.log('模板例表加载错误',err)
        })
    },
    app_saveTitleTail({commit},params){
        return Action.postFormData(Interface.titleTailSave+global.search,params);
        console.log('tl_saveTitleTail',params,callback)
       
    },
    app_delTitleTail({commit},params){
        Action.postFormData(Interface.titleTailDel+global.search,params).then( data =>{
            // console.log('tl_delTitleTail',data)
            this.dispatch('tl_loadTitleTailList');
            // commit(types.TL_LOADTEMPLATE_TT,data);
        }).catch( err =>{
            console.log('模板例表加载错误',err)
        })
    },
    app_topTitleTail({commit},params){
        return Action.getJsonData(Interface.titleTailTop+global.search,params)
    },

}