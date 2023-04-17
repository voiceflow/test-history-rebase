import { NodeData } from '@realtime-sdk/models';
import { BaseModels } from '@voiceflow/base-types';
import { GoogleNode } from '@voiceflow/google-types';

import { createBlockAdapter, createOutPortsAdapter, createOutPortsAdapterV2, findDBNextPort, outPortDataFromDB, outPortDataToDB } from '../utils';

const streamAdapter = createBlockAdapter<GoogleNode.Stream.StepData, NodeData.Stream>(
  ({ loop, audio, title, iconImage, description, backgroundImage }) => ({
    loop,
    audio,
    title: title ?? null,
    iconImage: iconImage ?? null,
    customPause: false,
    description: description ?? null,
    backgroundImage: backgroundImage ?? null,
  }),
  ({ loop, audio, title, iconImage, description, backgroundImage }) => ({
    loop,
    audio,
    title: title ?? undefined,
    iconImage: iconImage ?? undefined,
    description: description ?? undefined,
    backgroundImage: backgroundImage ?? undefined,
  })
);

export const streamOutPortsAdapter = createOutPortsAdapter<NodeData.StreamBuiltInPorts, NodeData.Stream>(
  (dbPorts, options) => {
    const dbNextPort = findDBNextPort(dbPorts);

    const nextPortData = outPortDataFromDB(dbNextPort, options);

    return {
      byKey: {},
      dynamic: [],
      builtIn: { [BaseModels.PortType.NEXT]: nextPortData },
    };
  },
  ({ builtIn: { [BaseModels.PortType.NEXT]: nextPortData } }) => [outPortDataToDB(nextPortData)]
);

export const streamOutPortsAdapterV2 = createOutPortsAdapterV2<NodeData.StreamBuiltInPorts, NodeData.Stream>(
  (dbPorts, options) => {
    const dbNextPort = dbPorts.builtIn[BaseModels.PortType.NEXT];
    const nextPortData = outPortDataFromDB(dbNextPort, options);

    return {
      byKey: {},
      dynamic: [],
      builtIn: { [BaseModels.PortType.NEXT]: nextPortData },
    };
  },
  ({ builtIn: { [BaseModels.PortType.NEXT]: nextPortData } }) => ({
    byKey: {},
    builtIn: { [BaseModels.PortType.NEXT]: outPortDataToDB(nextPortData) },
    dynamic: [],
  })
);

export default streamAdapter;
