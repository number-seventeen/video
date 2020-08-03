/**
 * Created by tangshanghai on 2017/3/1.
 */
import MediaInfo from './MediaInfo';

class Utils{
    constructor(){
        this.dateObj = new Date();
        this.mediaInfo = new MediaInfo();
    }

   
    /**
     * 传入秒数或毫秒，取得22：22格式
     */
    getFormatSec(sec,isMs){
        if(isMs){
            sec /= 1000;
        }
        let m = parseInt(sec / 60);
        let s = parseInt(sec % 60);
        let mStr = String(m);
        let sStr = String(s);
        if (mStr.length == 1) {
            mStr = "0" + mStr;
        }
        if (sStr.length == 1) {
            sStr = "0" + sStr;
        }
        return mStr + ":" + sStr;
    }
    /**
     * 传入秒，取得22：22：22:22格式最后一位代表帧数
     */
    getFormatSecond(sec){
        
        let h = parseInt(sec/3600);
        let m = parseInt(sec/60%60);
        let s = parseInt(sec%60);
        let ms = ~~(sec*1000%1000/40);
        
        let result = (h<10?"0"+h:h)+":"+(m<10?"0"+m:m)+":"+(s<10?"0"+s:s)+":"+this.PrefixInteger(ms,2);
        return result;
    }
    /**
     * 传入毫秒，取得22：22：22格式
     */
    getFormatHMS(_ms){
        let sec = _ms/1000;
        
        let h = parseInt(sec/3600);
        let m = parseInt(sec/60%60);
        let s = parseInt(sec%60);
        //let ms = parseInt(_ms%1000);
        
        let result = (h<10?"0"+h:h)+":"+(m<10?"0"+m:m)+":"+(s<10?"0"+s:s);
        return result;
    }

    //获得年月日
	getFormatYYMMDD(gmt){
		this.dateObj.setTime(gmt);
		let y = this.dateObj.getFullYear();
		let m = this.dateObj.getMonth()+1;
		let d = this.dateObj.getDate();
		let str = "";
		str += y;
		str += (m < 10 ? "0" + m : m);
		str += (d < 10 ? "0" + d : d);
		return str;
	}
	
	//获得yyyy-mm-dd hh:mm:ss
	getFormatYYMMDD2(gmt){
		this.dateObj.setTime(gmt);
		let y = this.dateObj.getFullYear();
		let m = this.dateObj.getMonth()+1;
		let d = this.dateObj.getDate();
		let str = y+"-"+(m < 10 ? "0" + m : m)+"-"+(d < 10 ? "0" + d : d);
		let timeStr = this.dateObj.toTimeString();
        timeStr = timeStr.substr(0,8);
		return str+" "+timeStr;
    }
    
    //获得yyyy-mm-dd hh:mm:ss:ff
	getFormatYYMMDD3(gmt){
		this.dateObj.setTime(gmt);
		let y = this.dateObj.getFullYear();
		let m = this.dateObj.getMonth()+1;
		let d = this.dateObj.getDate();
		let str = y+"-"+(m < 10 ? "0" + m : m)+"-"+(d < 10 ? "0" + d : d);
		let timeStr = this.dateObj.toTimeString();
        timeStr = timeStr.substr(0,8);
        let msStr = Math.floor(this.dateObj.getMilliseconds()/40);
        if(msStr < 10) msStr = '0'+msStr;
		return str+" "+timeStr+':'+msStr;
    }
    
    //获得hh:mm:ss:ff
	getFormatYYMMDD4(gmt){
		this.dateObj.setTime(gmt);
		// let y = this.dateObj.getFullYear();
		// let m = this.dateObj.getMonth()+1;
		// let d = this.dateObj.getDate();
		// let str = y+"-"+(m < 10 ? "0" + m : m)+"-"+(d < 10 ? "0" + d : d);
		let timeStr = this.dateObj.toTimeString();
        timeStr = timeStr.substr(0,8);
        let msStr = Math.floor(this.dateObj.getMilliseconds()/40);
        if(msStr < 10) msStr = '0'+msStr;
		return timeStr+':'+msStr;
	}


    // 为数字前位补0，返回字符串
    PrefixInteger(num, length) {
        return (Array(length).join('0') + num).slice(-length);
    }

    /**
     * 获取字符的byte长度
     */
    getByteLen (str) {  
        let len = 0;  
        for (let i=0; i<str.length; i++) {
            if ((str.charCodeAt(i) & 0xff00) != 0)
                len ++;
            len ++;  
        }  
        return len;  
    }

    GUID(){
        // let time = new Date();
        // time = String(time.getTime());
        // let str = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        // let len = str.length;
        // let len2 = 32-time.length;
        // let uid = "";
        // let spliceint = Math.floor(Math.random()*len2);
        // for(let i=0;i<len2;i++){
        //     //在uid 随机位置插入时间值 进一步增加随机性
        //     if(i == spliceint)
        //     {
        //         uid += time;
        //     }
        //     uid += str.charAt(Math.floor(Math.random()*len));
        // }
        // return uid;
        let t = (new Date).getTime();
        return "xxxxxxxx-xxxx-yxxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(e){
            let n=(t+16*Math.random())%16|0;
            t=Math.floor(t/16);
            return ("x"==e?n:3&n|8).toString(16);
        });
    }
    GUID32(){
        let t = (new Date).getTime();
        return "xxxxxyxxxxxyxxxxxyxxxxxyxxxxxyxx".replace(/[xy]/g,function(e){
            let n=(t+16*Math.random())%16|0;
            t=Math.floor(t/16);
            return ("x"==e?n:3&n|8).toString(16);
        });
    }
    GUIDTOGUID(id,random=''){
        if(!id) return '';
        let rawfeature = btoa(id);//原特征码
        rawfeature = rawfeature.substr(rawfeature.length-12,12);
        let salt = random || id;//随机因子
        salt = salt.substr(14,9);
        return id.substr(0,14)+salt+'-'+rawfeature;
        // let newstr = random || btoa(id);
        // return id.substr(0,id.length-12)+newstr.substr(newstr.length-12,12);
    }

    //返回body最大的z-index
    getMaxZindex() {
        let elementObj = document.body;
        //取得容器节点下第一层所有节点
        let childNodes = elementObj.children || elementObj.childNodes;
        let zIndex = 0;
        for (let i = 0; i < childNodes.length; i++) {
            let node = childNodes[i];
            let ti1 = parseInt(this.getClass(node, "z-index"));
            let ti2 = parseInt(node.style.zIndex);
            let ti = ti2 || ti1;
            if (isNaN(ti)) continue;
            if (ti > zIndex) zIndex = ti;
        }
        zIndex += 10;
        return zIndex;
    }

    getClass(obj, name) {
        if (obj.currentStyle) {
            return obj.currentStyle[name]; //IE下获取非行间样式
        } else {
            return getComputedStyle(obj, false)[name]; //FF、Chorme下获取非行间样式
        }
    }

    dataURLtoBlob(dataurl) {
        let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    }

    /**对象转URL参数 */
    objectToURLParam (obj,isAsk=true){
        let str = '';
        for(let info in obj){
            str += '&'+info+'='+obj[info];
        }
        if(isAsk){
            str = str.replace('&','?');
        }
        return str;
    }

    /** 传入高宽 返回码率标识 */
    getBitRateMark(w=0,h=0){
        let mark = 'SD';
        // (w === 3840 && h === 2160) || (w === 4096 && h === 2160) || (w === 4096 && h === 2304)
        if(w >= 3840 || h >= 2000){
            mark = '4K';
        }else if(w === 2048 && h === 1080){
            mark = '2K';
        }else if((w === 1920 && h === 1080) || (w === 1280 && h === 720)|| (w === 1440 && h === 1080)){
            mark = 'HD';
        }else if(h===144 || h===288 || h===360 || h===480||h==576){
            mark = 'SD';
        }else{
            if((w/h).toFixed(2) === '1.77'){
                if(h >= 2160){
                    mark = '4K';
                }else if(h >= 1080){
                    mark = 'HD';
                }else{
                    mark = 'SD';
                }
            }else{
                mark = 'SD';
            }
        }
        return mark;
    }

    /** 传入地址进行拼接 */
    getURLSplicing(arr){
        let str = arr.join('/');
        str = str.replace(/\\+/g,'/');
        let index = str.indexOf(':/')+3;
        str = str.slice(0,index)+str.slice(index).replace(/\/+/g,'/');
        return str;
    }

    /** 传入url地址，获得文件mediaInfo */
    getMediaInfoOfUrl(url){
        return new Promise((resolve,reject)=>{

            let xhr = new XMLHttpRequest(); //建立一个请求
            xhr.open('GET', url, true); //配置好请求类型，文件路径等
            xhr.responseType = 'arraybuffer'; //配置数据返回类型
            // 一旦获取完成，对音频进行进一步操作，比如解码
            xhr.onreadystatechange = () => {
                // let audioContext = new AudioContext() || new WebkitAudioContext() || new mozAudioContext() || new msAudioContext();
                if(xhr.readyState === 4){
                    if((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304){
                        resolve(this.mediaInfo.getInfo(xhr.response));
                    }else{
                        reject(null);
                    }
                }
            }
            
            xhr.send();
        })
    }
}

export default new Utils;