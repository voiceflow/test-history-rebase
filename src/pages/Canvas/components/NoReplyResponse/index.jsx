import React from 'react';

import Section from '@/components/Section';
import { RepromptType } from '@/constants';

import { InfoTooltip } from './components';

export { NoReplyResponseForm } from './components';

export const repromptFactory = () => ({
  type: RepromptType.TEXT,
  content: '',
});

const NoReplyResponse = ({ pushToPath }) => {
  const onOpenNoReplyResponse = React.useCallback(
    () =>
      pushToPath({
        type: 'noReplyResponse',
        label: 'No Reply Response',
      }),
    [pushToPath]
  );

  return (
    <Section
      variant="secondary"
      header="No Reply Response"
      tooltip={<InfoTooltip />}
      tooltipProps={{ helpTitle: null, helpMessage: null }}
      status="Empty"
      isLink
      onClick={onOpenNoReplyResponse}
    ></Section>
  );
};

export default NoReplyResponse;
