import { NodeData } from '@realtime-sdk/models';
import { ChatNode } from '@voiceflow/chat-types';

import { baseCardV2Adapter } from '../base';
import { chatNoMatchAdapter, chatNoReplyAdapter, createBlockAdapter } from '../utils';

const cardV2Adapter = createBlockAdapter<ChatNode.CardV2.StepData, NodeData.CardV2>(
  ({ noReply, noMatch, ...baseData }) => ({
    ...baseCardV2Adapter.fromDB(baseData),
    noReply: noReply ? chatNoReplyAdapter.fromDB(noReply) : null,
    noMatch: noMatch ? chatNoMatchAdapter.fromDB(noMatch) : null,
  }),
  ({ noMatch, noReply, ...baseData }) => ({
    ...baseCardV2Adapter.toDB(baseData),

    noMatch: chatNoMatchAdapter.toDB(noMatch as NodeData.ChatNoMatch),
    noReply: noReply && chatNoReplyAdapter.toDB(noReply as ChatNode.Utils.StepNoReply),
  })
);

export default cardV2Adapter;
