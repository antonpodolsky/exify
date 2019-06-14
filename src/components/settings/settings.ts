import 'dialog-polyfill/dialog-polyfill.css';
import * as dialogPolyfill from 'dialog-polyfill';
import { Css } from '../markdown';
import { map } from '../../utils';
import { Component } from '../../lib/component';
import { ISettings, IExifDataProp, IExifData } from '../../types';
import { OptionalExifProperties } from '../../config';

import template from './settings-template';
import * as Events from './settings-events';

import './settings.scss';

interface IProps {
  animate: boolean;
  settings: ISettings;
  exifData?: IExifData;
  readHistogram?(): void;
}

interface IScope {
  props: IExifDataProp[];
  enabled: boolean;
  url: string;
  readHistogram?(): void;
}

const getOptionalExifProps = (
  exifData: IExifData = {},
  optionalExifProperties: string[]
): IExifDataProp[] =>
  map(OptionalExifProperties, [])((title, name) => ({
    name,
    title,
    value: exifData[name] && exifData[name].value,
    isHtml: exifData[name] && exifData[name].isHtml,
    selected: optionalExifProperties.indexOf(name) !== -1,
  }));

export class Settings extends Component<IProps, IScope, HTMLDialogElement> {
  protected template = template;

  constructor(root: HTMLElement, props) {
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

  public show() {
    return new Promise<ISettings>((resolve, reject) => {
      const { exifData, settings, readHistogram } = this.props;

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
