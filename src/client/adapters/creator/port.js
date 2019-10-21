import { BlockType, PlatformType } from '@/constants';

import { createAdapter } from '../utils';

const getAlternativePlatform = (platform) => (platform === PlatformType.ALEXA ? PlatformType.GOOGLE : PlatformType.ALEXA);

const getPortLabel = (port, index) => {
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
  (appPort, isInPort, linksByPortID, platform, type, index) => ({
    id: appPort.id,
    name: appPort.id,
    parentNode: appPort.nodeID,
    links: linksByPortID[appPort.id] || [],
    in: !!isInPort,
    label: (!isInPort && (getPortLabel(appPort, index) || appPort.label)) || ' ',
    ...(appPort.platform && { hidden: appPort.platform !== platform }),
  })
);

export default portAdapter;
