import { fromEvent} from "rxjs";




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



