import { each } from '../utils';

export const compile = <T = HTMLElement>(
  elementOrTemplate: string | HTMLElement
) => (scope): T => {
  const element = resolveElement(elementOrTemplate);

  (attr =>
    element.querySelectorAll(`[${attr}]`).forEach(el => {
      const [itemsAlias, itemAlias] = el.getAttribute(attr).split('::');
      el.removeAttribute(attr);

      each(scope[itemsAlias])(value =>
        el.parentElement.appendChild(
          compile(el.cloneNode(true) as HTMLElement)({
            ...scope,
            [itemAlias]: value,
          })
        )
      );

      el.remove();
    }))('ex-repeat');

  (attr =>
    element.querySelectorAll(`[${attr}]`).forEach(el => {
      el.innerHTML = escapeHTML(evalInScope(el.getAttribute(attr), scope));
      el.removeAttribute(attr);
    }))('ex-html');

  ['click'].forEach(event =>
    [element, ...Array.from(element.querySelectorAll(`[ex-${event}]`))].forEach(
      el => {
        const expression = el.getAttribute(`ex-${event}`);

        if (!expression) {
          return;
        }

        el.removeAttribute(`ex-${event}`);
        el.addEventListener(event, () =>
          evalInScope(expression, { ...scope, $element: el })
        );
      }
    )
  );

  return element as any;
};

const resolveElement = (elementOrTemplate: HTMLElement | string) => {
  let element;

  if (typeof elementOrTemplate === 'string') {
    const template = document.createElement('template');
    template.innerHTML = elementOrTemplate.trim();
    element = template.content.firstChild as HTMLElement;
  } else {
    element = elementOrTemplate;
  }

  return element;
};

const evalInScope = (expression: string, scope: object) =>
  (() =>
    // tslint:disable-next-line:no-eval
    eval(
      Object.keys(scope).reduce(
        (res, key) => res.replace(key, `this.${key}`),
        expression
      )
    )).call(scope);

const escapeHTML = (value: string) => {
  return ('' + value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};
