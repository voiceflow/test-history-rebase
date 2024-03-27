import * as Realtime from '@voiceflow/realtime-sdk';
import compositeReducer from 'composite-reducer';
import { reducerWithInitialState } from 'typescript-fsa-reducers';

import {
  Attachment,
  Condition,
  Entity,
  Environment,
  Event,
  Flow,
  Folder,
  Function,
  Intent,
  KnowledgeBase,
  Persona,
  Prompt,
  Response,
  Thread,
  Variable,
  Workflow,
} from './designer.modules';

const baseThreadReducer = reducerWithInitialState({}).case(Realtime.creator.reset, () => ({}));

export const designerReducer = compositeReducer(baseThreadReducer, {
  [Flow.STATE_KEY]: Flow.reducer,
  [Event.STATE_KEY]: Event.reducer,
  [Entity.STATE_KEY]: Entity.reducer,
  [Folder.STATE_KEY]: Folder.reducer,
  [Intent.STATE_KEY]: Intent.reducer,
  [Prompt.STATE_KEY]: Prompt.reducer,
  [Thread.STATE_KEY]: Thread.reducer,
  [Persona.STATE_KEY]: Persona.reducer,
  [Workflow.STATE_KEY]: Workflow.reducer,
  [Function.STATE_KEY]: Function.reducer,
  [Response.STATE_KEY]: Response.reducer,
  [Variable.STATE_KEY]: Variable.reducer,
  [Condition.STATE_KEY]: Condition.reducer,
  [Attachment.STATE_KEY]: Attachment.reducer,
  [Environment.STATE_KEY]: Environment.reducer,
  [KnowledgeBase.STATE_KEY]: KnowledgeBase.reducer,
});
