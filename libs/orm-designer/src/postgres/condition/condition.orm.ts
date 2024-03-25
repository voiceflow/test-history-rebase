/* eslint-disable max-classes-per-file */

import { PostgresCMSObjectORM } from '../common';
import {
  BaseConditionEntity,
  ExpressionConditionEntity,
  PromptConditionEntity,
  ScriptConditionEntity,
} from './condition.entity';
import type { AnyConditionEntity } from './condition.interface';
import {
  BaseConditionEntityAdapter,
  ExpressionConditionEntityAdapter,
  PromptConditionEntityAdapter,
  ScriptConditionEntityAdapter,
} from './condition-json.adapter';

export class PromptConditionORM extends PostgresCMSObjectORM<PromptConditionEntity> {
  Entity = PromptConditionEntity;

  jsonAdapter = PromptConditionEntityAdapter;
}

export class ScriptConditionORM extends PostgresCMSObjectORM<ScriptConditionEntity> {
  Entity = ScriptConditionEntity;

  jsonAdapter = ScriptConditionEntityAdapter;
}

export class ExpressionConditionORM extends PostgresCMSObjectORM<ExpressionConditionEntity> {
  Entity = ExpressionConditionEntity;

  jsonAdapter = ExpressionConditionEntityAdapter;
}

export class AnyConditionORM extends PostgresCMSObjectORM<BaseConditionEntity, AnyConditionEntity> {
  Entity = BaseConditionEntity;

  jsonAdapter = BaseConditionEntityAdapter;

  protected discriminators = [
    { Entity: PromptConditionEntity, jsonAdapter: ScriptConditionEntityAdapter },
    { Entity: ScriptConditionEntity, jsonAdapter: ScriptConditionEntityAdapter },
    { Entity: ExpressionConditionEntity, jsonAdapter: ExpressionConditionEntityAdapter },
  ];
}
