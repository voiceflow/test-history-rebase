import React from 'react';

import Page from '@/components/Page';

import { WorkspaceSelector } from '../../../components';

const Header: React.FC = () => (
  <Page.Header renderLogoButton={() => <WorkspaceSelector />}>
    <Page.Header.Title leftOffset>Settings</Page.Header.Title>
  </Page.Header>
);

export default Header;
