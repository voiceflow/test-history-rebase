/* eslint-disable xss/no-mixed-html */
import _isNumber from 'lodash/isNumber';
import React from 'react';

import client from '@/client';
import creatorAdapter from '@/client/adapters/creator';
import { MARKUP_NODES, ROOT_NODES } from '@/constants';
import * as Creator from '@/ducks/creator';
import * as Skill from '@/ducks/skill';
import * as Workspace from '@/ducks/workspace';
import { ProjectLoadingGate, WorkspaceLoadingGate } from '@/gates';
import { connect, withBatchLoadingGate } from '@/hocs';
import removeIntercom from '@/hocs/removeIntercom';
import { Node } from '@/models';
import LinkLayer from '@/pages/Canvas/components/LinkLayer';
import MarkupLayer from '@/pages/Canvas/components/MarkupLayer';
import NodeLayer from '@/pages/Canvas/components/NodeLayer';
import { CanvasProviders, ManagerProvider, PresentationModeProvider } from '@/pages/Canvas/contexts';
import useEngine from '@/pages/Canvas/engine';
import { getManager } from '@/pages/Canvas/managers';
import { MarkupModeProvider } from '@/pages/Skill/contexts';
import { BLOCK_WIDTH } from '@/styles/theme';
import { Point } from '@/types';
import { compose } from '@/utils/functional';

import { ExportCanvasDiagram, ExportGlobalStyle, ExportWatermark, MockRealtimeGate } from './components';

const ExportCanvas: React.FC<{ isOnPaidPlan: boolean; diagramID: string; initialize: (diagramID: string) => void }> = ({
  diagramID,
  initialize,
  isOnPaidPlan,
}) => {
  const engine = useEngine();
  const registerCanvas = React.useCallback((api) => engine.registerCanvas(api), []);

  React.useEffect(() => {
    initialize(diagramID);
  }, []);

  return (
    <PresentationModeProvider>
      <MarkupModeProvider>
        <ManagerProvider value={getManager as any}>
          <CanvasProviders engine={engine}>
            <ExportGlobalStyle />
            <ExportWatermark isOnPaidPlan={isOnPaidPlan} />
            <ExportCanvasDiagram onRegister={registerCanvas}>
              <MarkupLayer />
              <LinkLayer />
              <NodeLayer />
            </ExportCanvasDiagram>
          </CanvasProviders>
        </ManagerProvider>
      </MarkupModeProvider>
    </PresentationModeProvider>
  );
};

const findCanvasExportOffsets = (nodes: Node[]): Point => {
  const rootNodes = nodes.filter(({ type }) => ROOT_NODES.includes(type) || MARKUP_NODES.includes(type));

  const xValues = rootNodes.map((node) => node.x);
  const yValues = rootNodes.map((node) => node.y);

  const minX = Math.min(...xValues);
  const minY = Math.min(...yValues);

  return [0 - minX, 0 - minY];
};

const applyCanvasExportOffsets = (nodes: Node[], [offsetX, offsetY]: Point) =>
  nodes.map((node) => ({
    ...node,
    x: node.x + offsetX + (MARKUP_NODES.includes(node.type) ? BLOCK_WIDTH / 2 : 0),
    y: node.y + offsetY,
  }));

const initialize = (diagramID: string) => async (dispatch: any, getState: any) => {
  const state = getState();
  const platform = Skill.activePlatformSelector(state);

  const { viewport, ...creator } = creatorAdapter.fromDB(await client.api.diagram.get(diagramID), { platform });

  const nodesWithCoordinates = creator.nodes.filter((node) => _isNumber(node.x) && _isNumber(node.y));
  const offsets = findCanvasExportOffsets(nodesWithCoordinates);

  creator.nodes = applyCanvasExportOffsets(nodesWithCoordinates, offsets);

  dispatch(Creator.initializeCreator({ ...creator, diagramID }));
};

const mapStateToProps = {
  isOnPaidPlan: Workspace.isOnPaidPlanSelector,
};

const mapDispatchToProps = {
  initialize,
};

export default compose(
  removeIntercom,
  React.memo,
  connect(mapStateToProps, mapDispatchToProps),
  withBatchLoadingGate(
    WorkspaceLoadingGate,
    [
      ProjectLoadingGate,
      ({ match }: { match: any }) => ({
        versionID: match.params?.versionID,
        diagramID: match.params?.diagramID,
      }),
    ],
    MockRealtimeGate
  )
)(ExportCanvas);
