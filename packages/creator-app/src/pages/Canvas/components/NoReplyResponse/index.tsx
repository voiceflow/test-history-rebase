import { Text } from '@voiceflow/ui';
import React from 'react';

import Section from '@/components/Section';
import { RepromptType } from '@/constants';
import { NodeData } from '@/models';

import { InfoTooltip } from './components';

export { NoReplyResponseForm } from './components';

export const repromptFactory = (): NodeData.Reprompt => ({
  type: RepromptType.TEXT,
  content: '',
});

export const NO_REPLY_RESPONSE_PATH_TYPE = 'noReplyResponse';

interface NoReplyResponseProps {
  pushToPath: (path: { type: string; label: string }) => void;
}

const NoReplyResponse: React.FC<NoReplyResponseProps> = ({ pushToPath }) => {
  const onOpenNoReplyResponse = React.useCallback(() => pushToPath({ type: NO_REPLY_RESPONSE_PATH_TYPE, label: 'No Reply Response' }), [pushToPath]);

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

export default NoReplyResponse;
