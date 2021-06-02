import React from 'react';
import { ScrollbarProps, Scrollbars as ReactScrollbars } from 'react-custom-scrollbars';

import { ThumbVertical, TrackVertical } from './components';

export interface Scrollbars extends ReactScrollbars {
  view: HTMLDivElement;
}

const CustomScrollbars = (props: ScrollbarProps, ref: React.Ref<Scrollbars>) => (
  <ReactScrollbars
    ref={ref}
    autoHide
    renderThumbVertical={(props: any) => <ThumbVertical {...props} />}
    renderTrackVertical={(props: any) => <TrackVertical {...props} />}
    {...props}
  />
);

export default React.forwardRef(CustomScrollbars);
