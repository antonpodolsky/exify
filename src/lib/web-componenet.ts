export class WebComponent extends HTMLElement {
  constructor(name: string) {
    super();

    customElements.define(`exify-${name}`, WebComponent);
  }
}
