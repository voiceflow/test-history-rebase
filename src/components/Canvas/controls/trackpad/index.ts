import { ControlScheme } from '@/components/Canvas/constants';

import { GenerateControlInterface } from '../types';
import Controls from './controls';

const TrackpadInterface: GenerateControlInterface = (handle) => {
  const controls = new Controls(handle);

  return {
    get isPanning() {
      return controls.isPanning;
    },
    scheme: ControlScheme.TRACKPAD,
    click: controls.click,
    mousedown: controls.mousedown,
    dragstart: controls.dragstart,
    wheel: controls.wheel,
    gesturestart: controls.gesturestart,
    gesturechange: controls.gesturechange,
    keyup: controls.keyup,
    keydown: controls.keydown,
  };
};

export default TrackpadInterface;
