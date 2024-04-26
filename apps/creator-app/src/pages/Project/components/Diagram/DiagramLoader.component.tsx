import type { ITabLoader } from '@voiceflow/ui-next';
import { TabLoader } from '@voiceflow/ui-next';
import React from 'react';

import { DiagramSidebar } from '@/pages/Project/components/Diagram/DiagramSidebar/DiagramSidebar.component';
import { useInteractiveMode } from '@/pages/Project/hooks';

import { DiagramLayout } from './DiagramLayout/DiagramLayout.component';

export const DiagramLoader: React.FC<ITabLoader> = (props) => {
  const isDesignMode = !useInteractiveMode();

  return (
    <>
      <DiagramLayout>
        <TabLoader {...props} />
      </DiagramLayout>

      {isDesignMode && <DiagramSidebar />}
    </>
  );
};
