import React from 'react';

import * as Router from '@/ducks/router';
import { useDispatch, useTrackingEvents } from '@/hooks';
import { Hotkey, HOTKEY_LABEL_MAP } from '@/keymap';
import { Identifier } from '@/styles/constants';

import { RunButton } from './components';

const Run: React.FC = () => {
  const goToPrototype = useDispatch(Router.goToCurrentPrototype);

  const [, trackingEventsWrapper] = useTrackingEvents();

  return (
    <RunButton
      id={Identifier.TEST}
      icon="play"
      active
      tooltip={{ title: 'Run', hotkey: HOTKEY_LABEL_MAP[Hotkey.RUN_MODE] }}
      onClick={trackingEventsWrapper(() => goToPrototype(), 'trackActiveProjectPrototypeTestClick')}
      iconProps={{ width: 14, height: 18 }}
    />
  );
};

export default Run;
