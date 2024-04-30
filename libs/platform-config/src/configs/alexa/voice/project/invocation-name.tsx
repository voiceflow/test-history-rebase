import { System } from '@voiceflow/ui';
import React from 'react';

import * as Base from '@/configs/base';
import { Config as ConfigUtils } from '@/configs/utils';

export const CONFIG = Base.Project.InvocationName.extend({
  name: 'Invocation Name',

  placeholder: 'Enter an invocation name',

  description: (
    <>
      The name users will say to interact with your Alexa Skill. This does not need to be the same as your project name,
      but must comply with the{' '}
      <System.Link.Anchor href="https://developer.amazon.com/en-US/docs/alexa/custom-skills/choose-the-invocation-name-for-a-custom-skill.html">
        Invocation Name Guidelines.
      </System.Link.Anchor>
    </>
  ),

  defaultSamples: ['open'],
})(Base.Project.InvocationName.validate);

export type Config = typeof CONFIG;

export const extend = ConfigUtils.extendFactory<Config>(CONFIG);
export const validate = ConfigUtils.validateFactory<Config>(CONFIG);
