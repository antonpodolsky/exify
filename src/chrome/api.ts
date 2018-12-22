export enum BackgroundMethods {
  GET_EXIF_DATA,
}

export const getExifData = (image: HTMLImageElement): Promise<object> =>
  new Promise(resolve =>
    chrome.runtime.sendMessage(
      {
        method: BackgroundMethods.GET_EXIF_DATA,
        args: [image.getAttribute('src'), image.getAttribute('exifdata')],
      },
      resolve
    )
  );
