import { BuiltInPortRecord, DBPortWithLinkData } from '@realtime-sdk/models';
import { BaseModels, Nullable } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';

import {
  BuiltInPortData,
  outPortDataFromDB,
  outPortDataToDB,
  outPortsDataFromDB,
  outPortsDataToDB,
  OutPortsFromDBOptions,
  OutPortsToDBOptions,
  PortData,
  PortsInfo,
} from './port';

export interface OutPortsAdapterV2<T extends BuiltInPortRecord<string> = BuiltInPortRecord<string>, D = unknown> {
  toDB: (
    portsInfo: PortsInfo<{ [key in keyof T]: PortData }>,
    options: OutPortsToDBOptions<D>
  ) => BaseModels.BaseStepPorts<{ [key in keyof T]: DBPortWithLinkData }, DBPortWithLinkData[]>;
  fromDB: (
    ports: BaseModels.BaseStepPorts<{ [key in keyof T]: DBPortWithLinkData }, DBPortWithLinkData[]>,
    options: OutPortsFromDBOptions
  ) => PortsInfo<BuiltInPortData<T>>;
}

export const createOutPortsAdapterV2 = <T extends BuiltInPortRecord<string> = BuiltInPortRecord<string>, D = unknown>(
  fromDB: OutPortsAdapterV2<T, D>['fromDB'],
  toDB: OutPortsAdapterV2<T, D>['toDB']
): OutPortsAdapterV2<T, D> => ({ toDB, fromDB });

export const withoutDBPortV2 = (ports: DBPortWithLinkData[], withoutPort: Nullable<DBPortWithLinkData>): DBPortWithLinkData[] =>
  withoutPort === null ? ports : Utils.array.withoutValue(ports, withoutPort);

export const nextOnlyOutPortsAdapterV2 = createOutPortsAdapterV2<{ [BaseModels.PortType.NEXT]: string }>(
  (dbPorts, options) => {
    const dbNextPort = dbPorts.builtIn[BaseModels.PortType.NEXT];

    const nextPortData = outPortDataFromDB(dbNextPort, options);

    return {
      dynamic: [],
      builtIn: { [BaseModels.PortType.NEXT]: nextPortData },
    };
  },
  ({ builtIn: { [BaseModels.PortType.NEXT]: nextPortData } }) => ({
    builtIn: { [BaseModels.PortType.NEXT]: outPortDataToDB(nextPortData) },
    dynamic: [],
  })
);

export const dynamicOnlyOutPortsAdapterV2 = createOutPortsAdapterV2(
  (dbPorts, options) => {
    const dynamicPortsData = outPortsDataFromDB(dbPorts.dynamic, options);

    return {
      dynamic: dynamicPortsData,
      builtIn: {},
    };
  },
  ({ dynamic }) => ({
    builtIn: {},
    dynamic: outPortsDataToDB(dynamic),
  })
);

export const defaultOutPortsAdapterV2 = createOutPortsAdapterV2<{ [BaseModels.PortType.NEXT]: string }>(
  (dbPorts, options) => {
    const dbNextPort = dbPorts.builtIn[BaseModels.PortType.NEXT];
    const dbDynamicPorts = dbPorts.dynamic;

    const nextPortData = outPortDataFromDB(dbNextPort, options);
    const dynamicPortsData = outPortsDataFromDB(dbDynamicPorts, options);

    return {
      dynamic: dynamicPortsData,
      builtIn: { [BaseModels.PortType.NEXT]: nextPortData },
    };
  },
  ({ builtIn: { [BaseModels.PortType.NEXT]: nextPortData }, dynamic }) => ({
    builtIn: {
      [BaseModels.PortType.NEXT]: outPortDataToDB(nextPortData),
    },
    dynamic: outPortsDataToDB(dynamic),
  })
);

export const nextNoMatchNoReplyOutPortsAdapterV2 = createOutPortsAdapterV2<{
  [BaseModels.PortType.NEXT]: string;
  [BaseModels.PortType.NO_MATCH]?: string;
  [BaseModels.PortType.NO_REPLY]?: string;
}>(
  (dbPorts, options) => {
    const dbNextPort = dbPorts.builtIn[BaseModels.PortType.NEXT];
    const dbNoReplyPort = dbPorts.builtIn[BaseModels.PortType.NO_REPLY];
    const dbNoMatchPort = dbPorts.builtIn[BaseModels.PortType.NO_MATCH];

    const nextPortData = outPortDataFromDB(dbNextPort, options);
    const noReplyPortData = dbNoReplyPort && outPortDataFromDB(dbNoReplyPort, options);
    const noMatchPortData = dbNoMatchPort && outPortDataFromDB(dbNoMatchPort, options);

    return {
      dynamic: [],
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
  }) => ({
    builtIn: {
      [BaseModels.PortType.NEXT]: outPortDataToDB(nextPortData),
      ...(noReplyPortData ? { [BaseModels.PortType.NO_REPLY]: outPortDataToDB(noReplyPortData) } : {}),
      ...(noMatchPortData ? { [BaseModels.PortType.NO_MATCH]: outPortDataToDB(noMatchPortData) } : {}),
    },
    dynamic: [],
  })
);

export const nextAndFailOnlyOutPortsAdapterV2 = createOutPortsAdapterV2<{
  [BaseModels.PortType.NEXT]: string;
  [BaseModels.PortType.FAIL]: string;
}>(
  (dbPorts, options) => {
    const dbNextPort = dbPorts.builtIn[BaseModels.PortType.NEXT];
    const dbFailPort = dbPorts.builtIn[BaseModels.PortType.FAIL];

    const nextPortData = outPortDataFromDB(dbNextPort, options);
    const failPortData = outPortDataFromDB(dbFailPort, options);

    return {
      dynamic: [],
      builtIn: {
        [BaseModels.PortType.FAIL]: failPortData,
        [BaseModels.PortType.NEXT]: nextPortData,
      },
    };
  },
  ({ builtIn: { [BaseModels.PortType.NEXT]: nextPortData, [BaseModels.PortType.FAIL]: failPortData } }) => ({
    builtIn: {
      [BaseModels.PortType.NEXT]: outPortDataToDB(nextPortData),
      [BaseModels.PortType.FAIL]: outPortDataToDB(failPortData),
    },
    dynamic: [],
  })
);

export const noMatchNoReplyAndDynamicOutPortsAdapterV2 = createOutPortsAdapterV2<{
  [BaseModels.PortType.NO_MATCH]: string;
  [BaseModels.PortType.NO_REPLY]?: string;
}>(
  (dbPorts, options) => {
    const dbNoMatchPort = dbPorts.builtIn[BaseModels.PortType.NO_MATCH];
    const dbNoReplyPort = dbPorts.builtIn[BaseModels.PortType.NO_REPLY];
    const dynamicDBPorts = dbPorts.dynamic;

    const noMatchPortData = outPortDataFromDB(dbNoMatchPort, options);
    const noReplyPortData = dbNoReplyPort && outPortDataFromDB(dbNoReplyPort, options);
    const dynamicPortsData = outPortsDataFromDB(dynamicDBPorts, options);

    return {
      dynamic: dynamicPortsData,
      builtIn: {
        [BaseModels.PortType.NO_MATCH]: noMatchPortData,
        [BaseModels.PortType.NO_REPLY]: noReplyPortData ?? undefined,
      },
    };
  },
  ({ builtIn: { [BaseModels.PortType.NO_MATCH]: noMatchPortData, [BaseModels.PortType.NO_REPLY]: noReplyPortData }, dynamic }) => ({
    builtIn: {
      [BaseModels.PortType.NO_MATCH]: outPortDataToDB(noMatchPortData),
      ...(noReplyPortData ? { [BaseModels.PortType.NO_REPLY]: outPortDataToDB(noReplyPortData) } : {}),
    },
    dynamic: outPortsDataToDB(dynamic),
  })
);

export const emptyOutPortsAdapterV2 = createOutPortsAdapterV2(
  () => ({ ports: [], dynamic: [], builtIn: {} }),
  () => ({ builtIn: {}, dynamic: [] })
);
