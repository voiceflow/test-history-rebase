import { Models, Nullable } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';

import { BuiltInPortRecord, Link, LinkData, Node, Port } from '../../../../models';
import { PathPoint, PathPoints } from '../../../../types';
import { generateOutPort } from '../../utils';

export interface PortData {
  port: Port;
  link?: Link;
  target: string | null;
}

export type BuiltInPortDataRecord = { [key in Models.PortType]?: PortData };

interface PortsInfoFromDB<T extends BuiltInPortRecord = BuiltInPortRecord> {
  ports: PortData[];
  dynamic: string[];
  builtIn: T;
}
interface PortsInfoToDB<T extends BuiltInPortDataRecord = BuiltInPortDataRecord> {
  dynamic: PortData[];
  builtIn: T;
}

interface OutPortsToDBOptions<D = unknown> {
  node: Node;
  data: D;
}

interface OutPortsFromDBOptions {
  node: Models.BaseDiagramNode;
}

export interface OutPortsAdapter<T extends BuiltInPortRecord = BuiltInPortRecord, D = unknown> {
  toDB: (portsInfo: PortsInfoToDB<{ [key in keyof T]: PortData }>, options: OutPortsToDBOptions<D>) => Models.BasePort<LinkData>[];
  fromDB: (ports: Models.BasePort<LinkData>[], options: OutPortsFromDBOptions) => PortsInfoFromDB<T>;
}

export const createOutPortsAdapter = <T extends BuiltInPortRecord = BuiltInPortRecord, D = unknown>(
  fromDB: OutPortsAdapter<T, D>['fromDB'],
  toDB: OutPortsAdapter<T, D>['toDB']
): OutPortsAdapter<T, D> => ({
  toDB,
  fromDB,
});

export const dbBuiltInPortFactory = (type: Models.PortType, target: string | null = null): Models.BasePort<LinkData> => ({
  id: Utils.id.objectID(),
  data: {},
  type,
  target,
});

export const outPortDataToDB = ({ port, link, target }: PortData): Models.BasePort<LinkData> => ({
  type: port.label || '',
  target,
  id: port.id,
  data: link?.data,
});

export const outPortDataFromDB = (port: Models.BasePort<LinkData>, { node }: OutPortsFromDBOptions): PortData => ({
  port: generateOutPort(node.nodeID, port, { label: port.type }),
  target: port.target,
});

export const outPortsDataFromDB = (ports: Models.BasePort<LinkData>[], options: OutPortsFromDBOptions): PortData[] =>
  ports.map((port) => outPortDataFromDB(port, options));

export const outPortsDataToDB = (ports: PortData[]): Models.BasePort<LinkData>[] => ports.map(outPortDataToDB);

export const getPortByLabel = (ports: PortData[], label: string): PortData | null => ports.find(({ port }) => port.label === label) ?? null;

const removePointsFalsyValues = (points?: PathPoints | null): PathPoints | undefined =>
  points
    ? points.map(
        (pathPoint): PathPoint => ({
          ...pathPoint,
          point: pathPoint.point,
          toTop: pathPoint.toTop || undefined,
          locked: pathPoint.locked || undefined,
          reversed: pathPoint.reversed || undefined,
          allowedToTop: pathPoint.allowedToTop || undefined,
        })
      )
    : undefined;

export const removePortDataFalsyValues = (port: Models.BasePort<LinkData>): Models.BasePort<LinkData> => ({
  ...port,
  data: port.data
    ? {
        ...port.data,
        type: port.data.type ?? undefined,
        color: port.data.color ?? undefined,
        points: removePointsFalsyValues(port.data.points),
        caption: port.data.caption ?? undefined,
      }
    : undefined,
});

export const findDBPortByType = (ports: Models.BasePort<LinkData>[], type: Models.PortType): Nullable<Models.BasePort<LinkData>> =>
  ports.find(({ type: portType }) => portType === type) ?? null;

export const migrateDBPortType = (dbPort: Models.BasePort<LinkData> | null, newPortType: Models.PortType): Models.BasePort<LinkData> => {
  if (!dbPort) {
    return dbBuiltInPortFactory(newPortType);
  }

  if (dbPort.type !== newPortType) {
    Object.assign(dbPort, { type: newPortType });
  }

  return dbPort;
};

export const findDBNoMatchPort = (ports: Models.BasePort<LinkData>[]): Models.BasePort<LinkData> =>
  findDBPortByType(ports, Models.PortType.NO_MATCH) ?? migrateDBPortType(ports[0], Models.PortType.NO_MATCH); // no match should be first

export const findDBNextPort = (ports: Models.BasePort<LinkData>[]): Models.BasePort<LinkData> =>
  findDBPortByType(ports, Models.PortType.NEXT) ?? migrateDBPortType(ports[0], Models.PortType.NEXT); // next should be first

export const withoutDBPort = (ports: Models.BasePort<LinkData>[], withoutPort: Nullable<Models.BasePort<LinkData>>): Models.BasePort<LinkData>[] =>
  withoutPort === null ? ports : Utils.array.withoutValue(ports, withoutPort);

export const withoutDBPorts = (
  ports: Models.BasePort<LinkData>[],
  withoutPorts: Nullable<Models.BasePort<LinkData>>[]
): Models.BasePort<LinkData>[] => Utils.array.withoutValues(ports, withoutPorts.filter(Boolean) as Models.BasePort<LinkData>[]);

export const nextOnlyOutPortsAdapter = createOutPortsAdapter<{ [Models.PortType.NEXT]: string }>(
  (dbPorts, options) => {
    const dbNextPort = findDBNextPort(dbPorts);

    const nextPortData = outPortDataFromDB(dbNextPort, options);

    return {
      ports: [nextPortData],
      dynamic: [],
      builtIn: { [Models.PortType.NEXT]: nextPortData.port.id },
    };
  },
  ({ builtIn: { [Models.PortType.NEXT]: nextPortData } }) => [outPortDataToDB(nextPortData)]
);

export const dynamicOnlyOutPortsAdapter = createOutPortsAdapter(
  (dbPorts, options) => {
    const dynamicPortsData = outPortsDataFromDB(dbPorts, options);

    return {
      ports: dynamicPortsData,
      dynamic: dynamicPortsData.map(({ port }) => port.id),
      builtIn: {},
    };
  },
  ({ dynamic }) => outPortsDataToDB(dynamic)
);

export const defaultOutPortsAdapter = createOutPortsAdapter<{ [Models.PortType.NEXT]: string }>(
  (dbPorts, options) => {
    const dbNextPort = findDBNextPort(dbPorts);
    const dbDynamicPorts = withoutDBPort(dbPorts, dbNextPort);

    const nextPortData = outPortDataFromDB(dbNextPort, options);
    const dynamicPortsData = outPortsDataFromDB(dbDynamicPorts, options);

    return {
      ports: [nextPortData, ...dynamicPortsData],
      dynamic: dynamicPortsData.map(({ port }) => port.id),
      builtIn: { [Models.PortType.NEXT]: nextPortData.port.id },
    };
  },
  ({ builtIn: { [Models.PortType.NEXT]: nextPortData }, dynamic }) => [outPortDataToDB(nextPortData), ...outPortsDataToDB(dynamic)]
);

export const nextNoMatchNoReplyOutPortsAdapter = createOutPortsAdapter<{
  [Models.PortType.NEXT]: string;
  [Models.PortType.NO_MATCH]?: string;
  [Models.PortType.NO_REPLY]?: string;
}>(
  (dbPorts, options) => {
    const dbNextPort = findDBNextPort(dbPorts);
    const dbNoReplyPort = findDBPortByType(dbPorts, Models.PortType.NO_REPLY);
    const dbNoMatchPort = findDBPortByType(dbPorts, Models.PortType.NO_MATCH);

    const nextPortData = outPortDataFromDB(dbNextPort, options);
    const noReplyPortData = dbNoReplyPort && outPortDataFromDB(dbNoReplyPort, options);
    const noMatchPortData = dbNoMatchPort && outPortDataFromDB(dbNoMatchPort, options);

    return {
      ports: [nextPortData, ...Utils.array.filterOutNullish([noReplyPortData, noMatchPortData])],
      dynamic: [],
      builtIn: {
        [Models.PortType.NEXT]: nextPortData.port.id,
        [Models.PortType.NO_REPLY]: noReplyPortData?.port.id ?? undefined,
        [Models.PortType.NO_MATCH]: noMatchPortData?.port.id ?? undefined,
      },
    };
  },
  ({
    builtIn: { [Models.PortType.NEXT]: nextPortData, [Models.PortType.NO_MATCH]: noMatchPortData, [Models.PortType.NO_REPLY]: noReplyPortData },
  }) => [
    outPortDataToDB(nextPortData), //  should be first for backward compatible
    ...Utils.array.filterOutNullish([noReplyPortData, noMatchPortData]).map(outPortDataToDB),
  ]
);

export const nextAndFailOnlyOutPortsAdapter = createOutPortsAdapter<{ [Models.PortType.NEXT]: string; [Models.PortType.FAIL]: string }>(
  (dbPorts, options) => {
    const dbNextPort = findDBNextPort(dbPorts);
    const dbFailPort =
      findDBPortByType(dbPorts, Models.PortType.FAIL) ?? migrateDBPortType(withoutDBPort(dbPorts, dbNextPort)[0], Models.PortType.FAIL);

    const nextPortData = outPortDataFromDB(dbNextPort, options);
    const failPortData = outPortDataFromDB(dbFailPort, options);

    return {
      ports: [nextPortData, failPortData],
      dynamic: [],
      builtIn: {
        [Models.PortType.FAIL]: failPortData.port.id,
        [Models.PortType.NEXT]: nextPortData.port.id,
      },
    };
  },
  ({ builtIn: { [Models.PortType.NEXT]: nextPortData, [Models.PortType.FAIL]: failPortData } }) => [
    outPortDataToDB(nextPortData),
    outPortDataToDB(failPortData),
  ]
);

export const noMatchNoReplyAndDynamicOutPortsAdapter = createOutPortsAdapter<{
  [Models.PortType.NO_MATCH]: string;
  [Models.PortType.NO_REPLY]?: string;
}>(
  (dbPorts, options) => {
    const dbNoMatchPort = findDBNoMatchPort(dbPorts);
    const dbNoReplyPort = findDBPortByType(dbPorts, Models.PortType.NO_REPLY);

    const dynamicDBPorts = withoutDBPorts(dbPorts, [dbNoMatchPort, dbNoReplyPort]);

    const noMatchPortData = outPortDataFromDB(dbNoMatchPort, options);
    const noReplyPortData = dbNoReplyPort && outPortDataFromDB(dbNoReplyPort, options);
    const dynamicPortsData = outPortsDataFromDB(dynamicDBPorts, options);

    return {
      ports: [noMatchPortData, ...Utils.array.filterOutNullish([noReplyPortData]), ...dynamicPortsData],
      dynamic: dynamicPortsData.map(({ port }) => port.id),
      builtIn: {
        [Models.PortType.NO_MATCH]: noMatchPortData.port.id,
        [Models.PortType.NO_REPLY]: noReplyPortData?.port.id ?? undefined,
      },
    };
  },
  ({ builtIn: { [Models.PortType.NO_MATCH]: noMatchPortData, [Models.PortType.NO_REPLY]: noReplyPortData }, dynamic }) => [
    outPortDataToDB(noMatchPortData), // should be first for backward compatible
    ...outPortsDataToDB(dynamic),
    ...Utils.array.filterOutNullish([noReplyPortData && outPortDataToDB(noReplyPortData)]),
  ]
);

export const emptyOutPortsAdapter = createOutPortsAdapter(
  () => ({ ports: [], dynamic: [], builtIn: {} }),
  () => []
);
