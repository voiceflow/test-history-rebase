import { response } from '@/postgres/response/response.fixture';

import { NodeType } from '../../node/node-type.enum';
import type { EndAction } from './end.action';

export const endAction: EndAction = {
  id: 'end-action-1',
  parentID: 'actions-1',
  type: NodeType.ACTION__END__V3,

  data: {
    responseID: response.id,
  } as any,

  ports: null,
};
