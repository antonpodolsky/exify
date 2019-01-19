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
      optionalExifProperties: Object.keys(scope.props).filter(
        prop => scope.props[prop].selected
      ),
    })
  );

export const cancel = (dialog: HTMLDialogElement, next) =>
  destroy(dialog, next);
