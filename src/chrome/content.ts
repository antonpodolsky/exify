import { ChromeBackgroundMethods } from '../constants';
import { DomListener } from '../dom-listener';
import { Overlay } from '../overlay';

const overlay = new Overlay(document);

new DomListener(document)
  .onImageMouseIn(image =>
    chrome.runtime.sendMessage(
      {
        method: ChromeBackgroundMethods.GET_EXIF_DATA,
        args: [image.getAttribute('src'), image.getAttribute('exifdata')],
      },
      exifData => overlay.render(image, exifData)
    )
  )
  .onImageMouseOut(() => overlay.remove());
