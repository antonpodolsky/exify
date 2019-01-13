import { DomListener } from '../../dom-listener';
import {
  createOverlay,
  renderExif,
  setError,
  setLoaded,
} from './overlay-renderer';
import { IUserSettings, DefaultExifProperties } from '../../types';

const getUserExifProps = (
  exifData: object,
  { optionalExifProperties }: IUserSettings
) =>
  [...Object.keys(DefaultExifProperties), ...optionalExifProperties].reduce(
    (res, prop) => {
      res[prop] = { value: exifData[prop] };
      return res;
    },
    {}
  );

export class Overlay {
  private overlay: HTMLElement;
  private exifData;

  constructor(private document: Document) {}

  private attach(overlay: HTMLElement, image: HTMLImageElement) {
    this.document.body.appendChild(overlay);
    DomListener.onOverlayMouseOut(overlay, image, () => this.remove());

    return overlay;
  }

  public showOverlay(image: HTMLImageElement) {
    this.remove();

    this.overlay = this.attach(createOverlay(this.document, image), image);
  }

  public showExif(exifData: object, userSettings?: IUserSettings) {
    if (!this.overlay) {
      return;
    }

    if (!exifData) {
      setError(this.overlay);
      return;
    }

    renderExif(this.overlay, getUserExifProps(exifData, userSettings));
    setLoaded(this.overlay);

    this.exifData = exifData;
  }

  public remove() {
    if (this.overlay) {
      this.overlay.remove();
    }

    this.overlay = null;
  }

  public getExifData() {
    return this.exifData;
  }
}
