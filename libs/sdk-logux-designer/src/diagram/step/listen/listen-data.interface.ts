import type { Markup } from '@/common';

import type { ListenType } from './listen-type.enum';

export interface BaseListenData {
  noReply: {
    limit: number;
    repromptID: string | null;
    showPort: boolean;
  } | null;

  listenForTriggers: boolean;
}

export interface RepromptRule {
  id: string;
  value: Markup;
}

export interface ExitScenario {
  id: string;
  value: Markup;
}

export interface AutomaticReprompt {
  automaticReprompt: {
    personaOverrideID: string | null;
    rules: RepromptRule[];
    exitScenarios: ExitScenario[];
    showExitPort: boolean;
  } | null;
}

export interface NoMatch {
  noMatch: {
    repromptID: string | null;
    showPort: boolean;
  } | null;
}

/* listen for button */

export interface ButtonListenItem {
  id: string;
  label: Markup;
}

export interface ButtonListenData extends BaseListenData, AutomaticReprompt, NoMatch {
  type: ListenType.BUTTON;
  buttons: ButtonListenItem[];
}

/* listen for intent */

export interface IntentListenItem {
  id: string;
  intentID: string | null;
  button: Markup | null;
}

export interface IntentListenData extends BaseListenData, AutomaticReprompt, NoMatch {}

/* listen for entity */

export interface EntityListenItem {
  id: string;
  entityID: string | null;
  variableID: string | null;
  repromptID: string | null;
  isRequired: boolean;
  inlineInput: { placeholder: Markup } | null;
}

export interface EntityListenData extends BaseListenData, AutomaticReprompt, NoMatch {
  type: ListenType.ENTITY;
  entities: EntityListenItem[];
}

/* listen for raw */

export interface RawListenData extends BaseListenData {
  type: ListenType.RAW;
  variableID: string;
}
