import { Css, CheckboxIcon } from '../../constants';

export default `
  <dialog class="${Css.Settings}">
    <div class="${Css.SpaceV} ${Css.X2} ${Css.Border}">
      <div class="${Css.SettingsHeader} ${Css.Row} ${Css.Align} ${Css.SpaceH}">
        <div class="${Css.Logo}"></div>
        <span>EXIFY Settings</span>
      </div>

      <div class="${Css.SettingsContent} ${Css.SpaceV} ${Css.Border} ${Css.X2}">
        <div class="${Css.Row} ${Css.Align} ${Css.SpaceH} ${Css.X2}">
          <div>Enabled on this site</div>
          <exify-switch on="enabled" on-change="toggleEnabled"></exify-switch>
        </div>

        <div class="${Css.Row} ${Css.SpaceH} ${Css.X2}">
          <div>Additional properties</div>
          <div class="${Css.SpaceV} ${Css.X2}">
            <div 
              class="${Css.Row} ${Css.Align} ${Css.Pointer} ${Css.SpaceH}" 
              ex-repeat="props::prop" 
              ex-click="toggleProp(prop, $element)"
            >
              <span class="${Css.Icon}" ex-html="prop.selected ? '${
  CheckboxIcon.On
}' : '${CheckboxIcon.Off}'"></span>
              <div>
                <div class="${
                  Css.PropertyName
                }" ex-if="!!prop.value" ex-html="prop.title"></div>
                <div class="${
                  Css.PropertyValue
                }" ex-html="prop.value || prop.title"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="${Css.SettingsFooter} ${Css.Row} ${Css.Center} ${Css.SpaceH}">
        <div class="${Css.Button}" ex-click="cancel()">Cancel</div>
        <div class="${Css.Button}" ex-click="save()">Save</div>
      </div>
    </div>
  </dialog>  
`;
