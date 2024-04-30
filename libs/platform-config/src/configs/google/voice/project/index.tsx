import { Utils } from '@voiceflow/common';
import { SystemVariable } from '@voiceflow/dtos';
import React from 'react';

import * as Base from '@/configs/base';

import * as InvocationName from './invocation-name';
import * as Locale from './locale';
import * as Voice from './voice';

export { Locale, Voice };

export const CONFIG = Base.Project.extend({
  name: 'Google Action',

  voice: Voice.CONFIG,

  locale: Locale.CONFIG,

  invocationName: InvocationName.CONFIG,

  description: (
    <>
      Your project name is the name of the project that you will see on your workspace dashboard. <br />
      This is an internal name an is <b>not</b> your Invocation name.
    </>
  ),

  globalVariables: Utils.array.withoutValues(Base.Project.CONFIG.globalVariables, [SystemVariable.LAST_RESPONSE]),
})(Base.Project.validate);

export type Config = typeof CONFIG;
