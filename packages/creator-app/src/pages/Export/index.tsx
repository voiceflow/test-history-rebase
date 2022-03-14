import React from 'react';

import LoadingGate from '@/components/LoadingGate';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Session from '@/ducks/session';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { ProjectLoadingGate, WorkspaceFeatureLoadingGate } from '@/gates';
import { compose, withBatchLoadingGate } from '@/hocs';
import removeIntercom from '@/hocs/removeIntercom';
import { useDispatch, useSelector } from '@/hooks';
import LinkLayer from '@/pages/Canvas/components/LinkLayer';
import MarkupLayer from '@/pages/Canvas/components/MarkupLayer';
import NodeLayer from '@/pages/Canvas/components/NodeLayer';
import { CanvasProviders, ManagerProvider, PresentationModeProvider } from '@/pages/Canvas/contexts';
import useEngine from '@/pages/Canvas/engine';
import { getManager } from '@/pages/Canvas/managers';
import { MarkupProvider, ProjectProvider } from '@/pages/Project/contexts';

import { ExportCanvasDiagram, ExportGlobalStyle, ExportWatermark, MockRealtimeGate } from './components';
import * as Utils from './utils';

const ExportCanvas: React.FC = () => {
  const isOnPaidPlan = useSelector(WorkspaceV2.active.isOnPaidPlanSelector);

  const platform = useSelector(ProjectV2.active.platformSelector);
  const typeV2 = useSelector(ProjectV2.active.typeV2Selector);
  const platformV2 = useSelector(ProjectV2.active.platformV2Selector);

  const engine = useEngine();
  const registerCanvas = React.useCallback((api) => engine.registerCanvas(api), []);
  return (
    <ProjectProvider platform={platform} platformV2={platformV2} typeV2={typeV2}>
      <PresentationModeProvider>
        <MarkupProvider>
          <ManagerProvider value={getManager as any}>
            <CanvasProviders engine={engine}>
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

const CanvasGate: React.FC = ({ children }) => {
  const [loaded, setLoaded] = React.useState(false);

  const initialize = useDispatch(Utils.initialize);
  const diagramID = useSelector(Session.activeDiagramIDSelector);

  React.useEffect(() => {
    if (diagramID) initialize(diagramID).then(() => setLoaded(true));
  }, [diagramID]);

  return <LoadingGate isLoaded={loaded}>{children}</LoadingGate>;
};

export default compose(
  removeIntercom,
  withBatchLoadingGate(ProjectLoadingGate, WorkspaceFeatureLoadingGate, MockRealtimeGate, CanvasGate)
)(ExportCanvas);
