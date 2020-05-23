import 'metrics-graphics/dist/metricsgraphics.css';
import './histogram.scss';

import MG from 'metrics-graphics';
import { Component } from '../../lib/component';
import { Css } from '../../css';

interface IProps {
  image: HTMLImageElement;
  fetchHistogram(): Promise<any>;
}

interface IScope {
  loading: boolean;
}

export class Histogram extends Component<IProps, IScope> {
  protected template = `
    <div>
      <span ex-if="loading">Loading histogram...</span>
      <div class="${Css.Row} ${Css.SpaceH} ${Css.X2}" ex-if="!loading">
        <div data-hook="exify-histogram-avg"></div>
        <div class="${Css.SpaceV}">
          <div data-hook="exify-histogram-r"></div>
          <div data-hook="exify-histogram-g"></div>
          <div data-hook="exify-histogram-b"></div>
        </div>
      </div>
    </div>
  `;

  constructor(root: HTMLElement, props: IProps) {
    super(root, props);

    this.updateScope({
      loading: true,
    });
  }

  protected async link() {
    const histogram = await this.props.fetchHistogram();

    this.updateScope({
      loading: false,
    });

    const charts = [
      ['avg', '#c4c4c4', 420, 128],
      ['r', '#ffb3ba', 160, 36],
      ['g', '#baffc9', 160, 36],
      ['b', '#bae1ff', 160, 36],
    ];

    charts.forEach(([name, color, width, height]) => {
      MG.data_graphic({
        target: this.root.querySelector(
          `[data-hook="exify-histogram-${name}"]`
        ),
        width,
        height,
        linked: true,
        buffer: 0,
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        x_accessor: 'x',
        y_accessor: 'y',
        color: [color],
        area: [true, true, true, true],
        x_axis: false,
        y_axis: false,
        x_sort: false,
        show_rollover_text: false,
        data: histogram[name].map((y, x) => ({ x, y })),
      });
    });
  }
}

Component.register('exify-histogram', Histogram as any);
