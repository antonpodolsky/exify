import { MinLongSideLength, Css, OverlayHeight } from '../constants';

const isImage = (element: Element) => element && element.tagName === 'IMG';

const isImageBigEnough = (image: HTMLImageElement) =>
  image.width > image.height
    ? image.width >= MinLongSideLength
    : image.height >= MinLongSideLength;

const isImageFullyVisible = (image: HTMLElement) => {
  const { scrollHeight, clientHeight } = image.parentElement;
  return scrollHeight - clientHeight < OverlayHeight / 2;
};

const isOverlay = (element: Element) =>
  element && element.closest(`.${Css.Overlay}`);

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

const waitForImageLoad = (image: HTMLImageElement) =>
  new Promise<HTMLImageElement>(resolve =>
    image.complete
      ? resolve(image)
      : image.addEventListener('load', () => resolve(image))
  );

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

  public static onOverlayMouseOut(
    overlay: HTMLElement,
    image: HTMLImageElement,
    handler: (overlay: HTMLElement) => any
  ) {
    overlay.addEventListener(
      'mouseleave',
      ({ relatedTarget: to }) => to !== image && handler(overlay)
    );
  }

  public onImageMouseIn(
    handler: (
      image: HTMLImageElement
    ) => (
      onImageLoad: (handler: (image: HTMLImageElement) => any) => any
    ) => any
  ) {
    this.handlers.mouseover = ({ target: to, relatedTarget: from }) =>
      invokeImageHandler(
        to as HTMLElement,
        image =>
          handler(image)(onImageLoad =>
            waitForImageLoad(image).then(onImageLoad)
          ),
        () => !isOverlay(from as HTMLElement)
      );

    return this;
  }

  public onImageMouseOut(handler: (image: HTMLImageElement) => any) {
    this.handlers.mouseout = ({ target: from, relatedTarget: to }) =>
      invokeImageHandler(
        from as HTMLElement,
        handler,
        () => !isOverlay(to as HTMLElement)
      );

    return this;
  }

  public onScroll(handler: () => any) {
    this.handlers.scroll = handler;
    return this;
  }
}
