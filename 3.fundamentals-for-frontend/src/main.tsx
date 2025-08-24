import { combineLatest, concat, concatAll, concatMap, defer, EMPTY, exhaustMap, filter, from, fromEvent, iif, interval, map, merge, mergeAll, mergeMap, Observable, of, race, range, switchMap, timer, zip} from "rxjs";
import { ajax } from "rxjs/ajax";


/*Creation Operators:- Used to create an Observable */
/*Pipeable Operators:- Takes an Observable as inout and returns a new Observable */


/*(1). ( fromEvent operator)---------------------------------------------------- */
 
/*

//---------( basics )---------

const fEventButtonObs = fromEvent(document.querySelector("button") as HTMLButtonElement, "click", { passive:false, once:false, capture:false });
const fEventBodyObs = fromEvent(document.querySelector("html") as HTMLElement, "click", { once:true, });

const sub = fEventButtonObs.subscribe((data)=>{
    console.log("Button: " ,data);
})

fEventBodyObs.subscribe((data)=>{
  console.log("Body: ",data);
})

fEventBodyObs.subscribe(console.log)

// sub.unsubscribe();
//if we unsubscribe then RxJS will call removeEventListener internally to detach the event handler. 


//---------( modify fromEvent data )---------

const buttonEventObs = fromEvent( document.querySelector("button") as HTMLButtonElement, "click", { once:false}, ( eve:Event)=>{
  return (eve.target as HTMLButtonElement).innerText;
});

buttonEventObs.subscribe((data)=>{
  console.log(data);
});

*/


/*(2). AJAX operator ( under the hood is uses XMLHttpRequest) */

/*

// const httpReq = ajax("https://jsonplaceholder.typicode.com/todos");

// const httpReq = ajax({ 
//   url: "https://jsonplaceholder.typicode.com/posts",
//   method:"post",
//   headers: {
//     Authorization:"Bearer sdfsdfdskjfsdkvmw324n23svd",
//     Accept:"application/json"
//   },
//   body:{
//     title:"new mask same task",
//     body:"i am coming, just waiting.... ",
//     userId:1
//   }
// });

// const httpReq = ajax.get("https://jsonplaceholder.typicode.com/posts");

// const httpReq = ajax.getJSON("https://jsonplaceholder.typicode.com/posts");

const httpReq = ajax.post("https://jsonplaceholder.typicode.com/posts", { hello:"world"}, { "x-some-optional-header":"value"});
httpReq.subscribe(console.log);



// httpReq.subscribe((resData)=>{
//     console.log(resData.response);
// })

httpReq.subscribe({
  next: (data)=>{
    console.log("data ",data);
  },
  error: ( err)=>{
    console.log("error: ",err);
  },
  complete: ()=>console.log("API working fine !!")
})


*/


/*(3). iif Operator */             /* refer :- backend( (12)- iif operator)*/

/*

////// example 1:-

const select = document.querySelector("select") as HTMLSelectElement;
const btn = document.querySelector(".btnCA") as HTMLButtonElement;

const iffObs = iif(
                  ()=>{return select.value==="posts"}, 
                  from(ajax.getJSON("https://jsonplaceholder.typicode.com/posts/1")),
                  from(ajax.getJSON("https://jsonplaceholder.typicode.com/todos/1")) 
                )




function callApi(data:any){
  iffObs.subscribe(console.log);
}

const btnObs = fromEvent(btn, "click");
btnObs.subscribe(callApi);

*/

/*(4). defer operator */

/*

////// example 1:-

const select = document.querySelector("select") as HTMLSelectElement;
const btn = document.querySelector(".btnCA") as HTMLButtonElement;

 
const deferObs = defer(()=>{

  switch(select.value){
    case "posts":
      return from(ajax.getJSON("https://jsonplaceholder.typicode.com/posts/1"));
    case "comments":
      return from(ajax.getJSON("https://jsonplaceholder.typicode.com/comments/1"));
    case "albums":
      return from(ajax.getJSON("https://jsonplaceholder.typicode.com/albums/1"));
    case "todos":
      return from(ajax.getJSON("https://jsonplaceholder.typicode.com/todos/1"));
    default:
      return from([]);
  }
  
})


function callApi(data:any){
  deferObs.subscribe(console.log);

}

const btnObs = fromEvent(btn, "click");
btnObs.subscribe(callApi);



////// example 2:-

const btn = document.querySelector(".btnCA");
const deferObs = defer(()=>of((new Date()).getSeconds()) );

btn?.addEventListener("click", ()=>{
  console.log("==")
  deferObs.subscribe(console.log);
})



////// example 3:-

const btn = document.querySelector(".btnCA");
const deferObs = defer(()=>of((new Date()).getSeconds()) );

btn?.addEventListener("click", ()=>{
  console.log("==")
  deferObs.subscribe(console.log);
})

setInterval(()=>{
  deferObs.subscribe((data)=>{ console.log("setTimeout data:: ",data)});
},6000);




////// example 4:-


const btn = document.querySelector(".btnCA");
let id = 1;

const deferObs = defer(()=>{

  if( id>3){
    return from(ajax.getJSON(`https://jsonplaceholder.typicode.com/posts/${id}`));
  }
  else{
    return from(ajax.getJSON(`https://jsonplaceholder.typicode.com/comments/${id}`));
  }
  
});

btn?.addEventListener("click", ()=>{
  deferObs.subscribe(console.log);
  id++;
})

*/

/* Join Creation Operator */
/*(5). concat operator */                               /* it subscribe observables one by one(sequentially) , if error occur in any observavles then it stops and concat never complete and also not subscribe next observable   */

/*
//// example:-1

const obs1 = from(["i","am","ironman"]);
const obs2 = ajax.getJSON("https://jsonplaceholder.typicode.com/todos");
const obs3 = of(1,2,3,4,5);

concat( obs1, obs2, obs3).subscribe({
  next:console.log,
  complete:()=>{console.log("all observables completed");},
  error:()=>{
    console.log("error occurs")
  }
});  

//// example:-2 ( intervalObs never complete cause it is an interval, and rangeObs never start, which means concat Obs never completed )

const intervalObs = interval(1000);
const rangeObs = range(1,5);

concat(intervalObs,rangeObs).subscribe(console.log);

*/


/*(6). merge operator */      /* concurrently subscribe every observable, but it completed only if every observable is completed */   

/*

//// example:1 
// const intervalObs1 = timer( 6000, 3000);
// const intervalObs2 = timer( 3000, 3000);

// merge( intervalObs1, intervalObs2).subscribe({
//   next:console.log,
//   complete: ()=>{
//     console.log("completed");
//   }
// })

//// example:2 ( concurrently) ( we can also set concurrent factor)
const apiObs1 = ajax.getJSON("https://jsonplaceholder.typicode.com/todos")
const apiObs2 = ajax.getJSON("https://jsonplaceholder.typicode.com/posts");

// merge( apiObs1, apiObs2, 1).subscribe({             //now acts as concat operator, cause subscribe only one and then move to another
// merge( apiObs1, apiObs2, 2).subscribe({             // now as concurrently, cause subscribe 2 at a time
merge( apiObs1, apiObs2).subscribe({
  next:console.log,
  complete: ()=>{
    console.log("Completed");
  }
})

*/

/*(7). combineLatest operator */

/*
//// example:1:- using timers ( it emits value, only if all observables emits at least one value, and this cause loss of old values which emits value before the all observables emits their values)

const t1 = timer( 0, 1000);
const t2 = timer( 5000, 1000);

combineLatest( [t1, t2]).subscribe(console.log);
//// combineLatest( {t1, t2} ).subscribe(console.log); 



//// example:2:- dom-based example

const width = fromEvent(document.querySelector(".width2") as HTMLInputElement, "input");
const height = fromEvent(document.querySelector(".height2") as HTMLInputElement, "input");
const result = document.querySelector(".resultAOWH") as HTMLInputElement;

combineLatest( [width, height]).subscribe((dataArr)=>{

  const firstNum = dataArr[0].target ? Number((dataArr[0].target as HTMLInputElement).value) : 0;
  let secondNum = dataArr[1].target ? Number((dataArr[1].target as HTMLInputElement).value) : 0;
  result.innerText = String(firstNum*secondNum);
})
 
*/


/*(8). forkJoin operator */   /* it emits the last values of each observables in an array */

/*
//// example:1:- using timers ( it emits value, only if all observables emits at least one value, and this cause loss of old values which emits value before the all observables emits their values)

const o1 = of( 11, 20, 3, 14);
const o2 = timer(1500);
const o3 = from([ "A", "B", "C"]);
const o4 = Promise.resolve(true);

combineLatest( [ o1, o2, o3, o4]).subscribe(console.log);


*/

/*(9). zip operator */  /* it gives only combined values */

/*

//// example:1  

const o1 = of( "A", "B", "C", "D", "E");
const o2 = of( 1, 2, 3);

zip( o1, o2).subscribe(console.log);


//// example:2  

const t1 = of( 21, 2132);
const t2 = interval(1000);

zip( t1, t2).subscribe(console.log);


//// example:3

const oo1 = of( 10, 20, 30);
const oo2 = of( 11, 21, 31, 41);
const oo3 = of( 12, 22);
const oo4 = of( 13, 23, 33, 43, 53);

zip( oo1, oo2, oo3, oo4 ).subscribe(console.log);

*/


/*(10). race operator */    /* takes multiple observables and emits the value from the first one that emits a value */

/* 

//// example:1:-    // it always picks the fast one , that emits or takes very less time
// const t1 = interval( 1000);
// const t2 = interval( 200);
// const t3 = interval( 3000);

// race( t1, t2, t3).subscribe(console.log);


//// example:2:- between synchronous and asynchronous, it always choose synchronous   // 
const o1 = of( "A", "B", "C", "D");
const o2 = of( 2222, 3333, 4444, 5555);
const o3 = interval( 1000);

race( o1, o2, o3).subscribe(console.log);



//// example:3:- race is useful , if we need fast data ( based on fast network )  // 

*/

/*(11). EMPTY operator */

/*

//// example:1  ( Use EMPTY when you want an observable that does nothing and completes immediately)

EMPTY.subscribe({
  next: () => console.log('Will never happen'),
  complete: () => console.log('Done')
});


//// example:2 

let isDownloaded = false;

const download = defer(()=>{
  
  if( isDownloaded){
    return EMPTY;
  }
  else{
    return from(ajax.getJSON("https://jsonplaceholder.typicode.com/posts/1"));
  }
})

const downloadBtn = document.querySelector(".downloadBtn") as HTMLButtonElement;

fromEvent( downloadBtn, "click").subscribe(()=>{
  
  download.subscribe({
    next: (data)=>{
      isDownloaded = true;
      console.log("downloaded data ",data);
    },
    complete: ()=>{
      console.log("Download Done!!")
    }
  })
})

*/


/* Pipeable Operators:- Pipeable Operator ia a pure Higher-Order Function takes an Observable as input and returns a new Observable
Pipeable Operators Categories:- Transformation, Filtering, Conditional, Mathematical/Aggregate, Join, Utility
*/

// const obs = of( 1, 2 , 3, 4, 5, 6);
// obs.pipe( 
//   filter((n)=>{ return n%2===0}), 
//   map((n)=>n+n)).subscribe((data)=>{
//     console.log(data);
// });



/*(12). map */

/* 
//// example-

type User = {id:number, name:string, username:string, email:string};

(ajax.getJSON("https://jsonplaceholder.typicode.com/users") as Observable<User[]>).subscribe((data)=>{ 
    from<Array<User>>(data)
      .pipe( map((user)=>user.username))
      .subscribe(console.log)  
  } 
);

console.log(";;;;;;;;;;;;;;;;;;;;;;;;;;;");

(ajax.getJSON("https://jsonplaceholder.typicode.com/users") as Observable<User[]>).subscribe((data)=>{ 
    from<Array<User>>(data)
      .pipe( map((user)=>user.username.toUpperCase() ))
      .subscribe(console.log)  
  } 
);

*/


/*(13). Higher-Order Observable:- a higher-order observable is simply an observable whose values are themselves observables. */
/*

//// example:1 

of(1, 2, 3, 4, 5)
  .pipe( 
    map((val)=>ajax.getJSON(`https://jsonplaceholder.typicode.com/users/${val}`) ) 
  )
  .subscribe((data)=>{
  // subscribe each observable
  data.subscribe(console.log);
});

//// example:2

of(1,2,3).pipe( map((val)=>range( val, 3))).subscribe((data)=>{
  data.subscribe(console.log);
  console.log("----")
})

*/


/*(Higher Order Mapping Operators:- concatMap, mergeMap, switchMap, exhaustMap) 
    and 
  (Higher Order Flattening Operators:- concatAll, mergeAll, switchAll, exhaustAll, combineLatestAll)
*/

/*(14). concatMap operator :- it creates an queue and manage inner observables, and add and wait from first async data , and then first getting data , then call to next */

/* Use Case:- when you need to preserve order and run tasks sequentially[ queued api calls, file uploads, transaction processing ]*/

/*

//// without concatMap
from([ 1, 2, 3, 4, 5])
  .pipe(
    map((val)=>{
      return of(val*3);
    })
  )
  .subscribe((o)=>{
    o.subscribe(console.log);
  })

  //// with concatMap
  from([ 1, 2, 3, 4, 5])         // ---- outer observable
    .pipe(
      concatMap((val)=>{
        return of(val*5);        // ---- inner observable
      })
    )
    .subscribe(console.log);

//// example:-

const urls = [ "https://jsonplaceholder.typicode.com/users/1", "https://jsonplaceholder.typicode.com/users/2", "https://jsonplaceholder.typicode.com/users/3" ]

from(urls)
  .pipe( 
    concatMap((url)=>{
      return ajax.getJSON(url);
    })
  )
  .subscribe(console.log);

*/


/*(15). mergeMap operator :- it concurrently subscribe each observable */

/* Use Case:- when you want to handle all inner observables concurrently [ fetch, clicks, websockets, streams, sensor data, batch jobs]*/

/*

// const urls = [ "https://jsonplaceholder.typicode.com/users/1", "https://jsonplaceholder.typicode.com/users/2", "https://jsonplaceholder.typicode.com/users/3" ]

from(urls)
  .pipe( 
    mergeMap((url)=>{
      return ajax.getJSON(url);
    })
  )
  .subscribe(console.log);

*/


/*(16). switchMap operator :-  cancel or unsubscribe old requests and allow to finish only the last request, ( used for live search/autocomplete ) */

/* Use Case:- Autocomplete, live data*/

/*

const urls = [ "https://jsonplaceholder.typicode.com/users/1", "https://jsonplaceholder.typicode.com/users/2", "https://jsonplaceholder.typicode.com/users/3" ]

from(urls)
  .pipe( 
    switchMap((url)=>{
      return ajax.getJSON(url);
    })
  )
  .subscribe(console.log);

  */


/*(17). exhaustMap operator :-  Preventing spamming of requests( only work on one request at a time and cancel or unsubscribe the requests which comes between starting and ending of this request ) (e.g., button click → submit form). */

/* Use Case:- form submission, login requests, scroll/gesture handling */

/*

const urls = [ 
  "https://jsonplaceholder.typicode.com/posts/1", 
  "https://jsonplaceholder.typicode.com/users/2", 
  "https://jsonplaceholder.typicode.com/users/3",
  "https://jsonplaceholder.typicode.com/users/4",
  "https://jsonplaceholder.typicode.com/users/5",
  "https://jsonplaceholder.typicode.com/users/6"
]


from(urls)
  .pipe( 
    exhaustMap((url)=>{
      return ajax.getJSON(url);
    })
  )
  .subscribe(console.log);

  */

/*(18). concatAll ,mergeAll, switchAll, exhaustAll  operator :- do just flattening( means subscribes inner observables based on concat ,merge, switch, exhaust ) */


/*

const urls = [ 
  "https://jsonplaceholder.typicode.com/posts/1", 
  "https://jsonplaceholder.typicode.com/users/2", 
  "https://jsonplaceholder.typicode.com/users/3",
  "https://jsonplaceholder.typicode.com/users/4",
  "https://jsonplaceholder.typicode.com/users/5",
  "https://jsonplaceholder.typicode.com/users/6"
]


from(urls)
  .pipe( 
    map((url)=>{
      return ajax.getJSON(url);
    }),
    mergeAll()
  )
  .subscribe(console.log);

  */

