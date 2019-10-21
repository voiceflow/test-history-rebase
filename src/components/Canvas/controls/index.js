import _ from 'lodash';

import { ControlScheme } from '../constants';
import Mouse from './mouse';
import Trackpad from './trackpad';

const generateControls = (scheme, handle) => {
  const mouse = new Mouse(handle);

  const controls = {
    get isPanning() {
      return mouse.isPanning;
    },
    mousedown: mouse.mousedown,
    wheel: mouse.wheel,
    gesturestart: _.noop,
    gesturechange: _.noop,
  };

  if (scheme === ControlScheme.TRACKPAD) {
    const trackpad = new Trackpad(handle);

    controls.wheel = trackpad.wheel;
    controls.gesturestart = trackpad.gesturestart;
    controls.gesturechange = trackpad.gesturechange;
  }

  return controls;
};

export default generateControls;
