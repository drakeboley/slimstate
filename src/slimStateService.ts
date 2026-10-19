import { Injectable, signal } from '@angular/core';
import { SlimStateInstance } from "./index.js";

@Injectable({
  providedIn: 'root' 
})
export class SlimStateService {
  public instance = SlimStateInstance;
  public state = signal(new Map(this.instance.state));

  public reduce = this.instance.reduce.bind(this.instance);
  public sideChainEffect = this.instance.sideChainEffect.bind(this.instance);

  get(key: string): any {
    return this.instance.get(key);
  }

  set(key: string, value: any): void {
    this.instance.set(key, value);
    this.state.set(new Map(this.instance.state));
  }

  public createStore(key: string, initialValue: any): void {
    this.instance.createStore(key, initialValue);
    this.state.set(new Map(this.instance.state));
  }
  
  public deleteStore(key: string): void {
    this.instance.deleteStore(key);
    this.state.set(new Map(this.instance.state));
  }
}
