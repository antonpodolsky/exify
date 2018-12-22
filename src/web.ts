import { DomListener } from './dom-listener';
import { getExifData } from './exif';
import { Overlay } from './overlay';

const overlay = new Overlay(document);

new DomListener(document)
  .onImageMouseIn(image =>
    getExifData(image).then(exifData => overlay.render(image, exifData))
  )
  .onImageMouseOut(() => overlay.remove());
