import React from 'react';

import { Compose } from '@/components/Compose/Compose.component';
import { PresentationModeProvider } from '@/pages/Canvas/contexts/PresentationModeContext';
import { AutoPanningProvider } from '@/pages/Project/contexts/AutoPanningContext';
import { EventualEngineProvider } from '@/pages/Project/contexts/EventualEngineContext';
import { MarkupProvider } from '@/pages/Project/contexts/MarkupContext';
import { PlatformProvider } from '@/pages/Project/contexts/PlatformProvider';
import { ProjectConfigProvider } from '@/pages/Project/contexts/ProjectConfigProvider';

export const ExportProviders: React.FC<React.PropsWithChildren> = ({ children }) => (
  <Compose
    components={[
      EventualEngineProvider,
      AutoPanningProvider,
      ProjectConfigProvider,
      PlatformProvider,
      PresentationModeProvider,
      MarkupProvider,
    ]}
  >
    {children}
  </Compose>
);
