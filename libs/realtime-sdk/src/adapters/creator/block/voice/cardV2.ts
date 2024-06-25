import type { NodeData } from '../../../../models';
import { baseCardV2Adapter } from '../base';
import { createBlockAdapter, voiceNoMatchAdapter, voiceNoReplyAdapter } from '../utils';

const cardV2Adapter = createBlockAdapter<any, NodeData.CardV2>(
  ({ noReply, noMatch, ...baseData }, options) => {
    return {
      ...baseCardV2Adapter.fromDB(baseData, options),

      noMatch: noMatch ? voiceNoMatchAdapter.fromDB(noMatch) : null,
      noReply: noReply ? voiceNoReplyAdapter.fromDB(noReply) : null,
    };
  },
  ({ noMatch, noReply, ...baseData }, options) => ({
    ...baseCardV2Adapter.toDB(baseData, options),

    noMatch: noMatch && voiceNoMatchAdapter.toDB(noMatch as NodeData.VoiceNoMatch),
    noReply: noReply && voiceNoReplyAdapter.toDB(noReply as NodeData.VoiceNoReply),
  })
);

export default cardV2Adapter;
