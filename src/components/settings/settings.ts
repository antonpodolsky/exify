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

interface IProps {
  settings: ISettings;
}

interface IScope {
  props: IExifDataProp[];
  enabled: boolean;
}

const getOptionalExifProps = (
  exifData: IExifData,
  optionalExifProperties: Array<OptionalExifProperties[0]>
) =>
  map(OptionalExifProperties, [])((value, prop) => ({
    name: prop,
    title: value,
    value: exifData[prop] && exifData[prop].value,
    selected: optionalExifProperties.indexOf(prop) !== -1,
  }));

export class Settings extends Component<IProps, IScope, HTMLDialogElement> {
  protected template = template;

  constructor(root: HTMLElement) {
    super(root);
  }

  protected link(dialog: HTMLDialogElement) {
    dialogPolyfill.registerDialog(dialog);

    dialog.showModal();
    dialog.classList.add(Css.Show);
  }

  public show(exifData: IExifData, settings: ISettings) {
    return new Promise<ISettings>((resolve, reject) => {
      this.events = {
        save: () => Events.save(this.scope, this.element, resolve),
        cancel: () => Events.cancel(this.element, reject),
        toggleEnabled: enabled => Events.toggleEnabled(this.scope, enabled),
        toggleProp: (prop, element) => Events.toggleProp(prop, element),
      };

      this.updateScope({
        props: getOptionalExifProps(exifData, settings.optionalExifProperties),
        enabled: settings.enabled,
      });
    }).finally(() => this.destroy());
  }
}
