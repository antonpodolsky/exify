import { Overlay } from './overlay/overlay';
import { DomListener } from './utils/dom-listener';

export class Exify {
  constructor(private document) {}

  public init(readExif: (image: HTMLElement) => Promise<object>) {
    const overlay = new Overlay(this.document);

    new DomListener(this.document)
      .onImageMouseIn((image, onImageLoad) => {
        overlay.renderOverlay(image);

        onImageLoad(() =>
          readExif(image)
            .then(exifData => overlay.renderExif(exifData))
            .catch(() => overlay.renderExif(null))
        );
      })
      .onImageMouseOut(() => overlay.remove())
      .onScroll(() => overlay.remove());
  }
}
