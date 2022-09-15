import * as Realtime from '@voiceflow/realtime-sdk';
import { BoxFlex, Input, SectionV2, Text, ThemeColor, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import { NUMBERS_ONLY_REGEXP } from '@/constants';
import { useLinkedState } from '@/hooks';
import EditorV2 from '@/pages/Canvas/components/EditorV2';
import { withInputBlur } from '@/utils/dom';
import { getDefaultNoReplyTimeoutSeconds } from '@/utils/noReply';

interface TimeoutSectionProps {
  timeout?: number;
  onChange: (timeout: number) => void;
}

const TimeoutSection: React.FC<TimeoutSectionProps> = ({ timeout: propTimeout, onChange: onChangeProp }) => {
  const editor = EditorV2.useEditor();

  const [timeout, setTimeout] = useLinkedState(String(propTimeout || getDefaultNoReplyTimeoutSeconds(editor.platform)));

  const isVoiceflow = Realtime.Utils.typeGuards.isVoiceflowBasedPlatform(editor.platform);

  const onChange = (value: string) => {
    if (value !== '' && (!value.match(NUMBERS_ONLY_REGEXP) || value.length > 2)) {
      return;
    }

    setTimeout(value);
  };

  return (
    <SectionV2.SimpleSection isAccent>
      <BoxFlex>
        <TippyTooltip
          title={`This value is not editable as it's defined by ${Realtime.Utils.platform.getPlatformProviderName(editor.platform)}`}
          disabled={isVoiceflow}
        >
          <BoxFlex width={52}>
            <Input
              value={timeout}
              cursor={isVoiceflow ? 'auto' : 'not-allowed'}
              onBlur={() => onChangeProp(Number(timeout))}
              disabled={!isVoiceflow}
              placeholder="10"
              onEnterPress={withInputBlur()}
              onChangeText={onChange}
            />
          </BoxFlex>
        </TippyTooltip>

        <Text color={ThemeColor.SECONDARY} ml={16}>
          Seconds delay before no reply response
        </Text>
      </BoxFlex>
    </SectionV2.SimpleSection>
  );
};

export default TimeoutSection;
