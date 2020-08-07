import './overlay.scss';
import template from './overlay-template';

import React from 'react';
import ReactDOM from 'react-dom';
import { Overlay as OverlayComp } from './OverlayComp';
import { DomListener } from '../../lib/dom-listener';
import { ISettings, IExifData, IExifDataProp } from '../../types';
import { Component } from '../../lib/component';
import { Status } from '../../constants';
import { Css } from '../../css';
import {
  OverlayHeight,
  OverlayCompactHeight,
  DefaultExifProperties,
} from '../../config';
import { map } from '../../utils';

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
  protected cb: (exifPops: IExifDataProp[]) => void;

  constructor(root: HTMLElement, props: IProps) {
    super(getRoot(root), props);

    ReactDOM.render(
      <OverlayComp
        settings={this.props.settings}
        onLogoClick={() => this.props.onLogoClick(this.exifData)}
        subscribe={cb => (this.cb = cb)}
      />,
      this.root
    );

    this.reposition();
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
    ReactDOM.unmountComponentAtNode(this.root);
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
    this.exifData = exifData;

    this.cb(
      getUserExifProps(
        exifData || {
          ISO: {
            value: 'test value',
          },
        },
        this.props.settings
      )
    );

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
