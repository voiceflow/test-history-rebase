import * as Realtime from '@voiceflow/realtime-sdk';
import compositeReducer from 'composite-reducer';
import { reducerWithInitialState } from 'typescript-fsa-reducers';

import {
  Attachment,
  Condition,
  Entity,
  Event,
  Flow,
  Folder,
  Function,
  Intent,
  KnowledgeBase,
  Persona,
  Prompt,
  Response,
  Story,
  Thread,
  Variable,
} from './designer.modules';

const baseThreadReducer = reducerWithInitialState({}).case(Realtime.creator.reset, () => ({}));

export const designerReducer = compositeReducer(baseThreadReducer, {
  [Flow.STATE_KEY]: Flow.reducer,
  [Event.STATE_KEY]: Event.reducer,
  [Story.STATE_KEY]: Story.reducer,
  [Entity.STATE_KEY]: Entity.reducer,
  [Folder.STATE_KEY]: Folder.reducer,
  [Intent.STATE_KEY]: Intent.reducer,
  [Prompt.STATE_KEY]: Prompt.reducer,
  [Thread.STATE_KEY]: Thread.reducer,
  [Persona.STATE_KEY]: Persona.reducer,
  [Function.STATE_KEY]: Function.reducer,
  [Response.STATE_KEY]: Response.reducer,
  [Variable.STATE_KEY]: Variable.reducer,
  [Condition.STATE_KEY]: Condition.reducer,
  [Attachment.STATE_KEY]: Attachment.reducer,
  [KnowledgeBase.STATE_KEY]: KnowledgeBase.reducer,
});
