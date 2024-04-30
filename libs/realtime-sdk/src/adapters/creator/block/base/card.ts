import { BaseNode } from '@voiceflow/base-types';
import _capitalize from 'lodash/capitalize';

import type { NodeData } from '@/models';

import {
  createBlockAdapter,
  createOutPortsAdapter,
  createOutPortsAdapterV2,
  nextOnlyOutPortsAdapter,
  nextOnlyOutPortsAdapterV2,
} from '../utils';

const cardAdapter = createBlockAdapter<BaseNode.Card.StepData, NodeData.Card>(
  ({ type = BaseNode.Card.CardType.SIMPLE, title, text: content, image }) => ({
    title,
    content,
    cardType: _capitalize(type) as BaseNode.Card.CardType,
    largeImage: image?.largeImageUrl || null,
    smallImage: image?.smallImageUrl || null,
    hasSmallImage: !!image?.smallImageUrl,
  }),
  ({ cardType: type = BaseNode.Card.CardType.SIMPLE, title = '', content: text = '', largeImage, smallImage }) => ({
    type,
    text,
    title,
    image: {
      smallImageUrl: smallImage || undefined,
      largeImageUrl: largeImage || undefined,
    },
  })
);

export const cardOutPortsAdapter = createOutPortsAdapter<NodeData.CardBuiltInPorts, NodeData.Card>(
  (dbPorts, options) => nextOnlyOutPortsAdapter.fromDB(dbPorts, options),
  (dbPorts, options) => nextOnlyOutPortsAdapter.toDB(dbPorts, options)
);

export const cardOutPortsAdapterV2 = createOutPortsAdapterV2<NodeData.CardBuiltInPorts, NodeData.Card>(
  (dbPorts, options) => nextOnlyOutPortsAdapterV2.fromDB(dbPorts, options),
  (dbPorts, options) => nextOnlyOutPortsAdapterV2.toDB(dbPorts, options)
);

export default cardAdapter;
