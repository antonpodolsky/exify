import {
  OverlayClasses,
  OverlayExifProperties,
  OverlayHeight,
} from '../constants';

const getOverlayHtml = () => `
  <div class="${OverlayClasses.Background}"></div>
  <div class="${OverlayClasses.Content}">
    <i class="${OverlayClasses.Loader} ${OverlayClasses.Icon}">camera</i>
    <div class="${OverlayClasses.PropertyList}"></div>
  </div>
`;

const getExifDataHtml = (exifData: object) =>
  OverlayExifProperties.map(
    exifProp => `
      <div>
        <div class="${OverlayClasses.PropertyName}">${exifProp}</div>
        <div class="${OverlayClasses.PropertyValue}">${exifData[exifProp]}</div>
      </div>
    `
  ).join('');

export class Overlay {
  private overlay: HTMLElement;

  constructor(private document: Document) {}

  public renderOverlay(image: HTMLImageElement) {
    const { top, left, width, height } = image.getBoundingClientRect();
    const overlay = this.document.createElement('div');

    overlay.innerHTML = getOverlayHtml();
    overlay.className = OverlayClasses.Overlay;
    overlay.style.top = `${top + height - OverlayHeight}px`;
    overlay.style.left = `${left}px`;
    overlay.style.width = `${width}px`;
    overlay.style.height = `${OverlayHeight}px`;

    this.remove();
    this.overlay = overlay;
    this.document.body.appendChild(overlay);
  }

  public renderExifData(exifData: object) {
    if (!this.overlay) {
      return;
    }

    const exifPropertyList = this.overlay.querySelector(
      `.${OverlayClasses.PropertyList}`
    );

    exifPropertyList.innerHTML = getExifDataHtml(exifData);

    this.overlay.classList.replace(
      OverlayClasses.Overlay,
      `${OverlayClasses.Overlay}--loaded`
    );
  }

  public remove() {
    this.overlay = null;
    this.document
      .querySelectorAll(
        `.${OverlayClasses.Overlay}, .${OverlayClasses.Overlay}--loaded`
      )
      .forEach(element => element.remove());
  }
}
