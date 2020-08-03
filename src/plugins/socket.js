class MySocket{
    constructor(url,onmessage){
        this.url = url;
        this.onmessage = onmessage;
        this.ws = null;
        this.reconnectCount = 0;

        this.keepTimer = 0;
        this.keepTimeMS = 40000;
    }

    connect(){
        const onclose = (event) => {
            console.log('ws onclose =',event)
            if(this.reconnectCount < 5){
                setTimeout(()=>{
                    this.reconnectCount++;
                    console.log('开始重连',this.reconnectCount)
                    this.connect();
                },1000);
            }
        }

        const onerror = (event) => {
            console.log('ws error',event)
            // message.error('更新编目失败！')
        }

        const onmessage = (event) => {
            // console.log('ws message',event)
            this.keepWebSocket();
            if(this.onmessage){
                this.onmessage(event);
            }
            // commit(types.PARSE_SOCKET_DATA,event.data);
            
        }
        const onopen = (event) => {
            console.log('ws onopen',event)
            this.reconnectCount = 0;
            this.keepWebSocket();
        }

        // const { username, uid, token, tenantid } = defaultParams;
        // let params = `?uid=${uid}&username=${username}&token=${token}&tenantid=${tenantid}`;
        // let params = `?token=${Util.config.defaultParams.token}`;params='';
        // return WebSocket.initWebSocket(Util.interfaceObj.websocket+params,onMessage,onError,onSuccess,onFailure,onReconnect);

        let protocol = ''
        if(document.location.protocol == "https:"){
            protocol = "wss://"+document.location.host
        }
        else{
            protocol = "ws://"+document.location.host
        }
        console.log('protocol',protocol)
        let ws = new WebSocket(protocol+this.url);//console.log('socketUrl',socketUrl)
        
        ws.onclose = onclose;
        ws.onerror = onerror;
        ws.onmessage = onmessage;
        ws.onopen = onopen;

        this.ws = ws;
    }


    keepWebSocket(){
        clearTimeout(this.keepTimer);
        this.keepTimer = setInterval(()=>{
            // if(this.ws.readyState == 1){
            //     this.ws.send('ping');
            // }
            this.sendMsg('ping');
        },this.keepTimeMS)
    }

    sendMsg(data){
        if(this.ws){
            this.ws.send(data);
        }
        // if(this.ws.readyState == 1){
            
        // }
    }
}

export default MySocket;