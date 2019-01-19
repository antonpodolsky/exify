import { DomListener } from '../../dom-listener';
import { IUserSettings, DefaultExifProperties } from '../../types';
import { reduce } from '../../utils';
import { Component } from '../../lib/component';
import { CssClasses, OverlayHeight } from '../../constants';
import { Exif } from '../exif/exif';

const getUserExifProps = (
  exifData: object,
  { optionalExifProperties }: IUserSettings
) =>
  reduce([...Object.keys(DefaultExifProperties), ...optionalExifProperties])(
    (res, prop) => (res[prop] = { value: exifData[prop] })
  );

export class Overlay extends Component {
  private image: HTMLImageElement;
  private exifData: object;

  protected template = `
    <div class="${CssClasses.Overlay}">
      <div class="${CssClasses.OverlayBackground}"></div>
      <div class="${CssClasses.OverlayContent}">
        <div class="${CssClasses.Loader}"></div>
        <span class="${CssClasses.OverlaySettingsToggle} ${
    CssClasses.Icon
  }" ex-click="settings()">more_horiz</span>
      </div>
    </div>
  `;

  constructor(
    root: HTMLElement,
    scope: { settings: (exifData: object) => any }
  ) {
    super(root);

    const self = this;
    this.scope = {
      settings() {
        scope.settings(self.exifData);
      },
    };
  }

  protected link(element: HTMLElement) {
    const { top, left, width, height } = this.image.getBoundingClientRect();

    element.style.top = `${top + height - OverlayHeight}px`;
    element.style.left = `${left}px`;
    element.style.width = `${width}px`;
    element.style.height = `${OverlayHeight}px`;

    DomListener.onOverlayMouseOut(element, this.image, () => this.destroy());
  }

  public show(image: HTMLImageElement) {
    this.image = image;

    this.render();
  }

  public exif(exifData: object, userSettings?: IUserSettings) {
    if (!this.element) {
      return;
    }

    if (!exifData) {
      this.element.classList.add(`${CssClasses.Overlay}--error`);
      return;
    }

    new Exif(this.element.querySelector(`.${CssClasses.OverlayContent}`)).show(
      getUserExifProps(exifData, userSettings)
    );

    this.element.classList.add(`${CssClasses.Overlay}--loaded`);

    this.exifData = exifData;
  }
}
