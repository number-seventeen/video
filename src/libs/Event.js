class Event{
    constructor(){
        this.callBacks = [];
    }

    $on(type,callback){
        this.callBacks.push({
            type:type,
            callback:callback
        })
    }

    $off(type,callback){
        for(let i = 0;i<this.callBacks.length;i++){
            let temp = this.callBacks[i];
            if(temp.type == type && temp.callback === callback){
                this.callBacks.splice(i,1);
                break;
            }
        }
    }

    $emit(type,parameter){
        let tellArr = [];
        for(let i = 0;i<this.callBacks.length;i++){
            let temp = this.callBacks[i];
            if(temp.type == type){
                tellArr.push(temp);
            }
        }
        for(let i=0;i<tellArr.length;i++){
            let temp = tellArr[i];
            temp.callback(parameter);
        }
    }
}
export default Event;