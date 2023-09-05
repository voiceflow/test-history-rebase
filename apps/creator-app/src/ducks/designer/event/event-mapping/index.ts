import { Actions } from '@voiceflow/sdk-logux-designer';

export * as effect from './event-mapping.effect';
export { eventMappingReducer as reducer } from './event-mapping.reducer';
export * from './event-mapping.state';

export const action = Actions.EventMapping;
