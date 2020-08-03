// import qs from 'qs'
// import Vue from 'vue';

export function getJsonData(url,params){
    return axios.get(url,{params:params})
}

export function postJsonData(url,params){
    return axios.post(url,params)
}

export function postFormData(url,params,onsuccess,onerror) {
    // let data = qs.stringify(params)
    let fd = new FormData();
    for(let info in params){
        fd.append(info, params[info]);
    }
        // fd.append('username', Util.config.defaultParams.username);
        // fd.append('uid', Util.config.defaultParams.uid);
        
    return axios.post(url, fd,{
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
        }
    })
    // .then( res => {
    //     onsuccess(res)
    // }).catch( err => {
    //     onerror(err)
    // })
}

export function getBufferMethon(url,params,onsuccess,onerror){
    axios.get(url,{
        params:params,
        responseType: 'arraybuffer'
    },).then(res=>{
        onsuccess(res)
    }).catch(err=>{
        onerror(err)
    })
}
export function getTextFile(url,params,onsuccess,onerror){
    axios.get(url,params)
    .then(res=>{
        onsuccess(res)
    }).catch(err=>{
        onerror(err)
    })
}

