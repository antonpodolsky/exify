import { ChromeBackgroundMethods } from '../constants';
import { Overlay } from '../overlay/overlay';
import { DomListener } from '../utils/dom-listener';

const overlay = new Overlay(document);

new DomListener(document)
  .onImageMouseIn(image => {
    overlay.renderOverlay(image);

    chrome.runtime.sendMessage(
      {
        method: ChromeBackgroundMethods.GET_EXIF_DATA,
        args: [image.getAttribute('src'), image.getAttribute('exifdata')],
      },
      exifData => overlay.renderExifData(exifData)
    );
  })
  .onImageMouseOut(() => overlay.remove());
