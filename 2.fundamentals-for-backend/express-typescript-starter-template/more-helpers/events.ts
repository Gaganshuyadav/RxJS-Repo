export class EventEmitterC{

    private events: Record<string,Function[]>;

    constructor(){
        this.events = {};
    }

    private isEventTypeExists( eventName:string):boolean{
        return eventName in this.events; 
    }

    on( eventName:string, eventHandler: Function){
        if( !this.isEventTypeExists(eventName)){
            this.events[eventName] = [];
        }
        this.events[eventName].push(eventHandler);
    }

    off( eventName:string, eventHandler:Function){
        if( !this.isEventTypeExists(eventName)){
            return;
        }
        this.events[eventName] = this.events[eventName].filter((handlerFn:Function)=>handlerFn!==eventHandler);
    }
    
    emit( eventName:string, data:any){
        if(!this.isEventTypeExists(eventName)){
            return;
        }
        this.events[eventName].forEach((handler:Function)=>{
            handler(data);
        })
    }
}

