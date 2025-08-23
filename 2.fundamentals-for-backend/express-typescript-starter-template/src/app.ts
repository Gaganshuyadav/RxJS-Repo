import express from 'express';
import { createReadStream } from 'fs';
import { firstValueFrom, from, fromEvent, generate, iif, interval, lastValueFrom, Observable, of, range, timer } from "rxjs";
import { EventEmitter } from 'stream';
import { EventEmitterC } from '../more-helpers/events';
import { ajax } from "rxjs/ajax";

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
    return ()=>{
        clearInterval(producer);
    } 
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


// Promise:- 
//     -- eager to run( runs immediately)
//     -- cannot be cancelled once started
//     -- emits a single value
//     -- limited chaining( .then, .catch)
//     -- Not built-in Multicasting. ( multicasting means sharing a single execution of an Observable among multiple subscribers.)
//     -- Use Case:- ( one time async result , like: HTTP request)

// Observable:- 
//     -- lazy( runs only when subscribed)
//     -- can be cancelled( unsubscribed)
//     -- can emit multiple values over time
//     -- Rich operators for mapping, filtering, etc.
//     -- Supports multicasting with subjects
//     -- Use Case:- ( Streams, events, multiple values, async flows)

/*

// --------------------- eager to run, their is no logic for unsubscribe or cancel feature


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

// -------------- lazy( runs only when subscribed, and also we can cancel the fetch request)

const obs = new Observable((observer)=>{

    const url = "https://jsonplaceholder.typicode.com/posts/2";
    const abortController = new AbortController();

    async function fetchData(){
        try{
            const res = await fetch(url, { signal: abortController.signal});
            const resData = await res.json();
            observer.next(resData);
        }
        catch(err){
            observer.next({ error: err});
        }
    }

    fetchData();

    return ()=>{
        console.log("abort api ")
        abortController.abort();
    }
    
    
})

const sub = obs.subscribe((data)=>{
    console.log("response data:- ",data);
})

//this will unsubscribe the fetch request
setTimeout(()=>{
    sub.unsubscribe();
},1000);



// -------------- promise emits only single value , but observable emits multiple values

const pro = new Promise((resolve, reject)=>{
    resolve(1);
    resolve(2);
    resolve(3);
    resolve(4);
    resolve(5);
})

const oble = new Observable((observer)=>{
    observer.next(1);
    observer.next(2);
    observer.next(3);
    observer.next(4);
    observer.next(5);
})

pro.then((res)=>{
    console.log("promise response: ",res);
})

const obleSub = oble.subscribe(( data)=>{
    console.log("observable response",data);
})


*/


/*(4). ( of operator) :- of is a function that takes any number of arguments and returns an Observable that emits each of those arguments sequentially and then completes.*/

/*

//------( simple passing)--------------------------

const str = "hello";
const num = 243;
let arr = [ 2, 432, 42, 4, 2, 123, 4]; 

const obs1 = of(arr);
obs1.subscribe(( data)=>{
})


//----( with promise)----------------------------

let pro = new Promise( ( resolve, reject)=>{
    resolve("hello ji");
})

const obs = of(pro);

obs.subscribe((prom)=>{
    prom.then((data)=>{
        console.log(data);
    })
    .catch((err)=>{
        console.log(err);
    })
})


//---( multiple data emission)-----------------------------

let x = "hello", y = "hai", z = "bye bye", a = "good", b = "morning";

const obs2 = of( x, y, z, a, b);
obs2.subscribe((ele)=>{
    console.log(ele);
})
obs2.forEach((ele)=>{
    console.log(ele);
})
obs2.subscribe((ele)=>{
    console.log(ele);
})

//----( maps and sets and array)----------------------------

const map = new Map();
const set = new Set();
map.set("1",1);
map.set("2",2);
map.set("3",3); 
set.add(4).add(5).add(6);

const obs3 = of( map, set, [ "o", "m", "g"]);
obs3.subscribe(( data)=>{
    console.log(" map and set and arr ",data);
})

*/


/*(5). ( from operator) :- from is a creation operator that converts various data types (like arrays, Promises, or iterables) into an Observable  */

/*


//-----( set, map and array)-----------

const set = new Set();
const map = new Map();

const arr = [ "google", "facebook", "microsoft", "amazon"];
set.add("i").add("am").add("ironman");
map.set("1",1);
map.set("2",2);
map.set("3",3);

// const obs = from(arr);
// const obs = from(map);
const obs = from(set);

obs.subscribe((data)=>{
    console.log(data);
})


//-----( promise and api)-----------

//promise
const pro = new Promise(( resolve, reject)=>resolve("i am ironman"));
const pObs = from(pro);
pObs.subscribe((data)=>{
    console.log(data);
})

//api
const fetchDataApi = ()=>{ return fetch("https://jsonplaceholder.typicode.com/albums/2"); };
const fetchDataApiObs = from(fetchDataApi());

fetchDataApiObs.subscribe((res)=>{

    const jsonRes = res.json();
    console.log("json res: ",jsonRes);

    const jsonResObs = from(jsonRes);
    jsonResObs.subscribe((data)=>{
        console.log(data);
    })
})

// if give promise array( it will not resolve each promise, it just give the promise in each iteration)
const pro1 = new Promise(( resolve, reject)=>resolve("resolve promise 1"));
const pro2 = new Promise(( resolve, reject)=>resolve("resolve promise 2"));
const pro3 = new Promise(( resolve, reject)=>resolve("resolve promise 3"));

const proArr = [ pro1, pro2, pro3];
const proArrObs = from(proArr);

proArrObs.subscribe((promiseData)=>{
    console.log(promiseData);
    promiseData.then((data)=>{
        console.log("data: ",data);
    })
})


//-----( with Object it does not work( cause we need to make it iterable obj then it works), but it works with array-like object)-----------

const obj = {
    "0":"name",
    "1":"age",
    length: 2,
}

const objObs = from(obj);

objObs.subscribe((data)=>{
    console.log(data);
})


//-----( with string ( cause strings are also array-like object))----------
const str = "i am string";

const obsStr = from(str);
obsStr.subscribe((data)=>{
    console.log(data);
})


//-----------( work with object( for this need to convert object to iterable object))

const user = {
    id: 25,
    name: "gaganshu",
    pro: "coder"
}


const objKeyOble = from( Object.keys(user));  
const objValOble = from( Object.values(user));  
const objEtrsrOble = from( Object.entries(user));  
const objEtrsrWithMapOble = from(  Object.entries(user).map(([ key, value]:[ string, any])=>({ key, value}) ) ); 
const gopnOble = from( Object.getOwnPropertyNames(user));
const objEtrsrWithHMapOble = from(new Map(Object.entries(user)));

//keys 
objKeyOble.subscribe((data)=>{
    console.log(data);
})

//values
objValOble.subscribe((data)=>{
    console.log(data);
})

//enteries
objEtrsrOble.subscribe((data)=>{
    console.log(data);
})

// enteries with map
objEtrsrWithMapOble.subscribe((data)=>{
    console.log(data);
})

// getOwnPropertyNames
gopnOble.subscribe((data)=>{
    console.log(data);
})

// enteries with key,value map
objEtrsrWithHMapOble.subscribe((data) => {
  console.log(data);
});






//-----------( with generator function )---------------------------
                                        


const user = {
    id: 25,
    name: "gaganshu",
    pro: "coder"
}

//--- generator function
function* makeIterator( start=0, end=Infinity, step=1){

    for( let i=start; i<=end; i+=step){
        yield i;
    }

}

const itrG = makeIterator( 1, 30, 2);

const itrG_Obs = from(itrG);

itrG_Obs.subscribe((data)=>{
    console.log(data);
})

*/



/*(5). ( from Event with node streams) :-   */

/*

//---- ( generally this is this way to read data) ----------
const rs = createReadStream(".gitignore", { encoding:"utf8"});
rs.on( "data", (data)=>{
    console.log(data);
})

//---- ( with fromEvent ) ----------
const rss = fromEvent( createReadStream(".gitignore"), "data");

rss.subscribe((data)=>{
    console.log("::::|| ",data);
})

*/


/*(6). ( from Event with event emitter) :-   */

/*

//------- ( generally this is this way to listen) -------------------
class myEvent extends EventEmitter{}

const mt = new myEvent();

mt.on( "ironman1", (data)=>{
    console.log(`i am ironman1 {${data}}`);
})

mt.on("ironman1", (data)=>{
    console.log(":::::::::::::::::::::::: ",data)
})


mt.emit("ironman1","Tony Stark");

//------- ( with fromEvent) -------------------

const mt1 = new myEvent();

fromEvent( mt1, "ironman2").subscribe((data)=>{
    console.log( `i am ironman2 {${data}}    --fromEvent`);
});

setTimeout(()=>{
    mt1.emit("ironman2", "Tony Stark");
},4000);

*/


/*(7). ( fromEvent with my Custom event emitter( /more-helpers/events.ts)) :-  */

/*

//------- ( Implementing Custom EventEmitter( /more-helpers/events.ts )  ) -------------------

const myImpEvent = new EventEmitterC();

myImpEvent.on("a", console.log);
myImpEvent.on("a",console.log);

myImpEvent.emit("a","hello world!! --a")

//----( using fromEvent )---------------

// ---- ( this method calls one method from  these [ on, addListener, addEventListener ], on subscribe ) -----------
const subImpE = fromEvent( myImpEvent, "b").subscribe((data)=>{
    console.log("i am listening using fromEvent: ",data);
})


myImpEvent.emit("b","hello world!! --b")

// ---- ( on unsubscribe, off method automatically call []  ) -----------

subImpE.unsubscribe();
//this method not work , cause the handler for "b" is deleted using call one of these methods [ off, removeListener, removeEventListener ]
myImpEvent.emit("b","000000000000000000000")



*/



/*(8). ( interval) :-   */

/*

const intervalObs = interval(1000);

//// --give count from 0 to infinity
intervalObs.subscribe(console.log);  


//// --we can stop interval on unsubscribe condition
const ilObsSub = intervalObs.subscribe((data)=>{
    if(data===10){
        ilObsSub.unsubscribe();
    }
    console.log("second interval: ",data);
})


//// --we can call api on interval, and unsubscribe when interval count greater then 4
const intObsSub2 = intervalObs.subscribe((intervalData)=>{

    if((intervalData+1)>4){
        intObsSub2.unsubscribe();
        return;
    }

    from( fetch(`https://jsonplaceholder.typicode.com/comments/${intervalData+1}`))
    .subscribe((resData)=>{
        from(resData.json())
        .subscribe((resJsonData)=>{
            console.log("data: ",resJsonData);
        }) 
    })
})


*/

/*(9). timer */

/* 

//// ---- (runs first time only , if we gave one argument ) ----
timer( 1000).subscribe((data)=>{
    console.log(" 1: ",data);
})

//// ---- (runs first time for first argument and after that interval starts with second value as timer , if two arguments we gave ) ----
timer( 2000, 6000).subscribe((data)=>{
    console.log(" 2: ",data);
})   

//// ---- ( give time also as a timer ) ----
timer( new Date("08/03/2025 17:30:30"), 7000).subscribe((data)=>{
    console.log(" 3: ",data); 
})

*/


/*(10). Range Operator */                // it is synchronous operation

/*
// it is synchronous operation
console.log("start");
range(10,10).subscribe(console.log);
console.log("end");
*/


/*(11). generate  Operator */      // same as like for loop           // it is synchronous operation

/*

//// generate numbers based on condition( same as for loop)

const genNumOp = generate({
    initialState: 1,
    condition: (c) => c <= 20 ,
    iterate: (i) => i + 2,
    resultSelector: (r:number)=>"count: "+r
})

genNumOp.subscribe(console.log);

//// generate dates logic



const startDate = new Date("10/03/2025");
const endDate = new Date("10/22/2025");

function nextDate( date:Date){
    const newDate = new Date( date.setDate( date.getDate() + 1));
    return newDate;
}



const genDateOp = generate({
    initialState: startDate, 
    condition: (c:Date) => c.getDate() < endDate.getDate(),
    iterate: (i)=> nextDate(i),
    resultSelector: (r:Date)=> "Curr Date: " + r
})

genDateOp.subscribe(console.log);
      
*/




/*(12). iif operator */ 

/*
let isAuthenticated = true;

const iifObs = iif( ()=>isAuthenticated, from(["tony","cap"]), of("guard"));

iifObs.subscribe(console.log);

isAuthenticated=false;


iifObs.subscribe((data)=>{
    console.log("after change::- ",data);
});


isAuthenticated = true;

setTimeout(()=>{
    iifObs.subscribe((data)=>{
        console.log(":::: ",data);
    })
},7000);

*/






/*(----). firstValueFrom and lastValueFrom  */

////// number array example 

/*
const arr:number[] = [ 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

firstValueFrom(from(arr))
.then((data)=>{
  console.log("firstValueFrom data:: ",data);
})
.catch((err)=>{
  console.log("err1:: ",err);
})

lastValueFrom(from(arr))
.then((data)=>{
  console.log("lastValueFrom data:: ",data);
})
.catch((err)=>{
  console.log("err1:: ",err);
})




////// api example 

// first value from --
from(fetch("https://jsonplaceholder.typicode.com/todos")).subscribe((resDate) => {
    from(resDate.json()).subscribe((rjData) => {
        firstValueFrom(from(rjData))
            .then((data) => {
                console.log("firstValueFrom data:: ", data);
            })
            .catch((err) => {
                console.log("err1:: ", err);
            })
    })
})

//last value from --
from(fetch("https://jsonplaceholder.typicode.com/todos")).subscribe((resDate) => {
    from(resDate.json()).subscribe((rjData) => {
        lastValueFrom(from(rjData))
            .then((data) => {
                console.log("lastValueFrom data:: ", data);
            })
            .catch((err) => {
                console.log("err1:: ", err);
            })
    })
})

*/





export default app;