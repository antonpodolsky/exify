import * as dialogPolyfill from 'dialog-polyfill';
import { CssClasses } from '../../constants';
import { createSettingsDialog } from './settings-renderer';
import * as Events from './settings-events';
import { IUserSettings, OptionalExifProperties } from '../../types';
import { reduce } from '../../utils';

const initEvents = (dialog: HTMLDialogElement) =>
  new Promise<IUserSettings>((resolve, reject) =>
    dialog.addEventListener('click', ({ target }) =>
      [
        [CssClasses.SettingsProperty, Events.toggle],
        [CssClasses.SettingsSave, () => Events.save(dialog, resolve)],
        [CssClasses.SettingsCancel, () => Events.cancel(dialog, reject)],
      ].forEach(([className, action]: any) => {
        const element = (target as HTMLElement).closest(`.${className}`);
        return element && action(element);
      })
    )
  );

const getOptionalExifProps = (exifData: object, userSettings: IUserSettings) =>
  reduce(OptionalExifProperties)(
    (res, _, key) =>
      (res[key] = {
        value: exifData[key],
        selected: userSettings.optionalExifProperties.indexOf(key) !== -1,
      })
  );

export class Settings {
  constructor(private document: Document) {}

  private attach(dialog: HTMLDialogElement) {
    dialogPolyfill.registerDialog(dialog);

    this.document.body.appendChild(dialog).showModal();
    dialog.classList.add(CssClasses.Show);

    return initEvents(dialog);
  }

  public showSettings(exifData: object, userSettings: IUserSettings) {
    return this.attach(
      createSettingsDialog(
        this.document,
        getOptionalExifProps(exifData, userSettings)
      )
    );
  }
}
