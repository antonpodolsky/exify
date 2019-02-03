import { Css, Status } from '../../constants';

export default `
  <div ex-class="'${Css.Overlay}--' + status">
    <div class="${Css.OverlayBackground}"></div>
    <div class="${Css.OverlayContent}">
      <div class="${Css.Loader}" 
        ex-if="status === '${Status.Loading}' || status === '${Status.Error}'"
      ></div>
      <exify-exif 
        ex-if="status === '${Status.Success}'" data="userExifData"
      ></exify-exif>
    </div>
    <div 
      class="${Css.OverlaySettingsToggle} ${Css.Icon}"
      ex-if="status === '${Status.Success}'"
      ex-click="onSettingsClick()"
    >more_horiz</div>
  </div>
`;
