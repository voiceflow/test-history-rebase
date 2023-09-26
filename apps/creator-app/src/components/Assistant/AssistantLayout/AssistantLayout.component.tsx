import React from 'react';

import { V3StyleContainer } from '@/components/V3StyleContainer';

import { container, content, menu, sidebar } from './AssistantLayout.css';
import { AssistantMenu } from './AssistantMenu/AssistantMenu.component';
import { AssistantMenuHeader } from './AssistantMenuHeader/AssistantMenuHeader.component';

interface AssistantLayoutProps extends React.PropsWithChildren {}

export const AssistantLayout: React.FC<AssistantLayoutProps> = ({ children }) => (
  <V3StyleContainer className={container}>
    <aside className={sidebar}>
      <AssistantMenuHeader />

      <div className={menu}>
        <AssistantMenu />
      </div>
    </aside>

    <div className={content}>{children}</div>
  </V3StyleContainer>
);
