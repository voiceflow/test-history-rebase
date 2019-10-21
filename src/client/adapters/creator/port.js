import { BlockType, PlatformType } from '@/constants';
import PortLabels from '@/containers/CanvasV2/managers/labels';

import { createAdapter } from '../utils';

const getAlternativePlatform = (platform) => (platform === PlatformType.ALEXA ? PlatformType.GOOGLE : PlatformType.ALEXA);

const portAdapter = createAdapter(
  (dbPort, nodeType, platform) => ({
    id: dbPort.id,
    nodeID: dbPort.parentNode,
    label: dbPort.label?.trim?.() ? dbPort.label : null,
    // eslint-disable-next-line no-nested-ternary
    platform: nodeType === BlockType.STREAM && !dbPort.in ? (dbPort.hidden ? getAlternativePlatform(platform) : platform) : null,
  }),
  (appPort, isInPort, linksByPortID, platform, type, index) => ({
    id: appPort.id,
    name: appPort.id,
    parentNode: appPort.nodeID,
    links: linksByPortID[appPort.id] || [],
    in: !!isInPort,
    label: (!isInPort && (PortLabels[type]?.(appPort, index, platform) || appPort.label)) || ' ',
    ...(appPort.platform && { hidden: appPort.platform !== platform }),
  })
);

export default portAdapter;
