import { ISettings } from './types';

export enum Css {
  Row = 'exify-row',
  Align = 'exify-align',
  Center = 'exify-center',
  Pointer = 'exify-pointer',
  Border = 'exify-border',
  Shadow = 'exify-shadow',
  SpaceH = 'exify-space-h',
  SpaceV = 'exify-space-v',
  X2 = 'exify-x2',
  Logo = 'exify-logo',
  Loader = 'exify-loader',
  Icon = 'exify-icon',
  Button = 'exify-button',
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
  SettingsProperty = 'exify-settings-property',
}

export enum CheckboxIcon {
  On = 'check_box',
  Off = 'check_box_outline_blank',
}

export enum Status {
  Loading = 'loading',
  Success = 'success',
  Error = 'error',
}

export enum BackgroundMethods {
  READ_EXIF,
}

export const DefaultSettings = {
  get: (): ISettings => ({
    optionalExifProperties: [],
    disabledDomains: [],
    enabled: true,
  }),
};

export const StorageKey = 'exifysettings';
export const OverlayHeight = 60;
export const MinLongSideLength = 600;
export const RequestTimeout = 4500;
