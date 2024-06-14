import React from 'react';

import { Compose } from '@/components/Compose/Compose.component';
import * as Project from '@/components/Project';
import { ExportProvider } from '@/contexts/ExportContext';
import { PrototypeJobProvider } from '@/contexts/PrototypeJobContext';
import { PublishProvider } from '@/contexts/PublishContext';
import { AnalyticsDashboardProvider } from '@/pages/AnalyticsDashboard/context';
import { AutoPanningProvider } from '@/pages/Project/contexts/AutoPanningContext';
import { EventualEngineProvider } from '@/pages/Project/contexts/EventualEngineContext';
import { PlatformProvider } from '@/pages/Project/contexts/PlatformProvider';
import { ProjectConfigProvider } from '@/pages/Project/contexts/ProjectConfigProvider';
import { TrainingProvider } from '@/pages/Project/contexts/TrainingContext';
import { PrototypeProvider } from '@/pages/Prototype/context';

import { SharePopperProvider } from './components/SharePopperContext';
import {
  ActiveProjectIdentityProvider,
  MarkupProvider,
  NLUTrainingModelProvider,
  ProjectPreviewProvider,
  SelectionProvider,
} from './contexts';

export const ProjectProviders: React.FC<React.PropsWithChildren> = ({ children }) => (
  <Compose
    components={[
      EventualEngineProvider,
      AutoPanningProvider,
      ProjectConfigProvider,
      PlatformProvider,
      MarkupProvider,
      ProjectPreviewProvider,
      ActiveProjectIdentityProvider,
      PrototypeProvider,
      PrototypeJobProvider,
      PublishProvider,
      ExportProvider,
      TrainingProvider,
      Project.Export.Provider,
      NLUTrainingModelProvider,
      SelectionProvider,
      AnalyticsDashboardProvider,
      SharePopperProvider,
    ]}
  >
    {children}
  </Compose>
);
