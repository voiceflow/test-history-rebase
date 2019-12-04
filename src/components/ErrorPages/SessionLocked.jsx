import React from 'react';

import SvgIcon from '@/components/SvgIcon';

import { Page404Wrapper } from './styled';

const SessionLocked = ({ children }) => (
  <Page404Wrapper>
    <SvgIcon icon="activeProject" size="auto" />

    <label className="mt-3 dark">Project Open in Another Tab</label>

    <p className="mt-1 mb-2">This project is currently open in another tab. Please close existing tab, or takeober the active session.</p>

    {children}
  </Page404Wrapper>
);

export default SessionLocked;
