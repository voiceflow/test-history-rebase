import React from 'react';
import { IntercomProps, useIntercom } from 'react-use-intercom';

import { LOGROCKET_PROJECT } from '@/config';
import { Account, Workspace } from '@/models';
import { NullableRecord } from '@/types';

// eslint-disable-next-line import/prefer-default-export
export function createProps(user: NullableRecord<Account>, workspace: Workspace = {} as Workspace): IntercomProps {
  return user.creator_id
    ? {
        // user info
        userId: String(user.creator_id),
        name: user.name!,
        email: user.email!,
        // active workspace info
        customAttributes: {
          workspace: workspace.name,
          workspace_id: workspace.id,
          plan: workspace.plan || 'basic',
          seats: workspace.seats,
          logrocketURL: `https://app.logrocket.com/${LOGROCKET_PROJECT}/sessions?u=${user.creator_id}`,
        },
      }
    : {};
}

export const useOpenIntercom = () => {
  const { boot, show } = useIntercom();

  return React.useCallback((event?: React.MouseEvent) => {
    event?.preventDefault();

    boot();
    show();
  }, []);
};
