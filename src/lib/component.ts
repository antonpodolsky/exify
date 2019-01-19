import { compile } from './ex';

export class Component<T = HTMLElement> {
  protected template: string = null;
  protected element: T = null;
  protected scope: { [key: string]: any } = null;

  constructor(private root: HTMLElement) {}

  protected link(element: T) {
    return;
  }

  protected render() {
    this.destroy();

    this.element = compile<T>(this.template)(this.scope);
    this.root.appendChild((this.element as unknown) as HTMLElement);

    return this.link(this.element);
  }

  public destroy() {
    if (!this.element) {
      return;
    }

    ((this.element as unknown) as HTMLElement).remove();
  }
}
