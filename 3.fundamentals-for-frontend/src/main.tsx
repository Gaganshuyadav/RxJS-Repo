import { combineLatest, concat, defer, from, fromEvent, iif, interval, merge, of, range, timer} from "rxjs";
import { ajax } from "rxjs/ajax";




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

/*(9). zip operator */







