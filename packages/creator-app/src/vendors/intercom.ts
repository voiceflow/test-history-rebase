import { NullableRecord } from '@voiceflow/common';
import React from 'react';
import { IntercomProps, useIntercom } from 'react-use-intercom';

import { LOGROCKET_PROJECT } from '@/config';
import { Account, Workspace } from '@/models';
import { generateID } from '@/utils/env';

// eslint-disable-next-line import/prefer-default-export
export function createProps(user: NullableRecord<Account>, workspace: Workspace = {} as Workspace, intercomUserHMAC: string | null): IntercomProps {
  if (!user.creator_id) return {};

  const intercomID = generateID(String(user.creator_id));

  return {
    // user info
    userId: intercomID,
    name: user.name!,
    email: user.email!,
    userHash: intercomUserHMAC ?? undefined,
    // active workspace info
    customAttributes: {
      workspace: workspace.name,
      workspace_id: generateID(workspace.id),
      plan: workspace.plan || 'basic',
      seats: workspace.seats,
      logrocketURL: `https://app.logrocket.com/${LOGROCKET_PROJECT}/sessions?u=${intercomID}`,
    },
  };
}

export const useOpenIntercom = () => {
  const { boot, show } = useIntercom();

  return React.useCallback((event?: React.MouseEvent) => {
    event?.preventDefault();

    boot();
    show();
  }, []);
};
