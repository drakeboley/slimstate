import { Component } from '@angular/core';
import { createStore, set, get, deleteStore, sideChainEffect, reduce } from 'featherstate';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  counter = 0;
  key = 'demoCounter'
  value$ = createStore(this.key, { value: 0 });
  reduce = reduce;

  constructor() {
    // bind side effect to log changes
    sideChainEffect(this.key, (v) => console.log('counter changed:', v));
  }

  get() {
    return get(this.key)
  }

  getReduce() {
    return reduce(this.key, (data: any) => {
      return data.counter
    })
  }
  increment() {
    this.counter++;
    set(this.key, { value: this.counter });
  }

  reset() {
    this.counter = 0;
    set(this.key, { value: this.counter });
  }

  delete() {
    deleteStore(this.key);
  }

}
