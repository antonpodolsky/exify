import { Css } from '../markdown';
import { Status } from '../../constants';

export default `
  <div ex-class="'${Css.Overlay}--' + status">
    <div class="${Css.OverlayBackground}" ex-if="status === '${
  Status.Success
}'"></div>
    <div class="${Css.OverlayContent}">
      <exify-exif 
        ex-if="status === '${Status.Success}'" data="userExifData"
      ></exify-exif>

      <div class="${Css.Loader} ${Css.Pointer} ${Css.DontShrink}" 
        ex-click="onSettingsClick()"
      ></div>
    </div>
  </div>
`;
