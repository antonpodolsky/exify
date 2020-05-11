import { BackgroundMethods } from '../../constants';
import { fetchExif } from '../../lib/exif-reader';
import { fetchHistogram } from '../../utils';

const Methods: { [key: string]: (...args) => Promise<any> } = {
  [BackgroundMethods.FetchExif]: (src: string) => fetchExif(src),
  [BackgroundMethods.FetchHistogram]: (src: string) => fetchHistogram(src),
};

export const init = (browser: typeof chrome) =>
  browser.runtime.onMessage.addListener(({ method, args }, _, sendResponse) => {
    if (Methods[method]) {
      Methods[method](...args)
        .then(sendResponse)
        .catch(sendResponse);
      return true;
    }
  });
