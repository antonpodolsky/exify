import * as dialogPolyfill from 'dialog-polyfill';
import { CssClasses, CheckboxIcon } from '../../constants';
import * as Events from './settings-events';
import {
  IUserSettings,
  OptionalExifProperties,
  IExifDataProp,
} from '../../types';
import { map } from '../../utils';
import { formatValue } from '../exif/exif';
import { Component } from '../../lib/component';

const getOptionalExifProps = (exifData: object, userSettings: IUserSettings) =>
  map(OptionalExifProperties, [])((value, key) => ({
    name: key,
    title: OptionalExifProperties[key],
    value: formatValue(exifData[key], value),
    selected: userSettings.optionalExifProperties.indexOf(key) !== -1,
  }));

export class Settings extends Component<
  {},
  {
    props: IExifDataProp[];
    save: () => any;
    cancel: () => any;
    toggle: (prop, element) => void;
  },
  HTMLDialogElement
> {
  protected template = `
    <dialog class="${CssClasses.Settings}">
      <div>
        <div class="${CssClasses.SettingsHeader}">
          <div class="${CssClasses.Logo}"></div>
          Additional EXIF properties
        </div>
        <div class="${CssClasses.SettingsContent}">
          <div class="${
            CssClasses.SettingsProperty
          }" ex-repeat="props::prop" ex-click="toggle(prop, $element)">
            <span class="${CssClasses.Icon}" ex-html="prop.selected ? '${
    CheckboxIcon.On
  }' : '${CheckboxIcon.Off}'"></span>
            <div>
              <div class="${
                CssClasses.PropertyName
              }" ex-html="prop.title"></div>
              <div class="${
                CssClasses.PropertyValue
              }" ex-html="prop.value"></div>
            </div>
          </div>
        </div>
        <div class="${CssClasses.SettingsFooter}">
          <div class="${CssClasses.SettingsSave}" ex-click="save()">Save</div>
          <div 
            class="${CssClasses.SettingsCancel}"
            ex-click="cancel()"
          >Cancel</div>
        </div>
      </div>
    </dialog>  
  `;

  constructor(root: HTMLElement) {
    super(root);
  }

  protected link(dialog: HTMLDialogElement) {
    dialogPolyfill.registerDialog(dialog);

    dialog.showModal();
    dialog.classList.add(CssClasses.Show);
  }

  public show(exifData: object, userSettings: IUserSettings) {
    return new Promise<IUserSettings>((resolve, reject) => {
      this.updateScope({
        props: getOptionalExifProps(exifData, userSettings),
        save: () => Events.save(this.scope, this.element, resolve),
        cancel: () => Events.cancel(this.element, reject),
        toggle: (prop, element) => Events.toggle(prop, element),
      });
    }).finally(() => this.destroy());
  }
}
