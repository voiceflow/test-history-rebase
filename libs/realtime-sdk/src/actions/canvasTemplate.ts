import { createCRUDActions } from '@realtime-sdk/actions/utils';
import { CANVAS_TEMPLATE_KEY } from '@realtime-sdk/constants';
import { EntityMap } from '@realtime-sdk/models';
import { BaseDiagramPayload, BaseVersionPayload } from '@realtime-sdk/types';
import { BaseModels } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';

const canvasTemplateType = Utils.protocol.typeFactory(CANVAS_TEMPLATE_KEY);

export interface CreateCanvasTemplatePayload extends BaseVersionPayload {
  canvasTemplate: BaseModels.Version.CanvasTemplate;
}

export interface SnapshotPayload extends BaseDiagramPayload, EntityMap {}

export interface PatchCanvasTemplatePayload extends Partial<Omit<BaseModels.Version.CanvasTemplate, 'id'>> {}

export const crud = createCRUDActions<BaseModels.Version.CanvasTemplate, BaseVersionPayload, PatchCanvasTemplatePayload>(canvasTemplateType);

export const create = Utils.protocol.createAsyncAction<CreateCanvasTemplatePayload, BaseModels.Version.CanvasTemplate>(canvasTemplateType('CREATE'));

export const patch = Utils.protocol.createAsyncAction<PatchCanvasTemplatePayload, BaseModels.Version.CanvasTemplate>(canvasTemplateType('PATCH'));

export const initialize = Utils.protocol.createAction<SnapshotPayload>(canvasTemplateType('INITIALIZE'));

export const reset = Utils.protocol.createAction(canvasTemplateType('RESET'));
