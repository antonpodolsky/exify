import { DomListener } from '../../dom-listener';
import {
  IUserSettings,
  DefaultExifProperties,
  IExifData,
  IExifDataProp,
} from '../../types';
import { map } from '../../utils';
import { Component } from '../../lib/component';
import { CssClasses, OverlayHeight } from '../../constants';

interface IProps {
  openSettings?: (exifData: IExifData) => any;
}

interface IScope {
  status?: Status;
  userExifData?: IExifDataProp[];
}

enum Status {
  Loading = 'loading',
  Success = 'success',
  Error = 'error',
}

const getUserExifProps = (
  exifData: IExifData,
  { optionalExifProperties }: IUserSettings
) =>
  map([...Object.keys(DefaultExifProperties), ...optionalExifProperties])(
    prop => exifData[prop]
  );

export class Overlay extends Component<IProps, IScope> {
  private image: HTMLImageElement;
  private exifData: IExifData;

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
  }" ex-if="status === 'success' "ex-click="onSettingsClick()">more_horiz</span>
        <exify-exif ex-if="status === 'success'" data="userExifData"></exify-exif>
      </div>
    </div>
  `;

  constructor(root: HTMLElement, props: IProps) {
    super(root, props);

    this.events = {
      onSettingsClick: () => this.props.openSettings(this.exifData),
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

    this.updateScope({
      status: Status.Loading,
    });
  }

  public exif(exifData: IExifData, userSettings?: IUserSettings) {
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
