import { protocol } from '@voiceflow/common';
import type { KnowledgeBaseSettings } from '@voiceflow/dtos';

import type { DesignerAction } from '@/types';

import { typeFactory as kbTypeFactory } from '../knowledge-base.type';

const typeFactory = protocol.typeFactory(kbTypeFactory('settings'));

export type PatchData = Partial<KnowledgeBaseSettings>;

export interface Replace extends DesignerAction {
  data: KnowledgeBaseSettings;
}

export const Replace = protocol.createAction<Replace>(typeFactory('replace'));

export interface Patch extends DesignerAction {
  data: PatchData;
}

export const Patch = protocol.createAction<Patch>(typeFactory('patch'));
