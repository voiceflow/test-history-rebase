import { BuiltInPortRecord, DBPortWithLinkData, Link, Node, Port } from '@realtime-sdk/models';
import { PathPoint, PathPoints } from '@realtime-sdk/types';
import * as RealtimeUtilsPort from '@realtime-sdk/utils/port';
import { BaseModels, Nullable } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import _range from 'lodash/range';

import { generateOutPort } from '../../utils';

export interface PortData {
  port: Port;
  link?: Link;
  target: string | null;
}

export type BuiltInPortDataRecord = BuiltInPortRecord<PortData>;

export type BuiltInPortData<T extends BuiltInPortRecord<any>> = {
  [K in keyof T]: PortData;
};

export interface PortsInfo<T extends BuiltInPortDataRecord = BuiltInPortDataRecord> {
  dynamic: PortData[];
  builtIn: T;
  byKey: Record<string, PortData>;
}

export interface OutPortsToDBOptions<D = unknown> {
  node: Node;
  data: D;
}

export interface OutPortsFromDBOptions {
  node: BaseModels.BaseDiagramNode;
}

export interface OutPortsAdapter<T extends BuiltInPortRecord<string> = BuiltInPortRecord<string>, D = unknown> {
  toDB: (portsInfo: PortsInfo<BuiltInPortData<T>>, options: OutPortsToDBOptions<D>) => DBPortWithLinkData[];
  fromDB: (ports: DBPortWithLinkData[], options: OutPortsFromDBOptions) => PortsInfo<BuiltInPortData<T>>;
}

export const createOutPortsAdapter = <T extends BuiltInPortRecord<string> = BuiltInPortRecord<string>, D = unknown>(
  fromDB: OutPortsAdapter<T, D>['fromDB'],
  toDB: OutPortsAdapter<T, D>['toDB']
): OutPortsAdapter<T, D> => ({
  toDB,
  fromDB,
});

export const dbBuiltInPortFactory = (type: BaseModels.PortType, target: string | null = null): DBPortWithLinkData => ({
  id: Utils.id.objectID(),
  data: {},
  type,
  target,
});

export const outPortDataToDB = ({ port, link, target }: PortData): DBPortWithLinkData => ({
  type: port.label || '',
  target,
  id: port.id,
  data: link?.data ?? port.linkData,
});

export const outPortDataFromDB = (port: DBPortWithLinkData, { node }: OutPortsFromDBOptions): PortData => ({
  port: generateOutPort(node.nodeID, port, { label: port?.type }),
  target: port?.target,
});

export const outPortsDataFromDB = (ports: DBPortWithLinkData[], options: OutPortsFromDBOptions): PortData[] =>
  ports.map((port) => outPortDataFromDB(port, options));

export const outPortsDataToDB = (ports: PortData[]): DBPortWithLinkData[] => ports.map(outPortDataToDB);

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

export const removePortDataFalsyValues = (port: DBPortWithLinkData): DBPortWithLinkData => ({
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

export const findDBPortByType = (ports: DBPortWithLinkData[], type: BaseModels.PortType): Nullable<DBPortWithLinkData> =>
  ports.find(({ type: portType }) => portType === type) ?? null;

export const migrateDBPortType = (dbPort: DBPortWithLinkData | null, newPortType: BaseModels.PortType): DBPortWithLinkData => {
  if (!dbPort) {
    return dbBuiltInPortFactory(newPortType);
  }

  if (dbPort.type !== newPortType) {
    Object.assign(dbPort, { type: newPortType });
  }

  return dbPort;
};

export const findDBNoMatchPort = (ports: DBPortWithLinkData[]): DBPortWithLinkData =>
  findDBPortByType(ports, BaseModels.PortType.NO_MATCH) ?? migrateDBPortType(ports[0], BaseModels.PortType.NO_MATCH); // no match should be first

export const findDBNextPort = (ports: DBPortWithLinkData[]): DBPortWithLinkData =>
  findDBPortByType(ports, BaseModels.PortType.NEXT) ?? migrateDBPortType(ports[0], BaseModels.PortType.NEXT); // next should be first

export const withoutDBPort = (ports: DBPortWithLinkData[], withoutPort: Nullable<DBPortWithLinkData>): DBPortWithLinkData[] =>
  withoutPort === null ? ports : Utils.array.withoutValue(ports, withoutPort);

export const withoutDBPorts = (ports: DBPortWithLinkData[], withoutPorts: Nullable<DBPortWithLinkData>[]): DBPortWithLinkData[] =>
  Utils.array.withoutValues(ports, withoutPorts.filter(Boolean) as DBPortWithLinkData[]);

export const nextOnlyOutPortsAdapter = createOutPortsAdapter<{ [BaseModels.PortType.NEXT]: string }>(
  (dbPorts, options) => {
    const dbNextPort = findDBNextPort(dbPorts);

    const nextPortData = outPortDataFromDB(dbNextPort, options);

    return {
      ...RealtimeUtilsPort.createEmptyNodeOutPorts(),
      builtIn: { [BaseModels.PortType.NEXT]: nextPortData },
    };
  },
  ({ builtIn: { [BaseModels.PortType.NEXT]: nextPortData } }) => [outPortDataToDB(nextPortData)]
);

export const dynamicOnlyOutPortsAdapter = createOutPortsAdapter(
  (dbPorts, options) => {
    const dynamicPortsData = outPortsDataFromDB(dbPorts, options);

    return {
      ...RealtimeUtilsPort.createEmptyNodeOutPorts(),
      dynamic: dynamicPortsData,
    };
  },
  ({ dynamic }) => outPortsDataToDB(dynamic)
);

export const defaultOutPortsAdapter = createOutPortsAdapter<{ [BaseModels.PortType.NEXT]: string }>(
  (dbPorts, options) => {
    const dbNextPort = findDBNextPort(dbPorts);
    const dbDynamicPorts = withoutDBPort(dbPorts, dbNextPort);

    const nextPortData = outPortDataFromDB(dbNextPort, options);
    const dynamicPortsData = outPortsDataFromDB(dbDynamicPorts, options);

    return {
      ...RealtimeUtilsPort.createEmptyNodeOutPorts(),
      dynamic: dynamicPortsData,
      builtIn: { [BaseModels.PortType.NEXT]: nextPortData },
    };
  },
  ({ builtIn: { [BaseModels.PortType.NEXT]: nextPortData }, dynamic }) => [outPortDataToDB(nextPortData), ...outPortsDataToDB(dynamic)]
);

export const nextNoMatchNoReplyOutPortsAdapter = createOutPortsAdapter<{
  [BaseModels.PortType.NEXT]: string;
  [BaseModels.PortType.NO_MATCH]?: string;
  [BaseModels.PortType.NO_REPLY]?: string;
}>(
  (dbPorts, options) => {
    const dbNextPort = findDBNextPort(dbPorts);
    const dbNoReplyPort = findDBPortByType(dbPorts, BaseModels.PortType.NO_REPLY);
    const dbNoMatchPort = findDBPortByType(dbPorts, BaseModels.PortType.NO_MATCH);

    const nextPortData = outPortDataFromDB(dbNextPort, options);
    const noReplyPortData = dbNoReplyPort && outPortDataFromDB(dbNoReplyPort, options);
    const noMatchPortData = dbNoMatchPort && outPortDataFromDB(dbNoMatchPort, options);

    return {
      ...RealtimeUtilsPort.createEmptyNodeOutPorts(),
      builtIn: {
        [BaseModels.PortType.NEXT]: nextPortData,
        [BaseModels.PortType.NO_REPLY]: noReplyPortData ?? undefined,
        [BaseModels.PortType.NO_MATCH]: noMatchPortData ?? undefined,
      },
    };
  },
  ({
    builtIn: {
      [BaseModels.PortType.NEXT]: nextPortData,
      [BaseModels.PortType.NO_MATCH]: noMatchPortData,
      [BaseModels.PortType.NO_REPLY]: noReplyPortData,
    },
  }) => [
    outPortDataToDB(nextPortData), //  should be first for backward compatible
    ...Utils.array.filterOutNullish([noReplyPortData, noMatchPortData]).map(outPortDataToDB),
  ]
);

export const nextAndFailOnlyOutPortsAdapter = createOutPortsAdapter<{ [BaseModels.PortType.NEXT]: string; [BaseModels.PortType.FAIL]: string }>(
  (dbPorts, options) => {
    const dbNextPort = findDBNextPort(dbPorts);
    const dbFailPort =
      findDBPortByType(dbPorts, BaseModels.PortType.FAIL) ?? migrateDBPortType(withoutDBPort(dbPorts, dbNextPort)[0], BaseModels.PortType.FAIL);

    const nextPortData = outPortDataFromDB(dbNextPort, options);
    const failPortData = outPortDataFromDB(dbFailPort, options);

    return {
      ...RealtimeUtilsPort.createEmptyNodeOutPorts(),
      builtIn: {
        [BaseModels.PortType.FAIL]: failPortData,
        [BaseModels.PortType.NEXT]: nextPortData,
      },
    };
  },
  ({ builtIn: { [BaseModels.PortType.NEXT]: nextPortData, [BaseModels.PortType.FAIL]: failPortData } }) => [
    outPortDataToDB(nextPortData),
    outPortDataToDB(failPortData),
  ]
);

export const noMatchNoReplyAndDynamicOutPortsAdapter = createOutPortsAdapter<{
  [BaseModels.PortType.NO_MATCH]?: string;
  [BaseModels.PortType.NO_REPLY]?: string;
}>(
  (dbPorts, options) => {
    const dbNoMatchPort = findDBNoMatchPort(dbPorts);
    const dbNoReplyPort = findDBPortByType(dbPorts, BaseModels.PortType.NO_REPLY);

    const dynamicDBPorts = withoutDBPorts(dbPorts, [dbNoMatchPort, dbNoReplyPort]);

    const noMatchPortData = outPortDataFromDB(dbNoMatchPort, options);
    const noReplyPortData = dbNoReplyPort && outPortDataFromDB(dbNoReplyPort, options);
    const dynamicPortsData = outPortsDataFromDB(dynamicDBPorts, options);

    return {
      ...RealtimeUtilsPort.createEmptyNodeOutPorts(),
      dynamic: dynamicPortsData,
      builtIn: {
        [BaseModels.PortType.NO_MATCH]: noMatchPortData,
        [BaseModels.PortType.NO_REPLY]: noReplyPortData ?? undefined,
      },
    };
  },
  ({ builtIn: { [BaseModels.PortType.NO_MATCH]: noMatchPortData, [BaseModels.PortType.NO_REPLY]: noReplyPortData }, dynamic }) => [
    noMatchPortData ? outPortDataToDB(noMatchPortData) : dbBuiltInPortFactory(BaseModels.PortType.NO_MATCH), // should be first for backward compatible
    ...outPortsDataToDB(dynamic),
    ...Utils.array.filterOutNullish([noReplyPortData && outPortDataToDB(noReplyPortData)]),
  ]
);

export const emptyOutPortsAdapter = createOutPortsAdapter(
  () => ({ ...RealtimeUtilsPort.createEmptyNodeOutPorts(), ports: [] }),
  () => []
);

export const syncDynamicPortsLength = <T extends BuiltInPortRecord<any>>({
  nodeID,
  ports,
  length,
}: {
  nodeID: string;
  ports: PortsInfo<BuiltInPortData<T>>;
  length: number;
}): PortsInfo<BuiltInPortData<T>> => {
  if (!Number.isInteger(length) || length === ports.dynamic.length) {
    return ports;
  }

  const difference = length - ports.dynamic.length;
  if (difference > 0) {
    return {
      ...ports,
      dynamic: [...ports.dynamic, ..._range(difference).map(() => ({ port: generateOutPort(nodeID), target: null }))],
    };
  }

  return {
    ...ports,
    dynamic: ports.dynamic.slice(0, length),
  };
};
