import type { AnyRecord, Nullable } from '@voiceflow/common';

import type { Intent } from '../intent/intent.interface';
import type { Slot } from '../slot/slot.interface';

export interface PrototypeModel {
  slots: Slot[];
  intents: Intent[];
}

export interface PrototypeMessageDelay {
  durationMilliseconds: number;
}

export interface PrototypeData {
  name: string;
  locales: string[];
  messageDelay?: PrototypeMessageDelay;
}

export interface BaseCommand {
  type: string;
}

export interface PrototypeStackFrame {
  nodeID?: Nullable<string>;
  diagramID: string;

  storage?: AnyRecord;
  commands?: BaseCommand[];
  variables?: AnyRecord;
}

export interface PrototypeSettings {
  avatar?: string;
  layout?: string;
  buttons?: string;
  password?: string;
  brandColor?: string;
  brandImage?: string;
  hasPassword?: boolean;
  buttonsOnly?: boolean;
  variableStateID?: string;
}

export interface SurveyContext {
  slotsMap: Record<string, Slot>;
  extraSlots: Slot[];
  extraIntents: Intent[];
  usedIntentsSet: string[];
  platform: string;
}

export interface Prototype {
  type: string;
  data: PrototypeData;
  model: PrototypeModel;
  context: PrototypeContext;
  platform: string;
  settings: PrototypeSettings;
  surveyorContext: SurveyContext;
}

export interface PrototypeContext {
  turn?: AnyRecord;
  stack?: PrototypeStackFrame[];
  storage?: AnyRecord;
  variables?: AnyRecord;
}
