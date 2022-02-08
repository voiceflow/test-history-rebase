import React from 'react';
import { Outlet } from 'react-router-dom';

import { Container, Content, Sidebar } from './components';

export { Title as PageTitle } from './components';

const PageLayout: React.FC = () => (
  <Container>
    <div>
      <Sidebar />
      <Content>
        <Outlet />
      </Content>
    </div>
  </Container>
);

export default PageLayout;
