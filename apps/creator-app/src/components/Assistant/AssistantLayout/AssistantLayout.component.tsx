import React from 'react';

import { V3StyleContainer } from '@/components/V3StyleContainer';

import { AssistantNavigation } from './AssistantNavigation/AssistantNavigation.component';
import { container, content } from './AssistantLayout.css';

interface AssistantLayoutProps extends React.PropsWithChildren {}

export const AssistantLayout: React.FC<AssistantLayoutProps> = ({ children }) => (
  <V3StyleContainer className={container}>
    <AssistantNavigation />
    <div className={content}>{children}</div>
  </V3StyleContainer>
);
