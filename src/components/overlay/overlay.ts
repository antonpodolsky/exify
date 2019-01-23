import { DomListener } from '../../dom-listener';
import { IUserSettings, DefaultExifProperties, IExifData } from '../../types';
import { map } from '../../utils';
import { Component } from '../../lib/component';
import { CssClasses, OverlayHeight } from '../../constants';

enum Status {
  Loading = 'loading',
  Success = 'success',
  Error = 'error',
}

const getUserExifProps = (
  exifData: object,
  { optionalExifProperties }: IUserSettings
) =>
  map([...Object.keys(DefaultExifProperties), ...optionalExifProperties], {})(
    prop => ({ name: prop, value: exifData[prop] })
  );

export class Overlay extends Component<
  {
    settings: (exifData: object) => any;
  },
  {
    settings?: () => any;
    status?: Status;
    userExifData?: IExifData;
  }
> {
  private image: HTMLImageElement;
  private exifData: object;

  protected template = `
    <div class="${CssClasses.Overlay}" ex-class="'${
    CssClasses.Overlay
  }--' + status">
      <div class="${CssClasses.OverlayBackground}"></div>
      <div class="${CssClasses.OverlayContent}">
        <div class="${
          CssClasses.Loader
        }" ex-if="status === 'loading' || status === 'error'"></div>
        <span class="${CssClasses.OverlaySettingsToggle} ${
    CssClasses.Icon
  }" ex-if="status === 'success' "ex-click="settings()">more_horiz</span>
        <exify-exif ex-if="status === 'success'" data="userExifData"></exify-exif>
      </div>
    </div>
  `;

  constructor(root: HTMLElement, props) {
    super(root, props);
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

    this.updateScope({
      settings: () => this.props.settings(this.exifData),
      status: Status.Loading,
    });
  }

  public exif(exifData: object, userSettings?: IUserSettings) {
    if (!this.element) {
      return;
    }

    if (!exifData) {
      this.updateScope({ status: Status.Error });
      return;
    }

    this.updateScope({
      status: Status.Success,
      userExifData: getUserExifProps(exifData, userSettings),
    });

    this.exifData = exifData;
  }
}
