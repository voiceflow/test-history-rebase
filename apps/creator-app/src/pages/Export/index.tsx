import React, { useEffect } from 'react';

import { CanvasAPI } from '@/components/Canvas';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { VersionSubscriptionGate, WorkspaceFeatureLoadingGate } from '@/gates';
import { withBatchLoadingGate } from '@/hocs/withBatchLoadingGate';
import { useHideVoiceflowAssistant, useSelector } from '@/hooks';
import LinkLayer from '@/pages/Canvas/components/LinkLayer';
import MarkupLayer from '@/pages/Canvas/components/MarkupLayer';
import NodeLayer from '@/pages/Canvas/components/NodeLayer';
import { CanvasProviders, ManagerProvider, PresentationModeProvider } from '@/pages/Canvas/contexts';
import { useEngine } from '@/pages/Canvas/hooks/engine';
import { useManager } from '@/pages/Canvas/managers/utils';
import { MarkupProvider } from '@/pages/Project/contexts';
import { endAll } from '@/vendors/userflow';

import { ExportCanvasDiagram, ExportGlobalStyle, ExportWatermark } from './components';
import InitializeExportGate from './gates/InitializeExportGate';

const ExportCanvas: React.FC = () => {
  const isOnPaidPlan = useSelector(WorkspaceV2.active.isOnPaidPlanSelector);

  const [engine, engineKey] = useEngine({ isExport: true });
  const registerCanvas = React.useCallback((api: CanvasAPI | null) => engine.registerCanvas(api), []);
  const getManager = useManager();

  useHideVoiceflowAssistant();

  useEffect(() => {
    endAll();
  }, []);

  return (
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
  );
};

export default withBatchLoadingGate(VersionSubscriptionGate, WorkspaceFeatureLoadingGate, InitializeExportGate)(ExportCanvas);
