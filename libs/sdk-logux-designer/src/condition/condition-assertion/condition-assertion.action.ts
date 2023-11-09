import type { ConditionAssertion, ConditionOperation, Markup } from '@voiceflow/dtos';

import { createCRUD } from '@/crud/crud.action';
import type {
  AddOneRequest,
  CreateResponse,
  DeleteManyRequest,
  DeleteOneRequest,
  PatchManyRequest,
  PatchOneRequest,
  ReplaceRequest,
} from '@/crud/crud.interface';

const conditionAssertionAction = createCRUD('condition_assertion');

export interface PatchData {
  operation?: ConditionOperation;
  lhs?: Markup;
  rhs?: Markup;
}

/**
 * user-sent events
 */

/* Create */

export namespace Create {
  export interface Request {
    operation: ConditionOperation;
    lhs: Markup;
    rhs: Markup;
    conditionID: string;
    assistantID: string;
  }

  export interface Response extends CreateResponse<ConditionAssertion> {}
}

export const Create = conditionAssertionAction.crud.createOne<Create.Request, Create.Response>();

/* PatchOne */

export interface PatchOne extends PatchOneRequest<PatchData> {}

export const PatchOne = conditionAssertionAction.crud.patchOne<PatchOne>();

/* PatchMany */

export interface PatchMany extends PatchManyRequest<PatchData> {}

export const PatchMany = conditionAssertionAction.crud.patchMany<PatchMany>();

/* DeleteOne */

export interface DeleteOne extends DeleteOneRequest {}

export const DeleteOne = conditionAssertionAction.crud.deleteOne<DeleteOne>();

/* DeleteMany */

export interface DeleteMany extends DeleteManyRequest {}

export const DeleteMany = conditionAssertionAction.crud.deleteMany<DeleteMany>();

/**
 * system-sent events
 */

/* Replace */

export interface Replace extends ReplaceRequest<ConditionAssertion> {}

export const Replace = conditionAssertionAction.crud.replace<Replace>();

/**
 * universal events
 */

/* Add */

export interface Add extends AddOneRequest<ConditionAssertion> {}

export const Add = conditionAssertionAction.crud.addOne<Add>();
