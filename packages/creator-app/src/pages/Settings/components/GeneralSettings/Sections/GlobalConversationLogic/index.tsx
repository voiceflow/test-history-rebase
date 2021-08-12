import { Voice as AlexaVoice } from '@voiceflow/alexa-types';
import { Voice as GeneralVoice } from '@voiceflow/general-types';
import { Voice as GoogleVoice } from '@voiceflow/google-types';
import { PlatformType } from '@voiceflow/internal';
import { Select } from '@voiceflow/ui';
import React from 'react';

import Section, { SectionVariant } from '@/components/Section';
import * as Version from '@/ducks/version';
import { connect } from '@/hocs';
import { PlatformSettingsMetaProps } from '@/pages/Settings/constants';
import { ConnectedProps, MergeArguments } from '@/types';
import { getPlatformDefaultVoice, getPlatformValue } from '@/utils/platform';

import { AssistantConversationLogic } from './components';

interface GlobalConversationLogicProps {
  platform: PlatformType;
  platformMeta: PlatformSettingsMetaProps;
}

const GlobalConversationLogic: React.FC<ConnectedGlobalConversationLogic & GlobalConversationLogicProps> = ({
  platform,
  platformMeta,
  defaultVoice,
  platformDefaultVoice,
  saveDefaultVoice,
}) => {
  const { descriptors } = platformMeta;

  const platformVoices = React.useMemo(() => {
    const voices = getPlatformValue<string[]>(
      platform,
      {
        [PlatformType.ALEXA]: Object.values(AlexaVoice),
        [PlatformType.GOOGLE]: Object.values(GoogleVoice),
      },
      Object.values(GeneralVoice)
    );
    return voices.filter((voice) => voice !== 'audio');
  }, [platform]);

  const assistantLogic = (
    <AssistantConversationLogic
      platform={platform}
      platformMeta={platformMeta}
      defaultVoice={defaultVoice}
      platformDefaultVoice={platformDefaultVoice}
    />
  );

  return (
    <>
      <Section
        header="Default Voice"
        variant={SectionVariant.QUATERNARY}
        dividers={false}
        contentSuffix={descriptors.defaultVoice}
        customContentStyling={{ paddingBottom: '24px' }}
      >
        <Select value={defaultVoice} options={platformVoices} onSelect={saveDefaultVoice} searchable placeholder={defaultVoice} />
      </Section>

      {getPlatformValue(
        platform,
        {
          [PlatformType.ALEXA]: assistantLogic,
          [PlatformType.GOOGLE]: assistantLogic,
        },
        <></>
      )}
    </>
  );
};

const mapStateToProps = {
  defaultVoice: Version.activeDefaultVoiceSelector,
};

const mapDispatchToProps = {
  saveDefaultVoice: Version.saveDefaultVoice,
};

const mergeProps = (
  ...[{ defaultVoice }, , { platform }]: MergeArguments<typeof mapStateToProps, typeof mapDispatchToProps, GlobalConversationLogicProps>
) => {
  const platformDefaultVoice = getPlatformDefaultVoice(platform);

  return {
    platformDefaultVoice,
    defaultVoice: defaultVoice || platformDefaultVoice,
  };
};

type ConnectedGlobalConversationLogic = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps, typeof mergeProps>;

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(GlobalConversationLogic);
