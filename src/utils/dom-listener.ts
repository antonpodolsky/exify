import { OverlayClasses, MinLongSideLength } from '../constants';

const isImage = (element: Element) => element && element.tagName === 'IMG';

const isImageBigEnough = (image: HTMLImageElement) =>
  image.width > image.height
    ? image.width >= MinLongSideLength
    : image.height >= MinLongSideLength;

const isOverlay = (element: Element) =>
  element &&
  (element.classList.contains(OverlayClasses.Overlay) ||
    element.closest(`.${OverlayClasses.Overlay}`));

const invokeImageHandler = (
  element: Element,
  handler,
  customCondition = () => true
) =>
  isImage(element) &&
  isImageBigEnough(element as HTMLImageElement) &&
  customCondition() &&
  handler(element);

export class DomListener {
  private imageHandlers = {
    mouseout: (x: MouseEvent) => x,
    mouseover: (x: MouseEvent) => x,
  };

  constructor(private document: Document) {
    Object.keys(this.imageHandlers).forEach(event =>
      this.document.addEventListener(event, e => this.imageHandlers[event](e))
    );
  }

  public onImageMouseIn(handler: (image: HTMLImageElement) => any) {
    this.imageHandlers.mouseover = ({ fromElement, toElement }) =>
      invokeImageHandler(toElement, handler, () => !isOverlay(fromElement));

    return this;
  }

  public onImageMouseOut(handler: (image: HTMLImageElement) => any) {
    this.imageHandlers.mouseout = ({ fromElement, toElement }) =>
      invokeImageHandler(fromElement, handler, () => !isOverlay(toElement));

    return this;
  }

  public onOverlayMouseOut(
    overlay: HTMLElement,
    handler: (overlay: HTMLElement) => any
  ) {
    overlay.addEventListener(
      'mouseleave',
      ({ toElement }) => !isImage(toElement) && handler(overlay)
    );

    return this;
  }
}
