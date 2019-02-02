import { DomListener } from '../../dom-listener';
import {
  ISettings,
  DefaultExifProperties,
  IExifData,
  IExifDataProp,
} from '../../types';
import { map } from '../../utils';
import { Component } from '../../lib/component';
import { Css, OverlayHeight, Status } from '../../constants';
import template from './overlay-template';

interface IProps {
  onOpenSettings?: (exifData: IExifData) => any;
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

  constructor(
    private image: HTMLImageElement,
    root: HTMLElement,
    props: IProps
  ) {
    super(getRoot(root), props);

    this.events = {
      onSettingsClick: () => this.props.onOpenSettings(this.exifData),
    };

    this.updateScope({
      status: Status.Loading,
    });
  }

  protected link() {
    const { top, left, width, height } = this.image.getBoundingClientRect();

    this.root.style.top = `${top + height - OverlayHeight}px`;
    this.root.style.left = `${left}px`;
    this.root.style.width = `${width}px`;
    this.root.style.height = `${OverlayHeight}px`;

    DomListener.onOverlayMouseOut(this.root, this.image, () => this.destroy());
  }

  protected unlink() {
    if (!this.root) {
      return;
    }

    this.root.remove();
  }

  public showExif(exifData: IExifData, settings?: ISettings) {
    if (!this.element) {
      return;
    }

    if (!exifData) {
      this.updateScope({ status: Status.Error });
      return;
    }

    this.updateScope({
      status: Status.Success,
      userExifData: getUserExifProps(exifData, settings),
    });

    this.exifData = exifData;

    return this;
  }
}
