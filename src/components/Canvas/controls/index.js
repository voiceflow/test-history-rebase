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

    Object.defineProperty(controls, 'isTrackpadPanning', {
      // eslint-disable-next-line lodash/prefer-constant
      get() {
        return trackpad.isPanning;
      },
    });
    controls.wheel = trackpad.wheel;
    controls.gesturestart = trackpad.gesturestart;
    controls.gesturechange = trackpad.gesturechange;
  }

  controls.scheme = scheme || null;

  return controls;
};

export default generateControls;
