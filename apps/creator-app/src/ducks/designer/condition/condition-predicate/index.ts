import { Actions } from '@voiceflow/sdk-logux-designer';

export * as effect from './condition-predicate.effect';
export { conditionPredicateReducer as reducer } from './condition-predicate.reducer';
export * from './condition-predicate.state';

export const action = Actions.ConditionPredicate;
