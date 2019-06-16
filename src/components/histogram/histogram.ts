import MG from 'metrics-graphics';
import { Component } from '../../lib/component';

import 'metrics-graphics/dist/metricsgraphics.css';
import './histogram.scss';

interface IProps {
  image: HTMLImageElement;
  readHistogram(): Promise<any>;
}

interface IScope {
  histogram?: number[];
}

export class Histogram extends Component<IProps, IScope> {
  protected template = `
    <span>Loading histogram...</span>
  `;

  constructor(root: HTMLElement, props: IProps) {
    super(root, props);

    this.updateScope({});
  }

  protected async link() {
    const histogram = await this.props.readHistogram();

    this.destroy();

    const colors = [
      ['avg', '#c4c4c4'],
      // ['r', '#FF967E'],
      // ['g', '#7FB139'],
      // ['b', '#6BC9DC'],
    ];

    MG.data_graphic({
      target: this.root,
      width: 600,
      height: 120,
      buffer: 0,
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      x_accessor: 'x',
      y_accessor: 'y',
      color: colors.map(([_, color]) => color),
      area: [true, true, true, true],
      x_axis: false,
      y_axis: false,
      x_sort: false,
      show_rollover_text: false,
      data: colors.map(([color]) => histogram[color].map((y, x) => ({ x, y }))),
    });
  }
}

Component.register('exify-histogram', Histogram as any);
