import React from 'react';

import SSML from '@/components/SSML';
import * as Project from '@/ducks/project';
import * as Version from '@/ducks/version';
import { connect } from '@/hocs';
import { Slot } from '@/models';
import { ConnectedProps } from '@/types';
import { getPlatformDefaultVoice } from '@/utils/platform';

import { isSlotsInRepromptValid } from './utils';

/**
 * A component that implements a text input for SSML strings and customization of the voice
 * that will speak the SSML string. Similar to SSMLWithSlots, but cannot create arbitrary
 * variables, only reference existing Slots.
 */

type onBlurParameters = { newValue: string; pluginsData: object };

interface SSMLWithSlotsProps {
  // SSML props
  value: string; // the actual SSML text content
  onBlur: (data: onBlurParameters) => void; // executed if input gets unfocused
  onChangeVoice: (newVoice: string) => void; // executed if a new 'voice' vlaue is chosen
  placeholder: string; // text that is displayed in an empty input

  // SSMLWithVars-specific props, from component attributes
  voice: string; // the choice of who voices the ssmlText
  slots: Slot[]; // data for slot variables in the SSML text content
}

export const SSMLWithSlots: React.FC<SSMLWithSlotsProps & SSMLWithSlotsConnectedProps> = ({
  voice,
  slots,
  locales,
  defaultVoice,
  platform,
  saveDefaultVoice,
  ...props
}) => {
  const platformDefaultVoice = getPlatformDefaultVoice(platform);

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
      onChangeDefaultVoice={saveDefaultVoice}
      withVariablesPlugin={isSlotsInRepromptValid(platform)}
      {...props}
    />
  );
};

const mapStateToProps = {
  platform: Project.activePlatformSelector,
  defaultVoice: Version.activeDefaultVoiceSelector,
  locales: Version.activeLocalesSelector,
};

const mapDispatchToProps = {
  saveDefaultVoice: Version.saveDefaultVoice,
};

type SSMLWithSlotsConnectedProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps, null)(SSMLWithSlots) as React.FC<SSMLWithSlotsProps>;
