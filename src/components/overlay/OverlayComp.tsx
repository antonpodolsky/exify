import React, { useState, useEffect } from 'react';
import { Status } from '../../constants';
import { ISettings, IExifDataProp } from '../../types';
import { Property } from '..';

interface Props {
  settings: ISettings;
  onLogoClick: () => void;
  subscribe: (cb: (exifProps: IExifDataProp[]) => void) => void;
}

export const Overlay = (props: Props) => {
  const [status, setStatus] = useState(Status.Loading);
  const [exifProps, setExifProps] = useState<IExifDataProp[]>(null);

  useEffect(() => {
    props.subscribe(exifProperties => {
      if (!exifProperties) {
        setStatus(Status.Error);
        return;
      }

      setStatus(Status.Success);
      setExifProps(exifProperties);
    });
  }, []);

  return (
    <div
      className={`exify-overlay--${status} exify-overlay--${
        props.settings.overlaySize
      }`}
    >
      {status === Status.Success && (
        <div className="exify-overlay-background" />
      )}

      <div className="exify-overlay-content">
        {exifProps && (
          <div className="exify-exif">
            <div className="exify-property-list">
              {exifProps.map((prop, index) => (
                <Property
                  prop={prop}
                  size={props.settings.overlaySize}
                  key={index}
                />
              ))}
            </div>
          </div>
        )}

        <div
          className="exify-loader exify-pointer exify-dont-shrink"
          onClick={props.onLogoClick}
        />
      </div>
    </div>
  );
};
