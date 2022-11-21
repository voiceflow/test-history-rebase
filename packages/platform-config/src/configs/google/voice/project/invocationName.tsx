import * as Base from '@platform-config/configs/base';
import { Config as ConfigUtils } from '@platform-config/configs/utils';
import { Link } from '@voiceflow/ui';
import React from 'react';

export const CONFIG = Base.Project.InvocationName.extend({
  name: 'Invocation Name',

  placeholder: 'Enter an invocation name',

  description: (
    <>
      The name users will say or type to interact with your Google Action. This does not need to be the same as your project name, but must comply
      with these <Link href="https://developers.google.com/assistant/conversational/df-asdk/discovery">guidelines.</Link>
    </>
  ),
});

export type Config = typeof CONFIG;

export const extend = ConfigUtils.extendFactory<Config>(CONFIG);
