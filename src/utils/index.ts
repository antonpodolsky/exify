export const escapeHTML = (value: string) => {
  return ('' + value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

export const reduce = (obj: object | any[]) => (
  fn: (res: object, value: any, key?: string) => any
) => {
  const isObject = typeof (obj as any[]).length === 'undefined';

  return (isObject ? Object.keys(obj) : (obj as any[])).reduce((res, key) => {
    if (isObject) {
      fn(res, obj[key], key);
    } else {
      fn(res, key);
    }

    return res;
  }, {});
};
