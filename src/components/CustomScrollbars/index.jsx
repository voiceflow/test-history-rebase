import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

import { ThumbVertical, TrackVertical } from './components';

const CustomScrollbars = (props, ref) => (
  <Scrollbars
    ref={ref}
    autoHide
    renderThumbVertical={(props) => <ThumbVertical {...props} />}
    renderTrackVertical={(props) => <TrackVertical {...props} />}
    {...props}
  />
);

export default React.forwardRef(CustomScrollbars);
