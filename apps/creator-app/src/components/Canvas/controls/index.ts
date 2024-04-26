import { IS_MAC } from '@voiceflow/ui';

import { ControlScheme, SCROLL_TIMEOUT } from '../constants';
import MouseInterface from './mouse';
import TrackpadInterface from './trackpad';
import type { ControlAction } from './types';

const ControlSchemeMap = {
  [ControlScheme.MOUSE]: MouseInterface,
  [ControlScheme.TRACKPAD]: TrackpadInterface,
};

const generateControls = (
  scheme: ControlScheme = IS_MAC ? ControlScheme.TRACKPAD : ControlScheme.MOUSE,
  handle: (action: ControlAction) => void,
  scrollTimeout = SCROLL_TIMEOUT
) => ControlSchemeMap[scheme](handle, scrollTimeout);

export default generateControls;

export type ControlHandlers = Omit<ReturnType<typeof generateControls>, 'isPanning' | 'isTrackpadPanning' | 'scheme'>;
