import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

import { ThumbVertical, TrackVertical } from './components';

const CustomScrollbars = (props) => (
  <Scrollbars
    renderThumbVertical={(props) => <ThumbVertical {...props} />}
    renderTrackVertical={(props) => <TrackVertical {...props} />}
    {...props}
  />
);

export default CustomScrollbars;
