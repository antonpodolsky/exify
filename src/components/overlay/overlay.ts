import './overlay.scss';
import template from './overlay-template';

import { DomListener } from '../../lib/dom-listener';
import { ISettings, IExifData, IExifDataProp } from '../../types';
import { map } from '../../utils';
import { Component } from '../../lib/component';
import { Status } from '../../constants';
import { Css } from '../../css';
import {
  DefaultExifProperties,
  OverlayHeight,
  OverlayCompactHeight,
} from '../../config';

interface IProps {
  image: HTMLImageElement;
  settings: ISettings;
  onLogoClick: (exifData: IExifData) => any;
  onMouseOut: () => any;
}

interface IScope {
  status?: Status;
  userExifData?: IExifDataProp[];
  showExif?: boolean;
  size?: string;
}

const getUserExifProps = (
  exifData: IExifData,
  { optionalExifProperties }: ISettings
): IExifDataProp[] =>
  map([...Object.keys(DefaultExifProperties), ...optionalExifProperties])(
    prop => exifData[prop]
  );

const getRoot = (root: HTMLElement) => {
  const res = document.createElement('div');

  res.classList.add(Css.Overlay);
  root.appendChild(res);

  return res;
};

export class Overlay extends Component<IProps, IScope> {
  private exifData: IExifData;
  protected template = template;

  constructor(root: HTMLElement, props: IProps) {
    super(getRoot(root), props);

    this.events = {
      onSettingsClick: () => this.props.onLogoClick(this.exifData),
      onLogoHover: () => this.onLogoHover(),
    };

    this.updateScope({
      status: Status.Loading,
      showExif: false,
      size: props.settings.overlaySize,
    });
  }

  protected link() {
    this.reposition();

    DomListener.onOverlayMouseOut(
      this.root,
      this.props.image,
      this.props.onMouseOut
    );
  }

  protected unlink() {
    if (!this.root) {
      return;
    }

    this.root.remove();
  }

  protected onLogoHover() {
    if (
      this.props.settings.overlayToggleType === 'logoHover' &&
      this.scope.status === Status.Success &&
      !this.scope.showExif
    ) {
      this.updateScope({ showExif: true });
    }
  }

  public setExif(exifData: IExifData) {
    if (!this.element) {
      return;
    }

    if (!exifData) {
      this.updateScope({ status: Status.Error });
      return;
    }

    this.updateScope({
      status: Status.Success,
      userExifData: getUserExifProps(exifData, this.props.settings),
      showExif: this.props.settings.overlayToggleType === 'imageHover',
    });

    this.exifData = exifData;

    return this;
  }

  public reposition() {
    const {
      top,
      left,
      width,
      height,
    } = this.props.image.getBoundingClientRect();

    const overlayHeight =
      this.props.settings.overlaySize === 'compact'
        ? OverlayCompactHeight
        : OverlayHeight;

    this.root.style.top = `${top + height - overlayHeight}px`;
    this.root.style.left = `${left}px`;
    this.root.style.width = `${width}px`;
    this.root.style.height = `${overlayHeight}px`;
  }
}
