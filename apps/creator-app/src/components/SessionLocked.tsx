import { ErrorDescription, Page404Wrapper } from '@voiceflow/ui';
import React from 'react';

import { activeProjectGraphic } from '@/assets';

const SessionLocked: React.FC<React.PropsWithChildren> = ({ children }) => (
  <Page404Wrapper>
    <img src={activeProjectGraphic} alt="Active Assistant" height={62} />

    <label className="mt-3 dark">Assistant Open in Another Tab</label>

    <ErrorDescription className="mt-1 mb-4 text-center">
      This assistant is currently open in another tab. Please close existing tab, or takeover the active session.
    </ErrorDescription>

    {children}
  </Page404Wrapper>
);

export default SessionLocked;
