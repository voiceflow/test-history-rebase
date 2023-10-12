import type { Markup } from '@/common';
import type { Node } from '@/diagram/node/node.interface';
import type { NodeType } from '@/diagram/node/node-type.enum';

import type { Action } from '../action.interface';
import type { OpenURLTarget } from './open-url-target.enum';

export interface OpenURLAction extends Action<NodeType.ACTION__OPEN_URL__V3, OpenURLAction.Data, Node.PortsWithNext> {}

export namespace OpenURLAction {
  export interface Data extends Action.BaseData {
    url: Markup;
    target: OpenURLTarget;
  }
}
