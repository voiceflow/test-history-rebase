import * as Realtime from '@voiceflow/realtime-sdk';

import { BlockType } from '@/constants';
import type { Point } from '@/types';

import { isMarkupOrCombinedBlockType } from './typeGuards';

export const getNodesGroupCenter = (
  nodes: Realtime.NodeWithData[],
  links: Realtime.Link[]
): { center: Point; minX: number; maxX: number; minY: number; maxY: number } => {
  const combinedAndMarkupNodes = nodes.filter(({ node }) => isMarkupOrCombinedBlockType(node.type));

  const nodeXs = combinedAndMarkupNodes.map(({ node: { x } }) => x);
  const nodeYs = combinedAndMarkupNodes.map(({ node: { y } }) => y);
  const linkXs = links.flatMap(({ data }) => data?.points?.map(({ point }) => point[0]) ?? []);
  const linkYs = links.flatMap(({ data }) => data?.points?.map(({ point }) => point[1]) ?? []);

  const minX = Math.min(...nodeXs, ...linkXs);
  const maxX = Math.max(...nodeXs, ...linkXs);
  const minY = Math.min(...nodeYs, ...linkYs);
  const maxY = Math.max(...nodeYs, ...linkYs);

  const [centerX, centerY] = [minX + (maxX - minX) / 2, minY + (maxY - minY) / 2];

  return { center: [centerX, centerY], minX, maxX, minY, maxY };
};

export const centerNodeGroup = (
  entities: Realtime.EntityMap,
  [originX, originY]: Realtime.Point
): Realtime.EntityMap => {
  const combinedAndMarkupNodes = entities.nodesWithData.filter(({ node }) => isMarkupOrCombinedBlockType(node.type));

  const {
    center: [centerX, centerY],
  } = getNodesGroupCenter(combinedAndMarkupNodes, entities.links);

  const adjustPathPoint = (point: Realtime.PathPoint): Realtime.PathPoint => ({
    ...point,
    point: [originX + (point.point[0] - centerX), originY + (point.point[1] - centerY)],
  });

  const links = entities.links.map((link) =>
    link.data?.points ? { ...link, data: { ...link.data, points: link.data.points.map(adjustPathPoint) } } : link
  );

  const ports = entities.ports.map((port) =>
    port.linkData?.points
      ? { ...port, linkData: { ...port.linkData, points: port.linkData.points.map(adjustPathPoint) } }
      : port
  );

  const nodesWithData = entities.nodesWithData.map(({ node, data }) => ({
    node: { ...node, x: originX + (node.x - centerX), y: originY + (node.y - centerY) },
    data,
  }));

  return {
    links,
    ports,
    nodesWithData,
  };
};

export const isChipNode = (node: Realtime.Node | null, parentNode: Realtime.Node | null) =>
  node?.type === BlockType.START ||
  (parentNode?.combinedNodes.length === 1 && Realtime.Utils.typeGuards.isCanvasChipBlockType(node?.type));
