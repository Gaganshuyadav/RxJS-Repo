
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
class Observable{
    constructor(blueprint){
        this.observable = blueprint;
    }
 
    subscribe(observer){
        const closeFn = this.observable(observer);
        return closeFn();
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

oble1.subscribe({ 
    next: ( data) => console.log("obs1: ", data), 
    error: ( err) => console.log("obs1 error ",err),
    complete: () => console.log("obs1 complete")
});


