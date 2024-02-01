import { Utils } from '@voiceflow/common';
import type {
  AnyResponseVariant,
  JSONResponseVariant,
  JSONResponseVariantCreate,
  JSONResponseVariantPatch,
  PromptResponseVariant,
  PromptResponseVariantCreate,
  PromptResponseVariantPatch,
  TextResponseVariant,
  TextResponseVariantCreate,
  TextResponseVariantPatch,
} from '@voiceflow/dtos';
import { ResponseVariantType } from '@voiceflow/dtos';

import { createCRUD } from '@/crud/crud.action';
import type {
  AddManyRequest,
  AddOneRequest,
  CreateResponse,
  DeleteManyRequest,
  DeleteOneRequest,
  PatchManyRequest,
  PatchOneRequest,
  ReplaceRequest,
} from '@/crud/crud.interface';
import type { DesignerAction, WithoutMeta } from '@/types';

const responseVariantAction = createCRUD('response_variant');

interface BaseCreateData {
  discriminatorID: string;
}

export interface CreateJSONData extends BaseCreateData, JSONResponseVariantCreate {}

export interface CreateTextData extends BaseCreateData, TextResponseVariantCreate {}

export type CreatePromptData = BaseCreateData & PromptResponseVariantCreate;

export interface PatchJSONData extends JSONResponseVariantPatch {}

export interface PatchPromptData extends PromptResponseVariantPatch {}

export interface PatchTextData extends TextResponseVariantPatch {}

export interface CreateOptions {
  /**
   * by default variants inserted at position 1 (assume that 0 is reserved for default variant), but in some cases (required entities)
   * we need to insert variant at the start of the list
   */
  discriminatorOrderInsertIndex?: number;
}

/**
 * user-sent events
 */

/* CreateJSONOne */

export namespace CreateJSONOne {
  export interface Request extends DesignerAction {
    data: CreateJSONData;
    options?: CreateOptions;
  }

  export interface Response extends CreateResponse<JSONResponseVariant>, DesignerAction {}
}

export const CreateJSONOne = responseVariantAction.crud.createOne<CreateJSONOne.Request, CreateJSONOne.Response>(
  ResponseVariantType.JSON
);

/* CreatePromptOne */

export namespace CreatePromptOne {
  export interface Request extends DesignerAction {
    data: CreatePromptData;
    options?: CreateOptions;
  }

  export interface Response extends CreateResponse<WithoutMeta<PromptResponseVariant>>, DesignerAction {}
}

export const CreatePromptOne = responseVariantAction.crud.createOne<CreatePromptOne.Request, CreatePromptOne.Response>(
  ResponseVariantType.PROMPT
);

/* CreateTextOne */

export namespace CreateTextOne {
  export interface Request extends DesignerAction {
    data: CreateTextData;
    options?: CreateOptions;
  }

  export interface Response extends CreateResponse<WithoutMeta<TextResponseVariant>>, DesignerAction {}
}

export const CreateTextOne = responseVariantAction.crud.createOne<CreateTextOne.Request, CreateTextOne.Response>(
  ResponseVariantType.TEXT
);

/* CreatePromptMany */

export namespace CreatePromptMany {
  export interface Request extends DesignerAction {
    data: CreatePromptData[];
    options?: CreateOptions;
  }

  export interface Response extends CreateResponse<WithoutMeta<PromptResponseVariant>[]>, DesignerAction {}
}

export const CreatePromptMany = responseVariantAction.crud.createMany<
  CreatePromptMany.Request,
  CreatePromptMany.Response
>(ResponseVariantType.PROMPT);

/* CreateTextMany */

export namespace CreateTextMany {
  export interface Request extends DesignerAction {
    data: CreateTextData[];
    options?: CreateOptions;
  }

  export interface Response extends CreateResponse<WithoutMeta<TextResponseVariant>[]>, DesignerAction {}
}

export const CreateTextMany = responseVariantAction.crud.createMany<CreateTextMany.Request, CreateTextMany.Response>(
  ResponseVariantType.TEXT
);

/* PatchOneJSON */

export interface PatchOneJSON extends PatchOneRequest<PatchJSONData>, DesignerAction {}

export const PatchOneJSON = responseVariantAction.crud.patchOne<PatchOneJSON>(ResponseVariantType.JSON);

/* PatchOnePrompt */

export interface PatchOnePrompt extends PatchOneRequest<PatchPromptData>, DesignerAction {}

export const PatchOnePrompt = responseVariantAction.crud.patchOne<PatchOnePrompt>(ResponseVariantType.PROMPT);

/* PatchOneText */

export interface PatchOneText extends PatchOneRequest<PatchTextData>, DesignerAction {}

export const PatchOneText = responseVariantAction.crud.patchOne<PatchOneText>(ResponseVariantType.TEXT);

/* PatchManyJSON */

export interface PatchManyJSON extends PatchManyRequest<PatchJSONData>, DesignerAction {}

export const PatchManyJSON = responseVariantAction.crud.patchMany<PatchManyJSON>(ResponseVariantType.JSON);

/* PatchManyPrompt */

export interface PatchManyPrompt extends PatchManyRequest<PatchPromptData>, DesignerAction {}

export const PatchManyPrompt = responseVariantAction.crud.patchMany<PatchManyPrompt>(ResponseVariantType.PROMPT);

/* PatchManyText */

export interface PatchManyText extends PatchManyRequest<PatchTextData>, DesignerAction {}

export const PatchManyText = responseVariantAction.crud.patchMany<PatchManyText>(ResponseVariantType.TEXT);

/* Replace */

export interface ReplaceWithType extends DesignerAction {
  id: string;
  type: ResponseVariantType;
}

export const ReplaceWithType = Utils.protocol.createAction<ReplaceWithType>(responseVariantAction('REPLACE_WITH_TYPE'));

/* PatchOne */

export interface PatchOne extends PatchOneRequest<PatchTextData | PatchPromptData | PatchJSONData>, DesignerAction {}

export const PatchOne = responseVariantAction.crud.patchOne<PatchOne>();

/* PatchMany */

export interface PatchMany extends PatchManyRequest<PatchTextData | PatchPromptData | PatchJSONData>, DesignerAction {}

/**
 * used for broadcast only
 */
export const PatchMany = responseVariantAction.crud.patchMany<PatchMany>();

/* DeleteOne */

export interface DeleteOne extends DeleteOneRequest, DesignerAction {}

export const DeleteOne = responseVariantAction.crud.deleteOne<DeleteOne>();

/* DeleteMany */

export interface DeleteMany extends DeleteManyRequest, DesignerAction {}

export const DeleteMany = responseVariantAction.crud.deleteMany<DeleteMany>();

/**
 * system-sent events
 */

/* Replace */

export interface Replace extends ReplaceRequest<AnyResponseVariant>, DesignerAction {}

export const Replace = responseVariantAction.crud.replace<Replace>();

/**
 * universal events
 */

/* AddOne */

export interface AddOne extends AddOneRequest<AnyResponseVariant>, DesignerAction {}

export const AddOne = responseVariantAction.crud.addOne<AddOne>();

/* AddMany */

export interface AddMany extends AddManyRequest<AnyResponseVariant>, DesignerAction {}

export const AddMany = responseVariantAction.crud.addMany<AddMany>();
