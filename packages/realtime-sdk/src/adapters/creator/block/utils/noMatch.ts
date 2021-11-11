import { Node as BaseNode } from '@voiceflow/base-types';
import { Node as ChatNode } from '@voiceflow/chat-types';
import { Node as VoiceNode } from '@voiceflow/voice-types';
import createAdapter from 'bidirectional-adapter';

import { NodeData } from '../../../../models';
import { chatPromptAdapter, voicePromptAdapter } from './prompt';

export const baseNoMatchAdapter = createAdapter<BaseNode.Utils.BaseStepNoMatch, NodeData.BaseNoMatch>(
  ({ type = BaseNode.Utils.NoMatchType.REPROMPT, pathName = 'No Match', randomize }) => ({
    type,
    pathName,
    randomize,
  }),
  ({ type, randomize, pathName }) => ({ type, pathName, randomize })
);

export const chatNoMatchAdapter = createAdapter<ChatNode.Utils.StepNoMatch, NodeData.ChatNoMatch>(
  ({ reprompts, ...baseNoMatch }) => ({
    ...baseNoMatchAdapter.fromDB(baseNoMatch),
    reprompts: chatPromptAdapter.mapFromDB(reprompts),
  }),
  ({ reprompts, ...baseNoMatch }) => ({
    ...baseNoMatchAdapter.toDB(baseNoMatch),
    reprompts: chatPromptAdapter.mapToDB(reprompts),
  })
);

export const voiceNoMatchAdapter = createAdapter<VoiceNode.Utils.StepNoMatch<any>, NodeData.VoiceNoMatch>(
  ({ reprompts, ...baseNoMatch }) => ({
    ...baseNoMatchAdapter.fromDB(baseNoMatch),
    reprompts: voicePromptAdapter.mapFromDB(reprompts),
  }),
  ({ reprompts, ...baseNoMatch }) => ({
    ...baseNoMatchAdapter.toDB(baseNoMatch),
    reprompts: voicePromptAdapter.mapToDB(reprompts),
  })
);
