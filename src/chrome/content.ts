import { readExif } from './api';
import { Exify } from '../exify';

new Exify(document).init(readExif);
