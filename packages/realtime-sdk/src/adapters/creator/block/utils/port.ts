import { Models as BaseModels } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import _pickBy from 'lodash/pickBy';

import { Link, LinkData, Node, Port } from '../../../../models';
import { PathPoint, PathPoints } from '../../../../types';
import { generateOutPort } from '../../utils';

interface PortData {
  port: Port;
  target: string | null;
  link?: Link;
}

export interface PortsAdapter<D = unknown> {
  toDB: (ports: PortData[], node: Node, data: D) => BaseModels.BasePort<LinkData>[];
  fromDB: (ports: BaseModels.BasePort<LinkData>[], node: BaseModels.BaseDiagramNode) => { port: Port; target: string | null }[];
}

const removePointsFalseyValues = (points?: PathPoints) =>
  points?.map((pathPoint): PathPoint => ({ ..._pickBy<PathPoint>(pathPoint, (value) => value === true), point: pathPoint.point }));

export const defaultPortAdapter: PortsAdapter = {
  toDB: (ports) =>
    ports.map(({ port, target, link }) => {
      const linkData: LinkData = {
        ...link?.data,
        points: link?.data?.points && removePointsFalseyValues(link?.data?.points),
      };

      return { type: port.label || '', target, id: port.id, data: linkData };
    }),
  fromDB: (ports, node) =>
    ports.map((port) => ({
      port: generateOutPort(node.nodeID, port, { label: port.type }),
      target: port.target,
    })),
};

export const migratePortsWithNoMatch = ([noMatchPort, ...tailPorts]: BaseModels.BasePort<LinkData>[]): BaseModels.BasePort<LinkData>[] => {
  if (!noMatchPort) {
    return [{ id: Utils.id.cuid(), data: {}, type: BaseModels.PortType.NO_MATCH, target: null }];
  }

  return [{ ...noMatchPort, type: BaseModels.PortType.NO_MATCH }, ...tailPorts];
};

export const getPortByLabel = (ports: PortData[], label: string): PortData | null => ports.find(({ port }) => port.label === label) ?? null;
