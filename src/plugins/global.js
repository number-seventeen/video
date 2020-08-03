

function initParams(search){
    let url_params = search.replace("?","").split("&");
    // console.log('url_params =',url_params,window.location.search)
    const obj = {};
    for(let k=0;k<url_params.length;k++){
        if(url_params[k] === '') continue;
        let arr = url_params[k].split("=");
        obj[arr[0]] = decodeURIComponent(arr[1]) || "";
    }
    return obj;
}

export default {
    search:window.location.search,
    params: initParams(window.location.search)
}
