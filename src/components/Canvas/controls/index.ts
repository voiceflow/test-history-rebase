import { isMac } from '@/config';

import { ControlScheme } from '../constants';
import MouseInterface from './mouse';
import TrackpadInterface from './trackpad';
import { ControlAction } from './types';

const ControlSchemeMap = {
  [ControlScheme.MOUSE]: MouseInterface,
  [ControlScheme.TRACKPAD]: TrackpadInterface,
};

const generateControls = (scheme: ControlScheme = isMac ? ControlScheme.TRACKPAD : ControlScheme.MOUSE, handle: (action: ControlAction) => void) =>
  ControlSchemeMap[scheme](handle);

export default generateControls;

export type ControlHandlers = Omit<ReturnType<typeof generateControls>, 'isPanning' | 'isTrackpadPanning' | 'scheme'>;
