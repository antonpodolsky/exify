import { Component } from '../../lib/component';
import { Css } from '../../css';

import './switch.scss';

interface IProps {
  on: boolean;
  onChange: (on: boolean) => void;
}

interface IScope {
  on: boolean;
}

export class Switch extends Component<IProps, IScope> {
  protected template = `
    <span class="${
      Css.Pointer
    }" ex-attr-checked="on" ex-click="onClick()"></span>
  `;

  constructor(root: HTMLElement, props: IProps) {
    super(root, props);

    this.events = {
      onClick: () =>
        props.onChange(root.querySelector('span').toggleAttribute('checked')),
    };

    this.updateScope({
      on: props.on,
    });
  }
}

Component.register('exify-switch', Switch as any);
