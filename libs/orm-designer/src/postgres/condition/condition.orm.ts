/* eslint-disable max-classes-per-file */

import { PostgresCMSObjectORM, PostgresCMSObjectUnionORM } from '../common';
import {
  BaseConditionEntity,
  ExpressionConditionEntity,
  PromptConditionEntity,
  ScriptConditionEntity,
} from './condition.entity';

export class PromptConditionORM extends PostgresCMSObjectORM(PromptConditionEntity) {}

export class ScriptConditionORM extends PostgresCMSObjectORM(ScriptConditionEntity) {}

export class ExpressionConditionORM extends PostgresCMSObjectORM(ExpressionConditionEntity) {}

export class ConditionORM extends PostgresCMSObjectUnionORM(
  BaseConditionEntity,
  PromptConditionEntity,
  ScriptConditionEntity,
  ExpressionConditionEntity
) {}
