import { combineReducers } from 'redux';

import {
  Attachment,
  Condition,
  Diagram,
  Entity,
  Event,
  Flow,
  Folder,
  Function,
  Intent,
  Persona,
  Prompt,
  Response,
  Story,
  Variable,
} from './designer.modules';

export const designerReducer = combineReducers({
  [Flow.STATE_KEY]: Flow.reducer,
  [Event.STATE_KEY]: Event.reducer,
  [Story.STATE_KEY]: Story.reducer,
  [Entity.STATE_KEY]: Entity.reducer,
  [Folder.STATE_KEY]: Folder.reducer,
  [Intent.STATE_KEY]: Intent.reducer,
  [Prompt.STATE_KEY]: Prompt.reducer,
  [Diagram.STATE_KEY]: Diagram.reducer,
  [Persona.STATE_KEY]: Persona.reducer,
  [Function.STATE_KEY]: Function.reducer,
  [Response.STATE_KEY]: Response.reducer,
  [Variable.STATE_KEY]: Variable.reducer,
  [Condition.STATE_KEY]: Condition.reducer,
  [Attachment.STATE_KEY]: Attachment.reducer,
});
