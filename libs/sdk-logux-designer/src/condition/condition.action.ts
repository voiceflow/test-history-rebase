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

import type { AnyCondition, ExpressionCondition, PromptCondition, ScriptCondition } from './condition.interface';
import { ConditionType } from './condition-type.enum';

const conditionAction = createCRUD('condition');

interface BaseCreateRequest {
  assistantID: string;
}

interface PatchExpressionData {
  matchAll?: boolean;
}

interface PatchPromptData {
  turns?: number;
  promptID?: string | null;
}

interface PatchScriptData {
  code?: Markup;
}

/**
 * user-sent events
 */

/* CreateExpression */

export namespace CreateExpression {
  export interface Request extends BaseCreateRequest {
    matchAll: boolean;
  }

  export interface Response extends CreateResponse<ExpressionCondition> {}
}

export const CreateExpression = conditionAction.crud.createOne<CreateExpression.Request, CreateExpression.Response>(
  ConditionType.EXPRESSION
);

/* CreatePrompt */

export namespace CreatePrompt {
  export interface Request extends BaseCreateRequest {
    turns: number;
    promptID: string | null;
  }

  export interface Response extends CreateResponse<PromptCondition> {}
}

export const CreatePrompt = conditionAction.crud.createOne<CreatePrompt.Request, CreatePrompt.Response>(
  ConditionType.PROMPT
);

/* CreateScript */

export namespace CreateScript {
  export interface Request extends BaseCreateRequest {
    code: Markup;
  }

  export interface Response extends CreateResponse<ScriptCondition> {}
}

export const CreateScript = conditionAction.crud.createOne<CreateScript.Request, CreateScript.Response>();

/* PatchOneExpression */

export interface PatchOneExpression extends PatchOneRequest<PatchExpressionData> {}

export const PatchOneExpression = conditionAction.crud.patchOne<PatchOneExpression>(ConditionType.EXPRESSION);

/* PatchOnePrompt */

export interface PatchOnePrompt extends PatchOneRequest<PatchPromptData> {}

export const PatchOnePrompt = conditionAction.crud.patchOne<PatchOnePrompt>(ConditionType.PROMPT);

/* PatchOneScript */

export interface PatchOneScript extends PatchOneRequest<PatchScriptData> {}

export const PatchOneScript = conditionAction.crud.patchOne<PatchOneScript>(ConditionType.SCRIPT);

/* PatchManyExpression */

export interface PatchManyExpression extends PatchManyRequest<PatchExpressionData> {}

export const PatchManyExpression = conditionAction.crud.patchMany<PatchManyExpression>(ConditionType.EXPRESSION);

/* PatchManyPrompt */

export interface PatchManyPrompt extends PatchManyRequest<PatchPromptData> {}

export const PatchManyPrompt = conditionAction.crud.patchMany<PatchManyPrompt>(ConditionType.PROMPT);

/* PatchManyScript */

export interface PatchManyScript extends PatchManyRequest<PatchScriptData> {}

export const PatchManyScript = conditionAction.crud.patchMany<PatchManyScript>(ConditionType.SCRIPT);

/* DeleteOne */

export interface DeleteOne extends DeleteOneRequest {}

export const DeleteOne = conditionAction.crud.deleteOne<DeleteOne>();

/* DeleteMany */

export interface DeleteMany extends DeleteManyRequest {}

export const DeleteMany = conditionAction.crud.deleteMany<DeleteMany>();

/**
 * system-sent events
 */

/* Replace */

export interface Replace extends ReplaceRequest<AnyCondition> {}

export const Replace = conditionAction.crud.replace<Replace>();

/**
 * universal events
 */

/* Add */

export interface Add extends AddOneRequest<AnyCondition> {}

export const Add = conditionAction.crud.addOne<Add>();
