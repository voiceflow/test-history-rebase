import { Utils } from '@voiceflow/common';

import { ControlScheme } from '@/components/Canvas/constants';

import { GenerateControlInterface } from '../types';
import Controls from './controls';

const MouseInterface: GenerateControlInterface = (handle) => {
  const controls = new Controls(handle);

  return {
    get isPanning() {
      return controls.isPanning;
    },
    scheme: ControlScheme.MOUSE,
    click: controls.click,
    mousedown: controls.mousedown,
    dragstart: controls.dragstart,
    wheel: controls.wheel,
    gesturestart: Utils.functional.noop,
    gesturechange: Utils.functional.noop,
    keyup: controls.keyup,
    keydown: controls.keydown,
  };
};

export default MouseInterface;
