import { DomListener } from '../utils/dom-listener';
import { createOverlay, renderExif, setError, setLoaded } from './renderer';

export class Overlay {
  private overlay: HTMLElement;

  constructor(private document: Document, private domListener: DomListener) {}

  private attach(overlay: HTMLElement, image: HTMLImageElement) {
    this.document.body.appendChild(overlay);
    this.domListener.onOverlayMouseOut(overlay, image, () => this.remove());

    return overlay;
  }

  public renderOverlay(image: HTMLImageElement) {
    this.remove();

    this.overlay = this.attach(createOverlay(this.document, image), image);
  }

  public renderExif(exifData: object) {
    if (!this.overlay) {
      return;
    }

    if (!exifData) {
      setError(this.overlay);
      return;
    }

    renderExif(this.overlay, exifData);
    setLoaded(this.overlay);
  }

  public remove() {
    if (this.overlay) {
      this.overlay.remove();
    }

    this.overlay = null;
  }
}
