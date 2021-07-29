import _isNumber from 'lodash/isNumber';
import React from 'react';

import client from '@/client';
import creatorAdapter from '@/client/adapters/creator';
import * as Creator from '@/ducks/creator';
import * as Features from '@/ducks/feature';
import * as Project from '@/ducks/project';
import * as Session from '@/ducks/session';
import { ProjectLoadingGate, WorkspaceFeatureLoadingGate } from '@/gates';
import { connect, withBatchLoadingGate } from '@/hocs';
import removeIntercom from '@/hocs/removeIntercom';
import { useIsOnPaidPlanSelector } from '@/hooks';
import { Link, LinkData, Node, Port } from '@/models';
import LinkLayer from '@/pages/Canvas/components/LinkLayer';
import MarkupLayer from '@/pages/Canvas/components/MarkupLayer';
import NodeLayer from '@/pages/Canvas/components/NodeLayer';
import { CanvasProviders, ManagerProvider, PresentationModeProvider } from '@/pages/Canvas/contexts';
import useEngine from '@/pages/Canvas/engine';
import { getManager } from '@/pages/Canvas/managers';
import { MarkupProvider, PlatformProvider } from '@/pages/Skill/contexts';
import { Thunk } from '@/store/types';
import { BLOCK_WIDTH } from '@/styles/theme';
import { ConnectedProps, Point } from '@/types';
import { compose } from '@/utils/functional';
import { isMarkupBlockType, isRootOrMarkupBlockType } from '@/utils/typeGuards';

import { ExportCanvasDiagram, ExportGlobalStyle, ExportWatermark, MockRealtimeGate } from './components';

const ExportCanvas: React.FC<ConnectedExportProps> = ({ platform, diagramID, initialize }) => {
  const isOnPaidPlan = useIsOnPaidPlanSelector();

  const engine = useEngine();
  const registerCanvas = React.useCallback((api) => engine.registerCanvas(api), []);

  React.useEffect(() => {
    if (diagramID) {
      initialize(diagramID);
    }
  }, [diagramID]);

  return (
    <PlatformProvider value={platform}>
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
    </PlatformProvider>
  );
};

const findCanvasExportOffsets = (nodes: Node[], ports: Port[]): Point => {
  const rootNodes = nodes.filter(({ type }) => isRootOrMarkupBlockType(type));

  const xValues = rootNodes.map((node) => node.x);
  const yValues = rootNodes.map((node) => node.y);
  const portXValues = ports.flatMap((port) => port.linkData!.points!.map((point) => point.point[0]));
  const portYValues = ports.flatMap((port) => port.linkData!.points!.map((point) => point.point[1]));

  const minX = Math.min(...xValues, ...portXValues);
  const minY = Math.min(...yValues, ...portYValues);

  return [0 - minX, 0 - minY];
};

const applyOffsetsToNodes = (nodes: Node[], [offsetX, offsetY]: Point) =>
  nodes.map((node) => ({
    ...node,
    x: node.x + offsetX + (isMarkupBlockType(node.type) ? BLOCK_WIDTH / 2 : 0),
    y: node.y + offsetY,
  }));

const applyOffsetsToLinkData = (data: LinkData | undefined, [offsetX, offsetY]: Point): LinkData | undefined =>
  !data
    ? undefined
    : {
        ...data,
        points: !data.points
          ? undefined
          : data.points.map((point) => ({
              ...point,
              point: [point.point[0] + offsetX + BLOCK_WIDTH / 2, point.point[1] + offsetY],
            })),
      };

const applyOffsetsToPorts = (ports: Port[], offsets: Point) =>
  ports.map((port) => ({
    ...port,
    linkData: applyOffsetsToLinkData(port.linkData, offsets),
  }));

const applyOffsetsToLinks = (links: Link[], offsets: Point) =>
  links.map((link) => ({
    ...link,
    data: applyOffsetsToLinkData(link.data, offsets),
  }));

const initialize =
  (diagramID: string): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const platform = Project.activePlatformSelector(state);
    const features = Features.allActiveFeaturesSelector(state);

    const { viewport, ...creator } = creatorAdapter.fromDB(await client.api.diagram.get(diagramID), { platform, features });

    const nodesWithCoordinates = creator.nodes.filter((node) => _isNumber(node.x) && _isNumber(node.y));
    const portsWithPoints = creator.ports.filter((port) => !!port.nodeID && !!port.linkData?.points?.length);
    const offsets = findCanvasExportOffsets(nodesWithCoordinates, portsWithPoints);

    creator.nodes = applyOffsetsToNodes(nodesWithCoordinates, offsets);
    creator.ports = applyOffsetsToPorts(creator.ports, offsets);
    creator.links = applyOffsetsToLinks(creator.links, offsets);

    dispatch(Creator.initializeCreator(creator));
  };

const mapStateToProps = {
  diagramID: Session.activeDiagramIDSelector,
  platform: Project.activePlatformSelector,
};

const mapDispatchToProps = {
  initialize,
};

type ConnectedExportProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default compose(
  removeIntercom,
  connect(mapStateToProps, mapDispatchToProps),
  withBatchLoadingGate(ProjectLoadingGate, WorkspaceFeatureLoadingGate, MockRealtimeGate)
)(ExportCanvas);
