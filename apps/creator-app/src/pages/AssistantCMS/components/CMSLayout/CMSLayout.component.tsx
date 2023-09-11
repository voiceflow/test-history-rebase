import React from 'react';

import { AssistantLayout } from '@/components/Assistant/AssistantLayout/AssistantLayout.component';

import { container, content, menu, sidebar } from './CMSLayout.css';
import { CMSMenu } from './CMSMenu/CMSMenu.component';

interface CMSLayoutProps extends React.PropsWithChildren {}

export const CMSLayout: React.FC<CMSLayoutProps> = ({ children }) => (
  <AssistantLayout>
    <div className={container}>
      <aside className={sidebar}>
        <div className={menu}>
          <CMSMenu />
        </div>
      </aside>

      <div className={content}>{children}</div>
    </div>
  </AssistantLayout>
);
