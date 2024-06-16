import { notify, TabLoader } from '@voiceflow/ui-next';
import React from 'react';
import { useLocation } from 'react-router-dom';

import { Designer } from '@/ducks';
import { useDispatch } from '@/hooks';
import * as Query from '@/utils/query';

export const ZendeskCallback: React.FC = () => {
  const location = useLocation();

  const postZendeskToken = useDispatch(Designer.KnowledgeBase.Integration.effect.createOne);

  React.useEffect(() => {
    const query = Query.parse(location.search);

    if (query.code && query.state) {
      postZendeskToken('zendesk', query.code, query.state)
        .then(() => window.close())
        .catch(() => {
          // ignore
        });
    } else if (query.error) {
      notify.short.error(`Zendesk authentication failed: ${query.error}`);
    } else {
      notify.short.genericError();
    }
  }, []);

  return <TabLoader variant="dark" />;
};
