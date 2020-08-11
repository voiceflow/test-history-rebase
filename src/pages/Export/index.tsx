import _isNumber from 'lodash/isNumber';
import _noop from 'lodash/noop';
import React from 'react';

import client from '@/client';
import Canvas from '@/components/Canvas';
import { RenderLayer } from '@/components/Canvas/components';
import { MARKUP_NODES, ROOT_NODES } from '@/constants';
import * as Creator from '@/ducks/creator';
import * as Skill from '@/ducks/skill';
import { ProjectLoadingGate } from '@/gates';
import { RealtimeSubscriptionContext } from '@/gates/RealtimeLoadingGate/contexts';
import { connect, styled, withBatchLoadingGate } from '@/hocs';
import removeIntercom from '@/hocs/removeIntercom';
import { Node } from '@/models';
import BlockContainer from '@/pages/Canvas/components/Block/components/BlockContainer';
import DragTarget from '@/pages/Canvas/components/DragTarget';
import LinkLayer from '@/pages/Canvas/components/LinkLayer';
import LinkLayerSvg from '@/pages/Canvas/components/LinkLayer/components/LinkLayerSvg';
import MarkupLayer from '@/pages/Canvas/components/MarkupLayer';
import { Container as MarkupChildNodeContainer } from '@/pages/Canvas/components/MarkupNode/components';
import NodeContainer from '@/pages/Canvas/components/Node/components/NodeContainer';
import NodeLayer from '@/pages/Canvas/components/NodeLayer';
import { CanvasProviders, ManagerProvider, PresentationModeProvider } from '@/pages/Canvas/contexts';
import useEngine from '@/pages/Canvas/engine';
import { getManager } from '@/pages/Canvas/managers';
import { MarkupModeProvider } from '@/pages/Skill/contexts';
import { BLOCK_WIDTH } from '@/styles/theme';
import { Point } from '@/types';
import { compose } from '@/utils/functional';

import ExportStyle from './ExportStyle';

const EXPORT_MARGIN = 40;

const ExportCanvasDiagram = styled(Canvas as any)`
  height: auto;
  width: auto;
  overflow: visible;
  position: static;
  user-select: auto;
  margin-top: ${EXPORT_MARGIN}px;
  margin-left: ${EXPORT_MARGIN}px;

  ${RenderLayer} {
    position: relative;
    transform: translate(0, 0) !important;
    pointer-events: none;
  }

  ${LinkLayerSvg} {
    flex: 1;
    height: auto;
    width: auto;
  }

  ${NodeContainer} {
    margin-bottom: ${EXPORT_MARGIN}px;

    ${BlockContainer} {
      margin-right: ${EXPORT_MARGIN}px;
      position: relative;
      transform: none;
    }
  }

  ${DragTarget} {
    margin-bottom: ${EXPORT_MARGIN}px;

    ${MarkupChildNodeContainer} {
      margin-right: ${EXPORT_MARGIN}px;
      position: relative;
    }
  }
`;

const MockRealtimeGate: React.FC<{ children: () => React.ReactElement }> = ({ children }) => (
  <RealtimeSubscriptionContext.Provider value={{ onUpdate: _noop as any, destroy: _noop as any, on: _noop as any }}>
    {children}
  </RealtimeSubscriptionContext.Provider>
);

const ExportCanvas: React.FC<{ diagramID: string; initialize: (diagramID: string) => void }> = ({ diagramID, initialize }) => {
  const engine = useEngine();

  React.useEffect(() => {
    initialize(diagramID);
  }, []);

  const registerCanvas = React.useCallback((api) => engine.registerCanvas(api), []);

  return (
    <PresentationModeProvider>
      <MarkupModeProvider>
        <ManagerProvider value={getManager as any}>
          <CanvasProviders engine={engine}>
            <ExportStyle />
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

  const {
    data: { viewport, ...creator },
  } = await client.diagram.getData(diagramID, platform);

  const nodesWithCoordinates = creator.nodes.filter((node) => _isNumber(node.x) && _isNumber(node.y));
  const offsets = findCanvasExportOffsets(nodesWithCoordinates);

  creator.nodes = applyCanvasExportOffsets(nodesWithCoordinates, offsets);

  dispatch(Creator.initializeCreator({ ...creator, diagramID }));
};

export default compose(
  removeIntercom,
  React.memo,
  connect(null, { initialize }),
  withBatchLoadingGate(
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
