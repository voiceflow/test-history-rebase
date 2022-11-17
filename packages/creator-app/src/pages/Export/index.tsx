import React from 'react';

import * as ProjectV2 from '@/ducks/projectV2';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { VersionSubscriptionGate, WorkspaceFeatureLoadingGate } from '@/gates';
import { withBatchLoadingGate } from '@/hocs';
import { useSelector } from '@/hooks';
import LinkLayer from '@/pages/Canvas/components/LinkLayer';
import MarkupLayer from '@/pages/Canvas/components/MarkupLayer';
import NodeLayer from '@/pages/Canvas/components/NodeLayer';
import { CanvasProviders, ManagerProvider, PresentationModeProvider } from '@/pages/Canvas/contexts';
import { useEngine } from '@/pages/Canvas/hooks/engine';
import { useManager } from '@/pages/Canvas/managers/utils';
import { MarkupProvider, ProjectProvider } from '@/pages/Project/contexts';

import { ExportCanvasDiagram, ExportGlobalStyle, ExportWatermark } from './components';
import InitializeExportGate from './gates/InitializeExportGate';

const ExportCanvas: React.FC = () => {
  const isOnPaidPlan = useSelector(WorkspaceV2.active.isOnPaidPlanSelector);

  const nluType = useSelector(ProjectV2.active.nluTypeSelector);
  const platform = useSelector(ProjectV2.active.platformSelector);
  const projectType = useSelector(ProjectV2.active.projectTypeSelector);

  const [engine, engineKey] = useEngine();
  const registerCanvas = React.useCallback((api) => engine.registerCanvas(api), []);
  const getManager = useManager();

  return (
    <ProjectProvider nluType={nluType} platform={platform} projectType={projectType}>
      <PresentationModeProvider>
        <MarkupProvider>
          <ManagerProvider value={getManager}>
            <CanvasProviders key={engineKey} engine={engine}>
              <ExportGlobalStyle />
              <ExportWatermark isOnPaidPlan={!!isOnPaidPlan} />
              <ExportCanvasDiagram onRegister={registerCanvas}>
                <MarkupLayer />
                <LinkLayer />
                <NodeLayer />
              </ExportCanvasDiagram>
            </CanvasProviders>
          </ManagerProvider>
        </MarkupProvider>
      </PresentationModeProvider>
    </ProjectProvider>
  );
};

export default withBatchLoadingGate(VersionSubscriptionGate, WorkspaceFeatureLoadingGate, InitializeExportGate)(ExportCanvas);
