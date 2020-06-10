import _ from 'lodash';

import { ControlScheme } from '../constants';
import Mouse from './mouse';
import Trackpad from './trackpad';
import { ControlAction } from './types';

const generateControls = (scheme: ControlScheme, handle: (action: ControlAction) => void) => {
  const mouse = new Mouse(handle);

  const controls = {
    get isPanning() {
      return mouse.isPanning;
    },
    // eslint-disable-next-line lodash/prefer-constant
    get isTrackpadPanning() {
      return false;
    },
    scheme: scheme || null,
    click: mouse.click,
    mousedown: mouse.mousedown,
    dragstart: mouse.dragstart,
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

    Object.assign(controls, {
      wheel: trackpad.wheel,
      gesturestart: trackpad.gesturestart,
      gesturechange: trackpad.gesturechange,
    });
  }

  return controls;
};

export default generateControls;

export type ControlHandlers = Omit<ReturnType<typeof generateControls>, 'isPanning' | 'isTrackpadPanning' | 'scheme'>;
