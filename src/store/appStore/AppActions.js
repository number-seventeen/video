
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
        
        // const onmessage = (event) => {
        //     console.log('ws message',event)
        //     if(event.data != 'pong'){
        //         let msg = JSON.parse(event.data);
        //         if(msg.type == 'taskStatus'){
        //             commit(types.TASK_LIST_MSG,JSON.parse(msg.message));
        //         }
        //     }
        // }
        // const mySocket = new MySocket('/appsocket/ws',onmessage);
        // mySocket.connect();
    }
}