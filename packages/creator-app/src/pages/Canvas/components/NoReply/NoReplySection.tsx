import { Text } from '@voiceflow/ui';
import React from 'react';

import Section from '@/components/Section';

import InfoTooltip from './InfoTooltip';

export const NO_REPLY_PATH_TYPE = 'noReply';

interface NoReplySectionProps {
  pushToPath?: (path: { type: string; label: string }) => void;
}

const NoReplySection: React.FC<NoReplySectionProps> = ({ pushToPath }) => {
  const onOpenNoReplyResponse = React.useCallback(() => pushToPath?.({ type: NO_REPLY_PATH_TYPE, label: 'No Reply Response' }), [pushToPath]);

  return (
    <Section
      isLink
      status="Empty"
      header={<Text fontWeight="normal">No Reply Response</Text>}
      tooltip={<InfoTooltip />}
      onClick={onOpenNoReplyResponse}
    />
  );
};

export default NoReplySection;
