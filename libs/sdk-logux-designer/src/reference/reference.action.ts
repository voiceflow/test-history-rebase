import { protocol } from '@voiceflow/common';
import type { Reference, ReferenceResource } from '@voiceflow/dtos';

import type { DesignerAction } from '@/types';

const typeFactory = protocol.typeFactory('reference');

export interface Replace extends DesignerAction {
  data: {
    references: Reference[];
    referenceResources: ReferenceResource[];
  };
}

export const Replace = protocol.createAction<Replace>(typeFactory('replace'));
