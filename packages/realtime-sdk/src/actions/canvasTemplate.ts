import { createAsyncAction, createCRUDActions, createType } from '@realtime-sdk/actions/utils';
import { CANVAS_TEMPLATE_KEY } from '@realtime-sdk/constants';
import { BaseVersionPayload } from '@realtime-sdk/types';
import { BaseModels } from '@voiceflow/base-types';

const canvasTemplateType = createType(CANVAS_TEMPLATE_KEY);

export interface CreateCanvasTemplatePayload extends BaseVersionPayload {
  canvasTemplate: BaseModels.Version.CanvasTemplate;
}

export interface PatchCanvasTemplatePayload extends Partial<Omit<BaseModels.Version.CanvasTemplate, 'id'>> {}

export const crud = createCRUDActions<BaseModels.Version.CanvasTemplate, BaseVersionPayload, PatchCanvasTemplatePayload>(canvasTemplateType);

export const create = createAsyncAction<CreateCanvasTemplatePayload, BaseModels.Version.CanvasTemplate>(canvasTemplateType('CREATE'));

export const patch = createAsyncAction<PatchCanvasTemplatePayload, BaseModels.Version.CanvasTemplate>(canvasTemplateType('PATCH'));
