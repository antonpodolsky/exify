const isImage = (element: Element) => element.tagName === 'IMG';

const invokeHandler = (element: Element, handler) =>
  isImage(element) && handler(element);

export class DomListener {
  private handlers = {
    mouseout: (x: MouseEvent) => x,
    mouseover: (x: MouseEvent) => x,
  };

  constructor(private document: Document) {
    Object.keys(this.handlers).forEach(event =>
      this.document.addEventListener(event, e => this.handlers[event](e))
    );
  }

  public onImageMouseIn(handler: (image: HTMLImageElement) => any) {
    this.handlers.mouseover = ({ toElement }) =>
      invokeHandler(toElement, handler);

    return this;
  }

  public onImageMouseOut(handler: (image: HTMLImageElement) => any) {
    this.handlers.mouseout = ({ fromElement }) =>
      invokeHandler(fromElement, handler);

    return this;
  }
}
