import { replaceVariables } from '@voiceflow/common';
import { APLStepData, APLType } from '@voiceflow/general-types/build/nodes/visual';

import client from '@/client';
import * as Prototype from '@/ducks/prototype';
import { Thunk } from '@/store/types';

export const resolveAPL = ({
  title,
  aplType,
  imageURL,
  document,
  datasource,
  aplCommands,
}: APLStepData): Thunk<{ apl: string; data: string; commands: string }> => async (_, getState) => {
  const state = getState();
  const variables = Prototype.prototypeVariablesSelector(state);
  const commands = aplCommands || '';

  let data = datasource || '';
  let apl = document || '';

  if (aplType === APLType.SPLASH) {
    ({ document: apl, datasource: data } = await client.platform.alexa.handlers.getDisplayWithDatasource(title || '', imageURL || ''));
  }

  if (variables && data) {
    data = replaceVariables(data, variables);
  }

  return { apl, data, commands };
};
