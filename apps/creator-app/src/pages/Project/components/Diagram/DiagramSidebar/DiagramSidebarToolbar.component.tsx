import { MarkupToolbar } from '@voiceflow/ui-next';
import React from 'react';

import { toolbarStyle } from './DiagramSidebar.css';

export const DiagramSidebarToolbar: React.FC = () => {
  return <MarkupToolbar className={toolbarStyle} />;
};
