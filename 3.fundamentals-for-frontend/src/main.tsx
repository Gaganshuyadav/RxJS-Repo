import { from, fromEvent} from "rxjs";
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

// /*

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


// */





