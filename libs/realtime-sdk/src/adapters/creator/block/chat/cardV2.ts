import type { ChatNode } from '@voiceflow/chat-types';

import type { NodeData } from '@/models';

import { baseCardV2Adapter } from '../base';
import { chatNoMatchAdapter, chatNoReplyAdapter, createBlockAdapter } from '../utils';

const cardV2 = createBlockAdapter<any, NodeData.CardV2>(
  ({ noReply, noMatch, ...baseData }, options) => ({
    ...baseCardV2Adapter.fromDB(baseData, options),
    noReply: noReply ? chatNoReplyAdapter.fromDB(noReply) : null,
    noMatch: noMatch ? chatNoMatchAdapter.fromDB(noMatch) : null,
  }),
  ({ noMatch, noReply, ...baseData }, options) => {
    return {
      ...baseCardV2Adapter.toDB({ ...baseData }, options),
      noMatch: noMatch && chatNoMatchAdapter.toDB(noMatch as NodeData.ChatNoMatch),
      noReply: noReply && chatNoReplyAdapter.toDB(noReply as ChatNode.Utils.StepNoReply),
    };
  }
);

export default cardV2;
