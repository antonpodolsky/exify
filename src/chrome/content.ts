import { Overlay } from '../overlay/overlay';
import { DomListener } from '../utils/dom-listener';
import { getExifData } from './api';

const overlay = new Overlay(
  document,
  new DomListener(document)
    .onImageMouseIn(image => {
      overlay.renderOverlay(image);
      getExifData(image).then(exifData => overlay.renderExifData(exifData));
    })
    .onImageMouseOut(() => overlay.remove())
    .onScroll(() => overlay.remove())
);
