import { compile } from './ex';

export class Component<P = {}, S = {}, T extends HTMLElement = HTMLElement> {
  protected template: string = null;
  protected element: T = null;
  protected scope: S = null;
  protected events = null;
  private linked = false;

  constructor(protected root: HTMLElement, protected props?: P) {}

  private static registry: { [key: string]: typeof Component } = {};
  public static register(name: string, component: typeof Component) {
    Component.registry[name] = component;
  }

  protected link(element: T) {
    return;
  }

  protected unlink(element: T) {
    return;
  }

  protected updateScope(scope: S) {
    this.scope = { ...this.events, ...this.scope, ...scope };
    this.render();
  }

  protected render() {
    if (this.linked) {
      this.destroy(true);
    }

    this.element = compile<T>(this.template, Component.registry)(this.scope);
    this.root.appendChild((this.element as unknown) as HTMLElement);

    if (!this.linked) {
      this.link(this.element);
      this.linked = true;
    }

    return this.element;
  }

  public destroy(mute = false) {
    if (!this.element) {
      return;
    }

    ((this.element as unknown) as HTMLElement).remove();

    if (!mute) {
      this.unlink(this.element);
    }
  }
}
