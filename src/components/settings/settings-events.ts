import { CssClasses, CheckboxIcon } from '../../constants';

const destroy = (dialog: HTMLDialogElement, next) => {
  dialog.classList.remove(CssClasses.Show);
  dialog.addEventListener('transitionend', () => {
    dialog.close();
    next();
  });
};

export const toggle = (prop, element: HTMLElement) => {
  const checkbox = element.querySelector(`.${CssClasses.Icon}`);

  prop.selected = !prop.selected;
  checkbox.innerHTML = prop.selected ? CheckboxIcon.On : CheckboxIcon.Off;
};

export const save = (scope, dialog: HTMLDialogElement, next) =>
  destroy(dialog, () =>
    next({
      optionalExifProperties: scope.props
        .filter(prop => prop.selected)
        .map(({ name }) => name),
    })
  );

export const cancel = (dialog: HTMLDialogElement, next) =>
  destroy(dialog, next);
