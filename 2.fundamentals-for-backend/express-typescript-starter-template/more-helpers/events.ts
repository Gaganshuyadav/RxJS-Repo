export class EventEmitterC{

    private events: Record<string,Function[]>;

    constructor(){
        this.events = {};
    }

    private isEventTypeExists( eventName:string):boolean{
        return eventName in this.events; 
    }

    on( eventName:string, eventHandler: Function){
        console.log("on method ????")
        if( !this.isEventTypeExists(eventName)){
            this.events[eventName] = [];
        }
        this.events[eventName].push(eventHandler);
    }

    off( eventName:string, eventHandler:Function){
        console.log("off method ????????")
        console.log(eventName," ::::::::::::::: ",eventHandler)
        if( !this.isEventTypeExists(eventName)){
            return;
        }
        this.events[eventName] = this.events[eventName].filter((handlerFn:Function)=>handlerFn!==eventHandler);
    }
    
    emit( eventName:string, data:any){
        console.log("emit method ????????????")
        if(!this.isEventTypeExists(eventName)){
            return;
        }
        this.events[eventName].forEach((handler:Function)=>{
            handler(data);
        })
    }

    addListener(){
        console.log("add listener ||-------------")
    }

    removeListener(){
        console.log("remove listener ||-------------")
    }

    addEventListener(){
        console.log("add event listener ||-------------")
    }

    removeEventListener(){
        console.log("remove event listener ||-------------")
    }
    

}

