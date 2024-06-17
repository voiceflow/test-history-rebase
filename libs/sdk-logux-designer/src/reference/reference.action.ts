import { protocol } from '@voiceflow/common';
import type { Reference, ReferenceResource } from '@voiceflow/dtos';

import type { DesignerAction } from '@/types';

const typeFactory = protocol.typeFactory('reference');

interface ReferenceData {
  references: Reference[];
  referenceResources: ReferenceResource[];
}

export interface Replace extends DesignerAction {
  data: ReferenceData;
}

export const Replace = protocol.createAction<Replace>(typeFactory('replace'));

export interface AddMany extends DesignerAction {
  data: ReferenceData;
}

export const AddMany = protocol.createAction<AddMany>(typeFactory('add-many'));

export interface RemoveMany extends DesignerAction {
  data: ReferenceData;
}

export const RemoveMany = protocol.createAction<RemoveMany>(typeFactory('remove-many'));
