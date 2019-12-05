import React from 'react';

import SvgIcon from '@/components/SvgIcon';

import { Message, Page404Wrapper } from './styled';

const SessionLocked = ({ children }) => (
  <Page404Wrapper>
    <SvgIcon icon="activeProject" size="auto" />

    <label className="mt-3 dark">Project Open in Another Tab</label>

    <Message className="mt-1 mb-4 text-center">
      This project is currently open in another tab. Please close existing tab, or takeover the active session.
    </Message>

    {children}
  </Page404Wrapper>
);

export default SessionLocked;
