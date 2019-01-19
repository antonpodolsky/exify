import * as dialogPolyfill from 'dialog-polyfill';
import { CssClasses, CheckboxIcon } from '../../constants';
import * as Events from './settings-events';
import { IUserSettings, OptionalExifProperties } from '../../types';
import { reduce } from '../../utils';
import { formatValue } from '../exif/exif';
import { Component } from '../../lib/component';

const getOptionalExifProps = (exifData: object, userSettings: IUserSettings) =>
  reduce(OptionalExifProperties)(
    (res, _, key) =>
      (res[key] = {
        name: key,
        title: OptionalExifProperties[key],
        value: formatValue(exifData[key], OptionalExifProperties[key] as any),
        selected: userSettings.optionalExifProperties.indexOf(key) !== -1,
      })
  );

export class Settings extends Component<HTMLDialogElement> {
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

  protected link(dialog: HTMLDialogElement) {
    dialogPolyfill.registerDialog(dialog);

    dialog.showModal();
    dialog.classList.add(CssClasses.Show);
  }

  public open(exifData: object, userSettings: IUserSettings) {
    return new Promise<IUserSettings>((resolve, reject) => {
      this.scope = {
        props: getOptionalExifProps(exifData, userSettings),
        save: () => Events.save(this.scope, this.element, resolve),
        cancel: () => Events.cancel(this.element, reject),
        toggle: (prop, element) => Events.toggle(prop, element),
      };

      this.render();
    }).finally(() => this.destroy());
  }
}
