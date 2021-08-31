import { Node } from '@voiceflow/alexa-types';
import { Node as BaseNode } from '@voiceflow/base-types';
import { PlatformType } from '@voiceflow/internal';
import cuid from 'cuid';

import { NodeData } from '../../../../models';
import { distinctPlatformsData } from '../../../../utils/platform';
import { createAdapter } from '../../../utils';
import { createBlockAdapter, voiceNoMatchAdapter, voiceRepromptAdapter } from '../utils';

const choiceAdapter = createAdapter<BaseNode.Interaction.Choice, NodeData.InteractionChoice>(
  ({ intent, mappings = [] }) => ({ id: cuid.slug(), intent, mappings }),
  ({ intent, mappings }) => ({ intent: intent ?? '', mappings })
);

const interactionAdapter = createBlockAdapter<Node.Interaction.StepData, NodeData.Interaction>(
  ({ name, else: elseData, choices, reprompt }) => ({
    name,
    else: voiceNoMatchAdapter.fromDB(elseData),
    choices: choices.map((choice) => ({
      ...distinctPlatformsData({ id: cuid.slug(), intent: null, mappings: [] }),
      [PlatformType.ALEXA]: choiceAdapter.fromDB(choice),
    })),
    reprompt: reprompt && voiceRepromptAdapter.fromDB(reprompt),
    buttons: null, // no buttons on alexa
  }),
  ({ name, else: elseData, choices, reprompt }) => ({
    name,
    else: voiceNoMatchAdapter.toDB(elseData as NodeData.VoiceNoMatches),
    choices: choices.map(({ [PlatformType.ALEXA]: data }) => choiceAdapter.toDB(data)),
    reprompt: reprompt && voiceRepromptAdapter.toDB(reprompt as NodeData.VoicePrompt),
    chips: null,
    buttons: null,
  })
);

export default interactionAdapter;
