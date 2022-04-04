import * as Realtime from '@voiceflow/realtime-sdk';
import { Icon, useSetup } from '@voiceflow/ui';
import React from 'react';

import SSML from '@/components/SSML';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Version from '@/ducks/version';
import * as VersionV2 from '@/ducks/versionV2';
import { connect } from '@/hocs';
import { ConnectedProps } from '@/types';
import { getPlatformDefaultVoice } from '@/utils/platform';

import { isSlotsInRepromptValid } from './utils';

/**
 * A component that implements a text input for SSML strings and customization of the voice
 * that will speak the SSML string. Similar to SSMLWithSlots, but cannot create arbitrary
 * variables, only reference existing Slots.
 */

interface onBlurParameters {
  text: string;
  pluginsData: object;
}

interface SSMLWithSlotsProps {
  // SSML props
  icon?: Icon | null;
  value: string; // the actual SSML text content
  onBlur: (data: onBlurParameters) => void; // executed if input gets unfocused
  onChangeVoice: (newVoice: string) => void; // executed if a new 'voice' vlaue is chosen
  placeholder: string; // text that is displayed in an empty input
  autofocus?: boolean;
  // SSMLWithVars-specific props, from component attributes
  voice: string; // the choice of who voices the ssmlText
  slots: Realtime.Slot[]; // data for slot variables in the SSML text content
}

export const SSMLWithSlots: React.FC<SSMLWithSlotsProps & SSMLWithSlotsConnectedProps> = ({
  voice,
  slots,
  locales,
  defaultVoice,
  platform,
  projectType,
  autofocus,
  updateDefaultVoice,
  ...props
}) => {
  const platformDefaultVoice = getPlatformDefaultVoice(platform);
  const promptRef = React.useRef<{ forceFocusToTheEnd: VoidFunction } | null>(null);

  useSetup(() => {
    if (autofocus) {
      promptRef.current?.forceFocusToTheEnd();
    }
  }, []);

  return (
    <SSML
      variables={slots}
      voice={voice || defaultVoice || platformDefaultVoice}
      defaultVoice={defaultVoice || platformDefaultVoice}
      platformDefaultVoice={platformDefaultVoice}
      locales={locales}
      platform={platform}
      projectType={projectType}
      space
      ref={promptRef}
      creatable={false}
      onChangeDefaultVoice={updateDefaultVoice}
      withVariablesPlugin={isSlotsInRepromptValid(platform)}
      {...props}
    />
  );
};

const mapStateToProps = {
  platform: ProjectV2.active.platformSelector,
  projectType: ProjectV2.active.projectTypeSelector,
  defaultVoice: VersionV2.active.defaultVoiceSelector,
  locales: VersionV2.active.localesSelector,
};

const mapDispatchToProps = {
  updateDefaultVoice: Version.updateDefaultVoice,
};

type SSMLWithSlotsConnectedProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps, null)(SSMLWithSlots) as React.FC<SSMLWithSlotsProps>;
