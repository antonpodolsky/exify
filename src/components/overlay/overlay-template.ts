import { Css } from '../../css';

export default `
  <div ex-class="'${Css.Overlay}--' + status + ' ' + '${
  Css.Overlay
}--' + size + ' ' + '${Css.Overlay}--' + (showExif ? 'visible' : 'hidden')">
    <div class="${Css.OverlayBackground}" ex-if="showExif"></div>
    <div class="${Css.OverlayContent}">
      <exify-exif ex-if="showExif" data="userExifData" size="size"></exify-exif>

      <div 
        class="${Css.Loader} ${Css.Pointer} ${Css.DontShrink}"
        ex-mouseover="onLogoHover()"
        ex-click="onSettingsClick()"
      ></div>
    </div>
  </div>
`;
