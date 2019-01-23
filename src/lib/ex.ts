import { each, query, querySelf, reduce } from '../utils';

export const compile = <E extends HTMLElement>(
  elementOrTemplate: string | E,
  registry = {}
) => scope => {
  const element = resolveElement(elementOrTemplate) as E;

  repeat(element, scope);
  condition(element, scope);
  component(element, scope, registry);
  html(element, scope);
  cssClass(element, scope);
  events(element, scope);

  return element;
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

const repeat = (element: HTMLElement, scope: object, attr = 'ex-repeat') =>
  query(element, `[${attr}]`)(el => {
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
  });

const condition = (element: HTMLElement, scope: object, attr = 'ex-if') =>
  query(element, `[${attr}]`)(el => {
    if (!evalInScope(el.getAttribute(attr), scope)) {
      el.remove();
    }

    el.removeAttribute(attr);
  });

const component = (element: HTMLElement, scope: object, registry: object) =>
  querySelf(element, Object.keys(registry).join(','))(
    el =>
      new registry[(el.tagName.toLowerCase())](
        el,
        reduce(Array.from(el.attributes))(
          (res, { name, value }) => (res[name] = evalInScope(value, scope))
        )
      )
  );

const html = (element: HTMLElement, scope: object, attr = 'ex-html') =>
  query(element, `[${attr}]`)(el => {
    el.innerHTML = escapeHTML(evalInScope(el.getAttribute(attr), scope));
    el.removeAttribute(attr);
  });

const cssClass = (element: HTMLElement, scope: object, attr = 'ex-class') =>
  querySelf(element, `[${attr}]`)(el => {
    el.classList.add(evalInScope(el.getAttribute(attr), scope));
    el.removeAttribute(attr);
  });

const events = (element: HTMLElement, scope: object, types = ['click']) =>
  types.forEach(type =>
    (attr =>
      querySelf(element, `[${attr}]`)(el => {
        const expression = el.getAttribute(attr);

        el.removeAttribute(attr);
        el.addEventListener(type, () =>
          evalInScope(expression, { ...scope, $element: el })
        );
      }))(`ex-${type}`)
  );

const evalInScope = (expression: string, scope: object) =>
  (() =>
    // tslint:disable-next-line:no-eval
    eval(
      Object.keys(scope).reduce(
        (res, key) => res.replace(key, `this.${key}`),
        expression
      )
    )).call(scope);

const escapeHTML = (value: any) => {
  return ('' + value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};
