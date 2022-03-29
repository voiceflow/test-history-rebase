import { AlexaConstants } from '@voiceflow/alexa-types';
import { Nullish } from '@voiceflow/common';
import { DFESConstants } from '@voiceflow/google-dfes-types';
import { GoogleConstants } from '@voiceflow/google-types';
import { Icon, UIOnlyMenuItemOption } from '@voiceflow/ui';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import React from 'react';

export enum PlatformTypeUpcoming {
  WHATSAPP = 'whatsapp',
  FB_MESSENGER = 'fb_messenger',
  TWILIO_IVR = 'twilio_ivr',
  TWILIO_SMS = 'twilio_SMS',
  IBM_WATSON = 'ibm_watson',
  MICROSOFT_LUIS = 'microsoft_luis',
  RASA = 'rasa',
  SALESFORCE_EINSTEIN = 'salesforce_einstein',
  DIALOGFLOW_CX = 'dialogflow_cx',
  NUANCE_MIX = 'nuance_mix',
}

export interface PlatformAndProjectTypeMeta {
  name: string;
  tooltip?: React.ReactNode;
  invocationDescription?: string;
  localesText?: string;
  disabled: boolean;
  type?: VoiceflowConstants.PlatformType | VoiceflowConstants.ProjectType | PlatformTypeUpcoming;
  languageSelectProps?: LanguageSelectProps;
  icon?: Icon;
}

export type AnyLanguage = GoogleConstants.Language | DFESConstants.Language | VoiceflowConstants.Locale;
export type AnyLocale = AlexaConstants.Locale;

export interface LanguageSelectOption {
  value: AnyLanguage;
  name: string;
}

export interface LanguageSelectProps {
  options: (LanguageSelectOption | UIOnlyMenuItemOption)[];
  placeholder: string;
  getOptionKey: (option: LanguageSelectOption) => string;
  getOptionValue: (option: Nullish<LanguageSelectOption>) => string | VoiceflowConstants.Locale;
  getOptionLabel: (value: Nullish<string>) => string;
  renderOptionLabel: (option: LanguageSelectOption) => string;
}

export interface Section {
  label: string;
  options: (PlatformAndProjectTypeMeta | undefined)[];
}
