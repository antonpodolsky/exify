export const escapeHTML = (value: string) => {
  return ('' + value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

export const reduce = (obj: object | any[]) => (
  fn: (res: object, value: any, key?: any, isArray?: boolean) => any
) => {
  const isArr = isArray(obj);

  return (isArr ? (obj as any[]) : Object.keys(obj)).reduce(
    (res, key, index) => {
      if (isArr) {
        fn(res, key, index, isArr);
      } else {
        fn(res, obj[key], key, isArr);
      }

      return res;
    },
    {}
  );
};

export const each = (obj: object | any[]) => (
  fn: (value: any, key?: any, isArray?: boolean) => any
) => reduce(obj)((_, ...args) => fn(...args));

const isArray = (obj: object | any[]) =>
  typeof (obj as any[]).length !== 'undefined';
