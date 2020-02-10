import { BlockType, PlatformType } from '@/constants';
import PortLabels from '@/pages/Canvas/managers/labels';

import { createAdapter } from '../utils';

const getAlternativePlatform = (platform) => (platform === PlatformType.ALEXA ? PlatformType.GOOGLE : PlatformType.ALEXA);

const getPortLabel = (port, type, index, platform) => {
  if (type !== BlockType.STREAM) {
    return PortLabels[type]?.(port, index, platform);
  }

  if (port.platform !== PlatformType.ALEXA) {
    return null;
  }

  switch (index) {
    case 1:
      return 'next';
    case 2:
      return 'previous';
    case 3:
      return 'pause';
    default:
      return null;
  }
};

const portAdapter = createAdapter(
  (dbPort, nodeType, platform) => ({
    id: dbPort.id,
    nodeID: dbPort.parentNode,
    label: dbPort.label?.trim?.() ? dbPort.label : null,
    // eslint-disable-next-line no-nested-ternary
    platform: nodeType === BlockType.STREAM && !dbPort.in ? (dbPort.hidden ? getAlternativePlatform(platform) : platform) : null,
  }),
  // eslint-disable-next-line max-params
  (appPort, isInPort, linksByPortID, platform, type, index) => ({
    id: appPort.id,
    name: appPort.id,
    parentNode: appPort.nodeID,
    links: linksByPortID[appPort.id] || [],
    in: !!isInPort,
    label: (!isInPort && (getPortLabel(appPort, type, index, platform) || appPort.label)) || ' ',
    ...(appPort.platform && { hidden: appPort.platform !== platform }),
  })
);

export default portAdapter;
