import { CREATOR_KEY } from '@realtime-sdk/constants';
import { Link, Node, NodeData, Port } from '@realtime-sdk/models';
import { BaseDiagramPayload } from '@realtime-sdk/types';
import { Utils } from '@voiceflow/common';

export const creatorType = Utils.protocol.typeFactory(CREATOR_KEY);

export interface InitializePayload extends BaseDiagramPayload {
  nodes: [Node, NodeData<unknown>][];
  ports: Port[];
  links: Link[];
}

export const initialize = Utils.protocol.createAction<InitializePayload>(creatorType('INITIALIZE'));

export const reset = Utils.protocol.createAction(creatorType('RESET'));
