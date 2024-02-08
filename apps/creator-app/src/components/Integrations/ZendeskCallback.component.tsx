import { FullSpinner } from '@voiceflow/ui';
import React from 'react';
import { useLocation } from 'react-router-dom';

import { ZENDESK_CALLBACK_CHANNEL } from '@/constants';
import * as Query from '@/utils/query';

export const ZendeskCallback: React.FC = () => {
  const location = useLocation();

  React.useEffect(() => {
    const bc = new BroadcastChannel(ZENDESK_CALLBACK_CHANNEL);

    const query = Query.parse(location.search);

    // eslint-disable-next-line no-console
    console.log(query);

    const status = query?.status === 'success' ? 'success' : 'fail';

    bc.postMessage(status);

    bc.close();
  }, []);

  return <FullSpinner message="Connecting..." />;
};
