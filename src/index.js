import { Observable, from, empty, interval, of, zip, fromEvent } from "rxjs";
import { map, delay, take, catchError, scan, filter } from "rxjs/operators";
import { ajax } from "rxjs/ajax";

document.getElementById("basic").addEventListener("click", basic);
document.getElementById("from-promise").addEventListener("click", fromPromise);
document.getElementById("http-get").addEventListener("click", httpGET);
document.getElementById("timeout").addEventListener("click", timeout);
document.getElementById("every-second").addEventListener("click", everySecond);
document.getElementById("multiply").addEventListener("click", multiply);
document.getElementById("handle-error").addEventListener("click", handleError);
document.getElementById("zip").addEventListener("click", zipMe);
document.getElementById("reduce").addEventListener("click", reduce);

function basic() {
  const myObservable$ = new Observable((subscriber) => {
    subscriber.next(1);
    subscriber.next(2);

    setTimeout(() => subscriber.next(3), 2000);

    return () => {
      console.log("Disposing subscriber");
    };
  });

  const myObserver = {
    next: (v) => console.log("Next: ", v),
    complete: () => console.log("Complete"),
    error: (err) => console.log("Error: ", err),
  };

  const subscribtion = myObservable$.subscribe(myObserver);

  subscribtion.unsubscribe();

  myObservable$.subscribe((v) => console.log("Next2: ", v));
}

function fromPromise() {
  const myPromise = new Promise((rs) =>
    setTimeout(() => rs("Finished!"), 2000)
  );

  from(myPromise).subscribe((v) => console.log("Promise: ", v));
}

function multiply() {
  from([4, 6, 1, 8, 9])
    .pipe(map((v) => v * v))
    .subscribe((v) => console.log("Multiply: ", v));
}

function httpGET() {
  console.log("Fetching...");

  ajax({
    url: "https://jsonplaceholder.typicode.com/users",
    method: "GET",
  })
    .pipe(
      map((response) => {
        console.log(response);
      })
    )
    .subscribe();
}

function timeout() {
  empty()
    .pipe(delay(3000))
    .subscribe({ complete: () => console.log("Timeout!") });
}

function everySecond() {
  interval(1000)
    .pipe(take(5))
    .subscribe((v) => console.log("Every second: ", v));
}

function handleError() {
  from([1, 2, 3, 4])
    .pipe(
      map((v) => {
        if (v === 3) throw new Error("this is 3rd value");
        return v;
      }),
      catchError((err) => {
        console.log("Error: ", err.message);
        return from([1, 2]);
      })
    )
    .subscribe((v) => console.log("Value: ", v));
}

function zipMe() {
  const names$ = of("Alex", "Brooks", "Amenda");
  const jobs$ = of("Software Engineer", "Cook", "Chef");

  zip(names$, jobs$)
    .pipe(map(([name, job]) => ({ name, job })))
    .subscribe((v) => console.log("Ziped: ", v));
}

function reduce() {
  const scan$ = of(1, 2, 3);

  scan$
    .pipe(scan((acc, v) => acc + v, 0))
    .subscribe((v) => console.log("Reduced: ", v));
}

function filtering() {
  const clickEvent$ = fromEvent(document, "click");

  clickEvent$
    .pipe(filter((e) => e.ctrlKey === true))
    .subscribe((v) => console.log("Filtered!"));
}

filtering();
