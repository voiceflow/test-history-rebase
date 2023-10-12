import type { NodeType } from '@/diagram/node/node-type.enum';

import type { Action } from '../action.interface';

export interface EndAction extends Action<NodeType.ACTION__END__V3, EndAction.Data> {}

export namespace EndAction {
  export interface Data extends Action.BaseData {
    responseID: string | null;
  }
}
