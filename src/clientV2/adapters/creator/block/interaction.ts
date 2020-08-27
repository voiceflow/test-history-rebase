import type { Choice, ElseData, StepData } from '@voiceflow/alexa-types/build/nodes/interaction';
import cuid from 'cuid';

import { createAdapter } from '@/client/adapters/utils';
import { PlatformType } from '@/constants';
import { NodeData } from '@/models';

import { createBlockAdapter, noMatchAdapter, repromptAdapter } from './utils';

const elseAdapter = createAdapter<ElseData, NodeData.InteractionElse>(
  ({ type, ...props }) => ({ type, ...noMatchAdapter.fromDB(props) }),
  ({ type, ...props }) => ({ type, ...noMatchAdapter.toDB(props) })
);

const choiceAdapter = createAdapter<Choice, NodeData.InteractionChoice>(
  ({ intent, mappings = [] }) => ({ id: cuid.slug(), intent, mappings }),
  ({ intent, mappings }) => ({ intent: intent ?? '', mappings })
);

const interactionAdapter = createBlockAdapter<StepData, NodeData.Interaction>(
  ({ name, else: elseData, choices, reprompt }) => ({
    name,
    else: elseAdapter.fromDB(elseData),
    choices: choices.map((choice) => ({
      [PlatformType.ALEXA]: choiceAdapter.fromDB(choice),
      [PlatformType.GOOGLE]: { id: cuid.slug(), intent: null, mappings: [] },
      [PlatformType.GENERAL]: { id: cuid.slug(), intent: null, mappings: [] },
    })),
    reprompt: reprompt && repromptAdapter.fromDB(reprompt),
  }),
  ({ name, else: elseData, choices, reprompt }) => ({
    name,
    else: elseAdapter.toDB(elseData),
    choices: choices.map(({ alexa }) => choiceAdapter.toDB(alexa)),
    reprompt: reprompt && repromptAdapter.toDB(reprompt),
  })
);

export default interactionAdapter;
