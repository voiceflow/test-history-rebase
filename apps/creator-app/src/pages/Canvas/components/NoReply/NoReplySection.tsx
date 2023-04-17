import { BaseNode } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import Section from '@/components/Section';
import { HeaderVariant } from '@/components/Section/components/HeaderLabel';
import { getNoMatchNoReplySectionLabel } from '@/pages/Canvas/managers/utils/noMatchNoReply';

export const NO_REPLY_PATH_TYPE = 'noReply';

interface NoReplySectionProps {
  data: Realtime.NodeData.NoReply;
  pushToPath?: (path: { type: string; label: string }) => void;
}

const NoReplySection: React.FC<NoReplySectionProps> = ({ data, pushToPath }) => {
  const onClick = React.useCallback(() => pushToPath?.({ type: NO_REPLY_PATH_TYPE, label: 'No reply' }), [pushToPath]);

  return (
    <Section
      infix={getNoMatchNoReplySectionLabel(BaseNode.Utils.NoReplyType, data.types)}
      header="No Reply"
      isLink
      onClick={onClick}
      headerVariant={HeaderVariant.LINK}
    />
  );
};

export default NoReplySection;
