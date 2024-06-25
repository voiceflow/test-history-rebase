import { BaseButton } from '@voiceflow/base-types';
import { PlanType } from '@voiceflow/internal';
import * as Platform from '@voiceflow/platform-config';
import React, { createContext } from 'react';

import { PrototypeLayout } from '@/constants/prototype';
import type * as PrototypeDuck from '@/ducks/prototype';

type PrototypeSettings = PrototypeDuck.PrototypeSettings & { globalMessageDelayMilliseconds?: number };

export const SettingsContext = createContext<PrototypeSettings>({
  plan: PlanType.STARTER,
  layout: PrototypeLayout.TEXT_DIALOG,
  buttons: BaseButton.ButtonsLayout.STACKED,
  locales: [],
  platform: Platform.Constants.PlatformType.VOICEFLOW,
  projectType: Platform.Constants.ProjectType.VOICE,
  hasPassword: false,
  projectName: '',
  globalMessageDelayMilliseconds: 0,
  buttonsOnly: false,
  variableStates: [],
});

interface SettingsProviderProps extends React.PropsWithChildren {
  settings: PrototypeSettings;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children, settings }) => {
  return <SettingsContext.Provider value={settings}>{children}</SettingsContext.Provider>;
};
