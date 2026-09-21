// demo/webcomponent/index.ts
import { SlimStateInstance } from 'slimstate';

const state = new SlimStateInstance();
state.createStore('count', { value: 0 });

class CounterElement extends HTMLElement {
  state = state;
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }
  connectedCallback() {
    const button = document.createElement('button');
    button.textContent = 'Increment';
    button.addEventListener('click', () => {
      const current = state.get('count').value as number;
      state.set('count', { value: current + 1 });
    });
    this.shadowRoot?.appendChild(button);
    state.sideChainEffect('count', (data: any) => {
      const { value } = data
      button.textContent = `Count: ${value}`;
    });
  }
}
customElements.define('counter-element', CounterElement);
