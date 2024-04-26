import * as Base from '@platform-config/configs/base';
import { Utils } from '@voiceflow/common';
import { SystemVariable } from '@voiceflow/dtos';
import React from 'react';

import * as InvocationName from './invocation-name';
import * as Locale from './locale';
import * as Voice from './voice';

export { InvocationName, Locale, Voice };

export const CONFIG = Base.Project.extend({
  name: 'Alexa Skill',

  voice: Voice.CONFIG,

  locale: Locale.CONFIG,

  description: (
    <>
      Your project name is the name of the project that you will see on your workspace dashboard. <br />
      This is an internal name an is <b>not</b> your Invocation name.
    </>
  ),

  invocationName: InvocationName.CONFIG,

  globalVariables: Utils.array.withoutValues(Base.Project.CONFIG.globalVariables, [
    SystemVariable.LAST_RESPONSE,
    SystemVariable.LAST_UTTERANCE,
  ]),
})(Base.Project.validate);

export type Config = typeof CONFIG;
