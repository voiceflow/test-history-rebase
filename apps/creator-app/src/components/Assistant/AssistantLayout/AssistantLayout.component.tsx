import React from 'react';

import { container, content, menu, sidebar } from './AssistantLayout.css';
import { AssistantMenu } from './AssistantMenu/AssistantMenu.component';
import { AssistantMenuHeader } from './AssistantMenuHeader/AssistantMenuHeader.component';

interface AssistantLayoutProps extends React.PropsWithChildren {}

export const AssistantLayout: React.FC<AssistantLayoutProps> = ({ children }) => (
  <div className={container}>
    <aside className={sidebar}>
      <AssistantMenuHeader />

      <div className={menu}>
        <AssistantMenu />
      </div>
    </aside>

    <div className={content}>{children}</div>
  </div>
);
