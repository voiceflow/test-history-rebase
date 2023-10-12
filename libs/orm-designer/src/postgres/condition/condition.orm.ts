/* eslint-disable max-classes-per-file */

import { PostgresCMSMutableORM, PostgresCMSUnionORM } from '../common';
import {
  BaseConditionEntity,
  ExpressionConditionEntity,
  PromptConditionEntity,
  ScriptConditionEntity,
} from './condition.entity';

export class PromptConditionORM extends PostgresCMSMutableORM(PromptConditionEntity) {}

export class ScriptConditionORM extends PostgresCMSMutableORM(ScriptConditionEntity) {}

export class ExpressionConditionORM extends PostgresCMSMutableORM(ExpressionConditionEntity) {}

export class ConditionORM extends PostgresCMSUnionORM(
  BaseConditionEntity,
  PromptConditionEntity,
  ScriptConditionEntity,
  ExpressionConditionEntity
) {}
