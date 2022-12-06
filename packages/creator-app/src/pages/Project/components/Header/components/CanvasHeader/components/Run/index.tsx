import * as Platform from '@voiceflow/platform-config';
import React from 'react';

import { platformAware } from '@/hocs';
import WhatsApp from '@/platforms/whatsapp/jobs/prototype';

import RunButton from './button';
import { useRunPrototype } from './hooks';

export const DefaultRun: React.FC<React.ComponentProps<typeof RunButton>> = (props) => {
  const run = useRunPrototype();

  return <RunButton onClick={run} {...props} />;
};

const Run = platformAware(
  {
    [Platform.Constants.PlatformType.WHATSAPP]: WhatsApp,
  },
  DefaultRun
);

export default Run;
