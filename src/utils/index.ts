export const escapeHTML = (value: string) => {
  return ('' + value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

export const reduce = (input: object | any[], output = {}) => (
  fn: (res: object | any[], value: any, key?: any, isArray?: boolean) => any
) => {
  const isArr = isArray(input);

  return (isArr ? (input as any[]) : Object.keys(input)).reduce(
    (res, key, index) => {
      if (isArr) {
        fn(res, key, index, isArr);
      } else {
        fn(res, input[key], key, isArr);
      }

      return res;
    },
    output
  );
};

export const map = <I extends any[] | {}, O extends any[] | {} = I>(
  input: I,
  output?: O
) => <
  F extends (
    value: I extends any[] ? I[0] : I[keyof I],
    key?: I extends any[] ? number : keyof I
  ) => unknown
>(
  fn: F
) => {
  const isInputArray = isArray(input);
  output = output || ((isInputArray ? [] : {}) as any);
  const isOutputArray = isArray(output as any);

  return reduce(input, isOutputArray ? [] : {})((res, value, key) => {
    if (isOutputArray) {
      (res as any[]).push(fn(value, key));
    } else if (isInputArray) {
      res[value] = fn(value, key);
    } else {
      res[key] = fn(value, key);
    }
  }) as O extends any[]
    ? Array<ReturnType<F>>
    : { [key: string]: ReturnType<F> };
};

export const each = (input: object | any[]) => (
  fn: (value: any, key?: any, isArray?: boolean) => any
) => reduce(input)((_, ...args) => fn(...args));

export const query = (element: HTMLElement, selector: string) => (
  fn: (el: typeof element) => any
) => selector && element.querySelectorAll(selector).forEach(fn);

export const querySelf = (element: HTMLElement, selector: string) => (
  fn: (el: typeof element) => any
) =>
  selector &&
  [
    ...Array.from(selector ? element.querySelectorAll(selector) : []),
    ...(element.matches(selector) ? [element] : []),
  ].forEach(fn);

const isArray = (obj: object | any[]) =>
  typeof (obj as any[]).length !== 'undefined';
