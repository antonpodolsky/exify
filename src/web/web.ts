import { readExif } from '../lib/exif-reader';
import { Exify } from '../exify';
import { Storage } from './storage';

import 'dialog-polyfill/dialog-polyfill.css';
import '../components/exify.scss';
import '../components/exif/exif.scss';
import '../components/overlay/overlay.scss';
import '../components/settings/settings.scss';
import '../components/switch/switch.scss';

new Exify(document).init(
  readExif,
  new Storage(localStorage, document.location as any)
);
