import { Injectable, signal } from '@angular/core';
import { FeatherStateInstance } from "./index.js"
@Injectable({
  providedIn: 'root' 
})
export class FeatherStateService {
  public state = signal((FeatherStateInstance as any).state)
  public instance = FeatherStateInstance;
  public reduce = this.instance.reduce;
  public sideChainEffect = this.instance.sideChainEffect; 

  get(key: string): any {
    return (this.state as any)[key];
  }

  set(key: string, value: any): void {
    const newState = {...(FeatherStateInstance as any)[key], ...value};
    this.state.set(newState)
  }

  public createStore (key: string, initialValue: any) {
    FeatherStateInstance.createStore(key, initialValue)
    this.state.set(FeatherStateInstance.state)
  }
  
  public deleteStore (key: string) {
    (FeatherStateInstance as any)[key].deleteStore(key)
    this.state.set(FeatherStateInstance.state)
  }
}