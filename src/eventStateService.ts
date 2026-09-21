import { Injectable, signal } from '@angular/core';
import { EventStateInstance } from "./index.js"
@Injectable({
  providedIn: 'root' 
})
export class EventStateService {
  public state = signal((EventStateInstance as any).state)
  public instance = EventStateInstance;
  public reduce = this.instance.reduce;
  public sideChainEffect = this.instance.sideChainEffect; 

  get(key: string): any {
    return (this.state as any)[key];
  }

  set(key: string, value: any): void {
    const newState = {...(EventStateInstance as any)[key], ...value};
    this.state.set(newState)
  }

  public createStore (key: string, initialValue: any) {
    EventStateInstance.createStore(key, initialValue)
    this.state.set(EventStateInstance.state)
  }
  
  public deleteStore (key: string) {
    (EventStateInstance as any)[key].deleteStore(key)
    this.state.set(EventStateInstance.state)
  }
}