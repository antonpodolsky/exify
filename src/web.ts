import { readExif } from './utils/exif-reader';
import { Exify } from './exify';

import './overlay/overlay.css';

new Exify(document).init(readExif);
