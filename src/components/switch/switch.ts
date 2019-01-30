import { Component } from '../../lib/component';

interface IProps {
  on: boolean;
  onChange: (on: boolean) => void;
}

interface IScope {
  on: boolean;
}

export class Switch extends Component<IProps, IScope> {
  protected template = `
    <input type="checkbox" ex-attr-checked="on" ex-click="onClick()"/>
  `;

  constructor(root, props: IProps) {
    super(root, props);

    this.events = {
      onClick: () => {
        this.updateScope({ on: !this.scope.on });
        props.onChange(this.scope.on);
      },
    };

    this.updateScope({
      on: props.on,
    });
  }
}

Component.register('exify-switch', Switch as any);
