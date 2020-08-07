import React from 'react';
import { IExifDataProp } from '../../types';

interface Props {
  prop: IExifDataProp;
  size: 'default' | 'compact';
}

export const Property = (props: Props) => {
  return (
    <div>
      {props.prop && props.size === 'default' && (
        <div className="exify-property-name">{props.prop.title}</div>
      )}

      <div className="exify-property-value">
        {!props.prop || props.prop.value === null ? '--' : props.prop.value}
      </div>
    </div>
  );
};
