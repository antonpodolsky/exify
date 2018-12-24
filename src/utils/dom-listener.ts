import { MinLongSideLength, OverlayClasses } from '../constants';

const isImage = (element: Element) => element && element.tagName === 'IMG';

const isImageBigEnough = (image: HTMLImageElement) =>
  image.width > image.height
    ? image.width >= MinLongSideLength
    : image.height >= MinLongSideLength;

const isImageFullyVisible = (image: HTMLElement) => {
  const { scrollHeight, clientHeight } = image.parentElement;
  return scrollHeight === clientHeight;
};

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
  isImageFullyVisible(element as HTMLImageElement) &&
  customCondition() &&
  handler(element);

export class DomListener {
  private handlers = {
    mouseout: (e: MouseEvent) => e,
    mouseover: (e: MouseEvent) => e,
    scroll: (e: UIEvent) => e,
  };

  constructor(private document: Document) {
    Object.keys(this.handlers).forEach(event =>
      this.document.addEventListener(event, e => this.handlers[event](e))
    );
  }

  public onImageMouseIn(handler: (image: HTMLImageElement) => any) {
    this.handlers.mouseover = ({ fromElement, toElement }) =>
      invokeImageHandler(toElement, handler, () => !isOverlay(fromElement));

    return this;
  }

  public onImageMouseOut(handler: (image: HTMLImageElement) => any) {
    this.handlers.mouseout = ({ fromElement, toElement }) =>
      invokeImageHandler(fromElement, handler, () => !isOverlay(toElement));

    return this;
  }

  public onOverlayMouseOut(
    overlay: HTMLElement,
    image: HTMLImageElement,
    handler: (overlay: HTMLElement) => any
  ) {
    overlay.addEventListener(
      'mouseleave',
      ({ toElement }) => toElement !== image && handler(overlay)
    );

    return this;
  }

  public onScroll(handler: () => any) {
    this.handlers.scroll = handler;
    return this;
  }
}
