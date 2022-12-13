import * as Realtime from '@voiceflow/realtime-sdk';
import _isNumber from 'lodash/isNumber';

import client from '@/client';
import * as ProjectV2 from '@/ducks/projectV2';
import { Thunk } from '@/store/types';
import { BLOCK_WIDTH } from '@/styles/theme';
import { Point } from '@/types';
import { isMarkupBlockType, isRootOrMarkupBlockType } from '@/utils/typeGuards';

const findCanvasExportOffsets = (nodes: Realtime.Node[], ports: Realtime.Port[]): { maxPoint: Point; offsets: Point } => {
  const rootNodes = nodes.filter(({ type }) => isRootOrMarkupBlockType(type));

  const xValues = rootNodes.map((node) => node.x);
  const yValues = rootNodes.map((node) => node.y);
  const portXValues = ports.flatMap((port) => port.linkData!.points!.map((point) => point.point[0]));
  const portYValues = ports.flatMap((port) => port.linkData!.points!.map((point) => point.point[1]));

  const minX = Math.min(...xValues, ...portXValues);
  const minY = Math.min(...yValues, ...portYValues);
  const maxX = Math.max(...xValues, ...portXValues);
  const maxY = Math.max(...yValues, ...portYValues);

  const offsetX = 0 - minX;
  const offsetY = 0 - minY;

  return {
    offsets: [offsetX, offsetY],
    maxPoint: [maxX + offsetX, maxY + offsetY],
  };
};

const applyOffsetsToNodes = (nodes: Realtime.Node[], [offsetX, offsetY]: Point) =>
  nodes.map((node) => ({
    ...node,
    x: node.x + offsetX + (isMarkupBlockType(node.type) ? BLOCK_WIDTH / 2 : 0),
    y: node.y + offsetY,
  }));

const applyOffsetsToLinkData = (data: Realtime.LinkData | undefined, [offsetX, offsetY]: Point): Realtime.LinkData | undefined =>
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

const applyOffsetsToPorts = (ports: Realtime.Port[], offsets: Point) =>
  ports.map((port) => ({
    ...port,
    linkData: applyOffsetsToLinkData(port.linkData, offsets),
  }));

const applyOffsetsToLinks = (links: Realtime.Link[], offsets: Point) =>
  links.map((link) => ({
    ...link,
    data: applyOffsetsToLinkData(link.data, offsets),
  }));

export const initialize =
  (diagramID: string): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const platform = ProjectV2.active.platformSelector(state);
    const projectType = ProjectV2.active.projectTypeSelector(state);

    const { viewport, ...creator } = Realtime.Adapters.creatorAdapter.fromDB(await client.api.diagram.get(diagramID), {
      platform,
      projectType,
      context: {},
    });

    const nodesWithCoordinates = creator.nodes.filter((node) => _isNumber(node.x) && _isNumber(node.y));
    const portsWithPoints = creator.ports.filter((port) => !!port.nodeID && !!port.linkData?.points?.length);
    const { offsets, maxPoint } = findCanvasExportOffsets(nodesWithCoordinates, portsWithPoints);

    creator.nodes = applyOffsetsToNodes(nodesWithCoordinates, offsets);
    creator.ports = applyOffsetsToPorts(creator.ports, offsets);
    creator.links = applyOffsetsToLinks(creator.links, offsets);

    dispatch(
      Realtime.creator.initialize({
        domainID: '',
        diagramID,
        projectID: '',
        versionID: '',
        workspaceID: '',
        nodesWithData: creator.nodes.map((node) => ({ node, data: creator.data[node.id] })),
        ports: creator.ports,
        links: creator.links,
      })
    );

    const node = document.createElement('div');

    node.style.top = `${maxPoint[1]}px`;
    node.style.left = `${maxPoint[0]}px`;
    node.style.width = '1px';
    node.style.height = '1px';
    node.style.position = 'absolute';

    // inserting this node to adjust scroll
    document.body.appendChild(node);
  };
