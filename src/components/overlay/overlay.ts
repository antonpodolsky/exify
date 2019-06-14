import './overlay.scss';
import template from './overlay-template';

import { DomListener } from '../../lib/dom-listener';
import { ISettings, IExifData, IExifDataProp } from '../../types';
import { map } from '../../utils';
import { Component } from '../../lib/component';
import { Status } from '../../constants';
import { Css } from '../markdown';
import { DefaultExifProperties, OverlayHeight } from '../../config';

interface IProps {
  image: HTMLImageElement;
  settings: ISettings;
  onOpenSettings: (exifData: IExifData) => any;
  onMouseOut: () => any;
}

interface IScope {
  status?: Status;
  userExifData?: IExifDataProp[];
}

const getUserExifProps = (
  exifData: IExifData,
  { optionalExifProperties }: ISettings
) =>
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
      onSettingsClick: () => this.props.onOpenSettings(this.exifData),
    };

    this.updateScope({
      status: Status.Loading,
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

  public showExif(exifData: IExifData) {
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

    this.root.style.top = `${top + height - OverlayHeight}px`;
    this.root.style.left = `${left}px`;
    this.root.style.width = `${width}px`;
    this.root.style.height = `${OverlayHeight}px`;
  }
}
