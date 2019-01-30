import { IUserSettings } from './types';

export enum CssClasses {
  Shadow = 'exify-shadow',
  Logo = 'exify-logo',
  Loader = 'exify-loader',
  Icon = 'exify-icon',
  Show = 'exify-show',
  PropertyList = 'exify-property-list',
  PropertyName = 'exify-property-name',
  PropertyValue = 'exify-property-value',
  Overlay = 'exify-overlay',
  OverlayBackground = 'exify-overlay-background',
  OverlayContent = 'exify-overlay-content',
  OverlaySettingsToggle = 'exify-overlay-settings-toggle',
  Settings = 'exify-settings',
  SettingsHeader = 'exify-settings-header',
  SettingsContent = 'exify-settings-content',
  SettingsFooter = 'exify-settings-footer',
  SettingsSave = 'exify-settings-save',
  SettingsCancel = 'exify-settings-cancel',
  SettingsProperty = 'exify-settings-property',
}

export enum CheckboxIcon {
  On = 'check_box',
  Off = 'check_box_outline_blank',
}

export enum BackgroundMethods {
  READ_EXIF,
}

export const DefaultUserSettings: IUserSettings = {
  optionalExifProperties: [],
  disabledDomains: [],
};

export const StorageKey = 'exifyUserSettings';
export const OverlayHeight = 60;
export const MinLongSideLength = 600;
export const RequestTimeout = 4500;
