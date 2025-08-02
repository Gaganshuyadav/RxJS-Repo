import express from 'express';
import { Observable} from "rxjs";

const app = express();

app.get('/', (req, res) => {
    res.json({ message: 'Hello world!' });
});


/*(1). Work with Observable */
/*

// in this case, when sub.unsubscribe() is execute then The Observable will stop sending values to the subscriber, but the interval will keep running in the background.
// If you want unsubscribing to actually stop the interval,then return the cleanup function. Then, when you call unsubscribe(), RxJS will execute that function and clear the interval.
const obs = new Observable((observer)=>{
    let counter=1;
    const producer = setInterval(()=>{

        console.log("i am interval");

        observer.next(counter++);

        // if( counter>3){
        //     observer.error("conditional error");
        // }

        if(counter==10){
            observer.complete();
        }
    }, 1000)

    //-- unsubscribe //-- cleanup function
    // return ()=>{
    //     clearInterval(producer);
    // }
})


const sub = obs.subscribe({
    next: ( data)=> console.log("data: ",data),
    error: ( err)=> console.log("error occurs: ",err),
    complete: ()=> console.log("completed")
})

// we can also pass only function, and it is next function
// const sub = obs.subscribe((data)=>{
//     console.log("data: ",data);
// })

setTimeout(()=>{
    sub.unsubscribe();
},6000);

*/


/*(2). Observable with API */

/*
const obs = new Observable((observer)=>{

    const url = "https://jsonplaceholder.typicode.com/posts/2";

    async function fetchData(){
        try{
            const res = await fetch(url);
            const resData = await res.json();
            observer.next(resData);
        }
        catch(err){
            observer.next({ error: err});
        }
    }

    fetchData();
    
    
})

const sub = obs.subscribe((data)=>{
    console.log("response data:- ",data);
})

*/


/*(3). Observable v/s Promise */

/*

// --------------------- eager to run
const promise = new Promise((resolve, reject)=>{
    console.log("first line");
    setTimeout(()=>{
        resolve("now promise is done");
    },8000);
    console.log("last line");
})

promise.then((res)=>{
    console.log(res);
})

// -------------- lazy( runs only when subscribed)

const obs = new Observable((observer)=>{

    const url = "https://jsonplaceholder.typicode.com/posts/2";

    async function fetchData(){
        try{
            const res = await fetch(url);
            const resData = await res.json();
            observer.next(resData);
        }
        catch(err){
            observer.next({ error: err});
        }
    }

    fetchData();
    
    
})

const sub = obs.subscribe((data)=>{
    console.log("response data:- ",data);
})

*/



export default app;
