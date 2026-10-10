import { Injectable, signal } from '@angular/core';
import { SlimStateInstance } from "./index.js";

@Injectable({
  providedIn: 'root' 
})
export class SlimStateService {
  // Using a signal that holds a Map or object depending on what the user prefers
  // But wait, the original code had (SlimStateInstance as any).state which is the Map.
  // We can just keep a reference to instance
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

  public createStore (key: string, initialValue: any) {
    this.instance.createStore(key, initialValue);
    this.state.set(new Map(this.instance.state));
  }
  
  public deleteStore (key: string) {
    this.instance.deleteStore(key);
    this.state.set(new Map(this.instance.state));
  }
}
