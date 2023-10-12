import type { Markup } from '@/common';
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

import type { ConditionOperation } from '../condition-operation.enum';
import type { ConditionPredicate } from './condition-predicate.interface';

const conditionPredicateAction = createCRUD('condition_predicate');

export interface PatchData {
  operation?: ConditionOperation;
  rhs?: Markup;
}

/**
 * user-sent events
 */

/* Create */

export namespace Create {
  export interface Request {
    operation: ConditionOperation;
    rhs: Markup;
    conditionID: string;
    assistantID: string;
  }

  export interface Response extends CreateResponse<ConditionPredicate> {}
}

export const Create = conditionPredicateAction.crud.createOne<Create.Request, Create.Response>();

/* PatchOne */

export interface PatchOne extends PatchOneRequest<PatchData> {}

export const PatchOne = conditionPredicateAction.crud.patchOne<PatchOne>();

/* PatchMany */

export interface PatchMany extends PatchManyRequest<PatchData> {}

export const PatchMany = conditionPredicateAction.crud.patchMany<PatchMany>();

/* DeleteOne */

export interface DeleteOne extends DeleteOneRequest {}

export const DeleteOne = conditionPredicateAction.crud.deleteOne<DeleteOne>();

/* DeleteMany */

export interface DeleteMany extends DeleteManyRequest {}

export const DeleteMany = conditionPredicateAction.crud.deleteMany<DeleteMany>();

/**
 * system-sent events
 */

/* Replace */

export interface Replace extends ReplaceRequest<ConditionPredicate> {}

export const Replace = conditionPredicateAction.crud.replace<Replace>();

/**
 * universal events
 */

/* Add */

export interface Add extends AddOneRequest<ConditionPredicate> {}

export const Add = conditionPredicateAction.crud.addOne<Add>();
