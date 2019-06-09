import 'dialog-polyfill/dialog-polyfill.css';
import * as dialogPolyfill from 'dialog-polyfill';
import { Css } from '../../constants';
import { map } from '../../utils';
import { Component } from '../../lib/component';
import {
  ISettings,
  OptionalExifProperties,
  IExifDataProp,
  IExifData,
} from '../../types';

import template from './settings-template';
import * as Events from './settings-events';

import './settings.scss';

interface IProps {
  animate: boolean;
}

interface IScope {
  props: IExifDataProp[];
  enabled: boolean;
  url: string;
  readHistogram: any;
}

const getOptionalExifProps = (
  exifData: IExifData,
  optionalExifProperties: Array<OptionalExifProperties[0]>
) =>
  map(OptionalExifProperties, [])((value, prop) => ({
    name: prop,
    title: value,
    value: exifData[prop] && exifData[prop].value,
    isHtml: exifData[prop] && exifData[prop].isHtml,
    selected: optionalExifProperties.indexOf(prop) !== -1,
  }));

export class Settings extends Component<IProps, IScope, HTMLDialogElement> {
  protected template = template;

  constructor(root: HTMLElement, props = { animate: true }) {
    super(root, props);
  }

  protected link(dialog: HTMLDialogElement) {
    dialogPolyfill.registerDialog(dialog);

    if (this.props.animate) {
      dialog.showModal();
      dialog.classList.add(Css.Show);
    } else {
      dialog.classList.add(Css.Show);
      dialog.showModal();
    }
  }

  public show(
    settings: ISettings,
    exifData: IExifData = {},
    readHistogram = null
  ) {
    return new Promise<ISettings>((resolve, reject) => {
      this.events = {
        save: () => Events.save(this.scope, this.props, this.element, resolve),
        cancel: () => Events.cancel(this.element, this.props, reject),
        toggleEnabled: enabled => Events.toggleEnabled(this.scope, enabled),
        toggleProp: (prop, element) => Events.toggleProp(prop, element),
      };

      this.updateScope({
        props: getOptionalExifProps(exifData, settings.optionalExifProperties),
        enabled: settings.enabled,
        url: settings.url,
        readHistogram,
      });
    }).finally(() => this.destroy());
  }
}
