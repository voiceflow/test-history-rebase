import { Node } from '@voiceflow/base-types';
import { replaceVariables } from '@voiceflow/common';

import client from '@/client';
import * as Prototype from '@/ducks/prototype';
import { Thunk } from '@/store/types';

// eslint-disable-next-line import/prefer-default-export
export const resolveAPL =
  ({
    title,
    aplType,
    imageURL,
    document,
    datasource,
    aplCommands,
  }: Node.Visual.APLStepData): Thunk<{ apl: string; data: string; commands: string }> =>
  async (_, getState) => {
    const state = getState();
    const variables = Prototype.prototypeVariablesSelector(state);
    const commands = aplCommands || '';

    let data = datasource || '';
    let apl = document || '';

    if (aplType === Node.Visual.APLType.SPLASH) {
      ({ document: apl, datasource: data } = await client.platform.alexa.handlers.getDisplayWithDatasource(title || '', imageURL || ''));
    }

    if (variables && data) {
      data = replaceVariables(data, variables);
    }

    return { apl, data, commands };
  };
