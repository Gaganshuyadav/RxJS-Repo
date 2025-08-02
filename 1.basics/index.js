
/*(1). Unicast---------------- */

/*

// whole function is Observable
function observable(observer){
    // producer
    let counter = 1;
    const producer = setInterval(()=>{
        observer.next(counter++);
    }, 1000);

    // un-subscription //teardown //close
    return ()=>{
        clearInterval(producer);
    }
}  

//consumer
const closeFn = observable({ 
    next: ( data) => console.log(data),
    error: ( err) => console.log("error ",err),
    complete: () => console.log("done")
})  

//off subscription
setTimeout(()=>{
    closeFn(); 
},6000);

*/

/*(2). Multicast---------------- */
/*

// whole function is Observable
function observable(observer){
    // producer
    let counter = 1;
    const producer = setInterval(()=>{
        observer.next(counter++);       
    }, 1000);

    // un-subscription //teardown //close
    return ()=>{
        clearInterval(producer);
    }
}  

//consumer 1
const closeFn1 = observable({  
    next: ( data) => console.log("obs1: ", data),
    error: ( err) => console.log("obs1 error ",err), 
    complete: () => console.log(" obs1 complete")
})  

//consumer 2
const closeFn2 = observable({ 
    next: ( data) => console.log("obs2: ", data),
    error: ( err) => console.log("obs2 error ",err),
    complete: () => console.log("obs2 complete")
})  

//off subscription
setTimeout(()=>{
    closeFn1();   
},6000);
 
*/

/*(3). Observable Class */
/*
class Observable{
    constructor(blueprint){
        this.observable = blueprint;
    }
 
    subscribe(observer){
        const closeFn = this.observable(observer);
        return closeFn; 
    }
}

//pass observable function in class
const oble1 = new Observable( function (observer){          
    
    let counter = 1;
    const producer = setInterval(()=>{
        observer.next(counter++);      

        if(counter===6){
            observer.complete();
        } 

    }, 1000);  

    return ()=>{
        clearInterval(producer); 
    }

});

const unsub = oble1.subscribe({ 
    next: ( data) => console.log("obs1: ", data), 
    error: ( err) => console.log("obs1 error ",err),
    complete: () => console.log("obs1 complete")
});
     
setTimeout(()=>{

},500)

*/

/*(4). Observable Class with complete */

/* 

class Observable{
    constructor(blueprint){
        this.observable = blueprint;
    }
 
    subscribe(observer){
        const closeFn = this.observable(observer);
        return closeFn; 
    }
}

//pass observable function in class
const oble = new Observable( function (observer){          
    
    let counter = 1;
    const producer = setInterval(()=>{
        observer.next(counter++);      

        if(counter===10){
            observer.complete( producer);
        } 
 
    }, 1000);  

    return ()=>{
        clearInterval(producer); 
    }

});

const unsub = oble.subscribe({ 
    next: ( data) => console.log("obs: ", data), 
    error: ( err) => console.log("obs error ",err),
    complete: ( producerId) => { 
        console.log("obs complete");
        clearInterval(producerId); 
    }
});

setInterval(()=>{
    unsub();
},6000); 

*/


/*(4). Observable Class with Guard Class */

// /*
class ObserverGuard{
    constructor(observer){
        this.observer = observer;
        this.isUnsubscribed = false;  
        console.log("guard:-- ",this.observer);
    }

    next(data){
        if( this.isUnsubscribed || !this.observer.next){
             this.unSubscribe();
            return;
        }

        try{
            this.observer.next(data);
        }
        catch(err){
            this.unSubscribe();
            throw err;
        }
        
    }
    
    error(err){
        if( this.isUnsubscribed || !this.observer.error){
             this.unSubscribe();
            return;
        }

        try{
            this.observer.error(err);
        }
        catch(innerError){
            this.unSubscribe();
            throw innerError; 
        }

        this.unSubscribe();
    }

    complete(){
        if( this.isUnsubscribed || !this.observer.complete){
             this.unSubscribe();
            return;
        }

        try{
            this.observer.complete();
        }
        catch(err){
            this.unSubscribe();
            throw err;
        }

        this.unSubscribe();
    }

    unSubscribe(){
        this.isUnsubscribed = true;

        if(this.closeFnc){
            this.closeFnc();
        }
    }

    isClosed(){
        return this.isUnsubscribed;
    }
}  

class Observable{
    constructor(blueprint){
        this.observable = blueprint;
        console.log("normal:-- ",this.observable);
    }
 
    subscribe(observer){
        // add Observer Guard  
        const observerWithGuard = new ObserverGuard(observer);
        console.log("||||||||||||| ");
        console.log("||||||||||||| ");
        console.log(observerWithGuard);
        const closeFn = this.observable(observerWithGuard); 
        // add close function to ObserverGuard 
        observerWithGuard.closeFnc = closeFn;
        const subscription = this.subscriptionMetadata(observerWithGuard);
        return subscription; 
    }

    subscriptionMetadata(observerWithGuard){
        return {
            unSubscribe(){
                observerWithGuard.unSubscribe();
            },
            isClosed(){
                return observerWithGuard.isClosed();
            }
        }
    }
}

//pass observable function in class
const oble = new Observable( function (observer){          
    
    let counter = 1;
    const producer = setInterval(()=>{
        observer.next(counter++);      

        // if(counter===10){
        //     observer.complete( producer);
        // } 
 
    }, 1000);  

    return ()=>{
        clearInterval(producer); 
    }

});

const subscription = oble.subscribe({ 
    next: ( data) => console.log("obs: ", data), 
    error: ( err) => console.log("obs error ",err),
    complete: ( producerId) => { 
        console.log("obs complete");
        clearInterval(producerId); 
    }
});
 
setInterval(()=>{
    console.log("is closed: ",subscription.isClosed());
    if(!subscription.isClosed()){
        subscription.unSubscribe();
    }
    
},6000); 

// */
