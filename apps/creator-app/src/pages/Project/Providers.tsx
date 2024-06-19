import React from 'react';

import { Compose } from '@/components/Compose/Compose.component';
import * as Project from '@/components/Project';
import { ExportProvider } from '@/contexts/ExportContext';
import { PrototypeJobProvider } from '@/contexts/PrototypeJobContext';
import { PublishProvider } from '@/contexts/PublishContext';
import { TrainingProvider } from '@/contexts/TrainingContext';
import { AnalyticsDashboardProvider } from '@/pages/AnalyticsDashboard/context';
import { PrototypeProvider } from '@/pages/Prototype/context';

import { SharePopperProvider } from './components/SharePopperContext';
import {
  ActiveProjectIdentityProvider,
  MarkupProvider,
  NLUTrainingModelProvider,
  ProjectPreviewProvider,
  SelectionProvider,
} from './contexts';

const ProjectProviders: React.FC<React.PropsWithChildren> = ({ children }) => (
  <Compose
    components={[
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

export default ProjectProviders;
