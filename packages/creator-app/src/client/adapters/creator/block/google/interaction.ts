import { Choice, ElseData, StepData } from '@voiceflow/general-types/build/nodes/interaction';
import { Voice } from '@voiceflow/google-types';
import cuid from 'cuid';

import { createAdapter } from '@/client/adapters/utils';
import { PlatformType } from '@/constants';
import { NodeData } from '@/models';
import { distinctPlatformsData } from '@/utils/platform';

import { createBlockAdapter, noMatchAdapter, repromptAdapter } from '../utils';

const elseAdapter = createAdapter<ElseData<Voice>, NodeData.InteractionElse>(
  ({ type, ...props }) => ({ type, ...noMatchAdapter.fromDB(props) }),
  ({ type, ...props }) => ({ type, ...noMatchAdapter.toDB(props) })
);

const choiceAdapter = createAdapter<Choice, NodeData.InteractionChoice>(
  ({ intent, mappings = [] }) => ({ id: cuid.slug(), intent, mappings }),
  ({ intent, mappings }) => ({ intent: intent ?? '', mappings })
);

const interactionAdapter = createBlockAdapter<StepData<Voice>, NodeData.Interaction>(
  ({ name, else: elseData, choices, reprompt, chips = null }) => ({
    name,
    else: elseAdapter.fromDB(elseData),
    choices: choices.map((choice) => ({
      ...distinctPlatformsData({ id: cuid.slug(), intent: null, mappings: [] }),
      [PlatformType.GOOGLE]: choiceAdapter.fromDB(choice),
    })),
    reprompt: reprompt && repromptAdapter.fromDB(reprompt),
    chips,
  }),
  ({ name, else: elseData, choices, reprompt, chips }) => ({
    name,
    else: elseAdapter.toDB(elseData),
    choices: choices.map(({ [PlatformType.GOOGLE]: data }) => choiceAdapter.toDB(data)),
    reprompt: reprompt && repromptAdapter.toDB(reprompt),
    chips,
  })
);

export default interactionAdapter;
