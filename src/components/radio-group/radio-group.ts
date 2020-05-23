import { Component } from '../../lib/component';
import { Css } from '../../css';

import './radio-group.scss';

interface IProps {
  model: string;
  options: Array<{ title: string; value: string }>;
  onChange: (model: string) => void;
}

interface IScope {
  model?: string;
  options?: Array<{ title: string; value: string }>;
}

export class RadioGroup extends Component<IProps, IScope> {
  protected template = `
    <div class="${Css.Align} ${Css.SpaceH} ${Css.X2}">
      <span 
        class="${Css.Align} ${Css.SpaceH} ${Css.Pointer}"
        ex-repeat="options::option"
        ex-click="onClick(option.value)"
        ex-attr-title="option.description"
      >
        <span
          class="${Css.Icon}"
          ex-html="option.value === model ? 'radio_button_checked' : 'radio_button_unchecked'"
        ></span>
        <span class="${Css.TextMd}" ex-html="option.title"></span>
      </span>
    </div>
  `;

  constructor(root: HTMLElement, props: IProps) {
    super(root, props);

    this.events = {
      onClick: model => {
        this.updateScope({
          model,
        });

        props.onChange(model);
      },
    };

    this.updateScope({
      model: props.model,
      options: props.options,
    });
  }
}

Component.register('exify-radio-group', RadioGroup as any);
