import React from 'react';

import SSML from '@/components/SSML';
import { PlatformType } from '@/constants';
import * as Skill from '@/ducks/skill';
import { connect } from '@/hocs';
import { Slot } from '@/models';
import { getPlatformDefaultVoice } from '@/utils/platform';

import { isSlotsInRepromptValid } from './utils';

/**
 * A component that implements a text input for SSML strings and customization of the voice
 * that will speak the SSML string. Similar to SSMLWithSlots, but cannot create arbitrary
 * variables, only reference existing Slots.
 */

type onBlurParameters = { newValue: string; pluginsData: object };

type SSMLWithSlotsProps = {
  // SSML props
  value: string; // the actual SSML text content
  onBlur: (data: onBlurParameters) => void; // executed if input gets unfocused
  onChangeVoice: (newVoice: string) => void; // executed if a new 'voice' vlaue is chosen
  placeholder: string; // text that is displayed in an empty input

  // SSMLWithVars-specific props, from component attributes
  voice: string; // the choice of who voices the ssmlText
  slots: Slot[]; // data for slot variables in the SSML text content

  // SSMLWithVars-specific props, from Redux connect
  locales: string;
  defaultVoice: string;
  platform: PlatformType;
  saveSettings: any;
  updateSettings: any;
};

export const SSMLWithSlots: React.FC<SSMLWithSlotsProps> = ({
  voice,
  slots,
  locales,
  defaultVoice,
  platform,
  updateSettings,
  saveSettings,
  ...props
}) => {
  const platformDefaultVoice = getPlatformDefaultVoice(platform);

  const onChangeDefaultVoice = React.useCallback((value) => {
    updateSettings({ defaultVoice: value });
    saveSettings({ settings: { defaultVoice: value } }, ['defaultVoice']);
  }, []);

  return (
    <SSML
      variables={slots}
      voice={voice || defaultVoice || platformDefaultVoice}
      defaultVoice={defaultVoice || platformDefaultVoice}
      platformDefaultVoice={platformDefaultVoice}
      locales={locales}
      platform={platform}
      space
      creatable={false}
      onChangeDefaultVoice={onChangeDefaultVoice}
      withVariablesPlugin={isSlotsInRepromptValid(platform)}
      {...props}
    />
  );
};

const mapStateToProps = {
  platform: Skill.activePlatformSelector,
  defaultVoice: Skill.defaultVoiceSelector,
  locales: Skill.activeLocalesSelector,
};

const mapDispatchToProps = {
  saveSettings: Skill.saveSettings,
  updateSettings: Skill.updateSettings,
};

export default connect(mapStateToProps, mapDispatchToProps, null)(SSMLWithSlots);
