import React from 'react';

import { V3StyleContainer } from '@/components/V3StyleContainer';

import { container, content } from './AssistantLayout.css';
import { AssistantNavigation } from './AssistantNavigation/AssistantNavigation.component';

interface AssistantLayoutProps extends React.PropsWithChildren {}

export const AssistantLayout: React.FC<AssistantLayoutProps> = ({ children }) => {
  return (
    <V3StyleContainer className={container}>
      <AssistantNavigation />
      <div className={content}>{children}</div>
    </V3StyleContainer>
  );
};
