import { Css, CheckboxIcon } from '../markdown';
import { ISettings } from '../../types';

const destroy = (dialog: HTMLDialogElement, props, next) => {
  if (props.animate) {
    dialog.classList.remove(Css.Show);
    dialog.addEventListener('transitionend', e => {
      if (e.propertyName === 'transform') {
        dialog.close();
        next();
      }
    });
  } else {
    dialog.close();
    next();
  }
};

export const toggleProp = (prop, element: HTMLElement) => {
  const checkbox = element.querySelector(`.${Css.Icon}`);

  prop.selected = !prop.selected;
  checkbox.innerHTML = prop.selected ? CheckboxIcon.On : CheckboxIcon.Off;
};

export const toggleEnabled = (scope, enabled: boolean) => {
  scope.enabled = enabled;
};

export const save = (
  scope,
  props,
  dialog: HTMLDialogElement,
  next: (settings: ISettings) => void
) =>
  destroy(dialog, props, () => {
    next({
      optionalExifProperties: scope.props
        .filter(prop => prop.selected)
        .map(({ name }) => name),
      enabled: scope.enabled,
    });
  });

export const cancel = (dialog: HTMLDialogElement, props, next) =>
  destroy(dialog, props, next);
