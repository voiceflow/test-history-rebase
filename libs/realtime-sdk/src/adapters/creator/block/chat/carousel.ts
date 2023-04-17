import { NodeData } from '@realtime-sdk/models';
import { ChatNode } from '@voiceflow/chat-types';

import { baseCarouselAdapter } from '../base';
import { chatNoMatchAdapter, chatNoReplyAdapter, createBlockAdapter } from '../utils';

const carouselAdapter = createBlockAdapter<ChatNode.Carousel.StepData, NodeData.Carousel>(
  ({ noReply, noMatch, ...baseData }, options) => ({
    ...baseCarouselAdapter.fromDB(baseData, options),
    noReply: noReply ? chatNoReplyAdapter.fromDB(noReply) : null,
    noMatch: noMatch ? chatNoMatchAdapter.fromDB(noMatch) : null,
  }),
  ({ noMatch, noReply, ...baseData }, options) => ({
    ...baseCarouselAdapter.toDB(baseData, options),

    noMatch: noMatch && chatNoMatchAdapter.toDB(noMatch as NodeData.ChatNoMatch),
    noReply: noReply && chatNoReplyAdapter.toDB(noReply as ChatNode.Utils.StepNoReply),
  })
);

export default carouselAdapter;
