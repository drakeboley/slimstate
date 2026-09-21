import { Injectable, signal } from '@angular/core';
import { SlimStateInstance } from "./index.js"
@Injectable({
  providedIn: 'root' 
})
export class SlimStateService {
  public state = signal((SlimStateInstance as any).state)
  public instance = SlimStateInstance;
  public reduce = this.instance.reduce;
  public sideChainEffect = this.instance.sideChainEffect; 

  get(key: string): any {
    return (this.state as any)[key];
  }

  set(key: string, value: any): void {
    const newState = {...(SlimStateInstance as any)[key], ...value};
    this.state.set(newState)
  }

  public createStore (key: string, initialValue: any) {
    SlimStateInstance.createStore(key, initialValue)
    this.state.set(SlimStateInstance.state)
  }
  
  public deleteStore (key: string) {
    (SlimStateInstance as any)[key].deleteStore(key)
    this.state.set(SlimStateInstance.state)
  }
}