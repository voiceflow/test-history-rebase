import { BlockType, PlatformType } from '@/constants';
import { DBPort, Port } from '@/models';

import { createAdapter } from '../utils';
import { getAlternativePlatform, getPortLabel } from './utils';

const portAdapter = createAdapter<DBPort, Port, [BlockType, PlatformType], [boolean, Record<string, string[]>, PlatformType, BlockType?, number?]>(
  (dbPort, nodeType, platform) => ({
    id: dbPort.id,
    nodeID: dbPort.parentNode,
    label: dbPort.label?.trim?.() ? dbPort.label : null,
    // eslint-disable-next-line no-nested-ternary
    platform: nodeType === BlockType.STREAM && !dbPort.in ? (dbPort.hidden ? getAlternativePlatform(platform) : platform) : null,
    virtual: !!dbPort.virtual,
  }),
  // eslint-disable-next-line max-params
  (appPort, isInPort, linksByPortID, platform, type, index) => ({
    id: appPort.id,
    name: appPort.id,
    parentNode: appPort.nodeID,
    links: linksByPortID[appPort.id] || [],
    in: !!isInPort,
    label: String((!isInPort && (getPortLabel(appPort, type, index, platform) || appPort.label)) || ' '),
    ...(appPort.platform && { hidden: appPort.platform !== platform }),
  })
);

export default portAdapter;
