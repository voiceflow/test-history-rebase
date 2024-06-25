import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, Input, SectionV2, Text, ThemeColor, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import { NUMBERS_ONLY_REGEXP } from '@/constants';
import { useActiveProjectPlatformConfig, useLinkedState } from '@/hooks';
import { withInputBlur } from '@/utils/dom';
import { getDefaultNoReplyTimeoutSeconds } from '@/utils/noReply';

interface TimeoutSectionProps {
  timeout?: number;
  onChange: (timeout: number) => void;
}

const TimeoutSection: React.FC<TimeoutSectionProps> = ({ timeout: propTimeout, onChange: onChangeProp }) => {
  const platformConfig = useActiveProjectPlatformConfig();

  const isDelayEditable = Realtime.Utils.typeGuards.isPlatformWithEditableNoReplyDelay(platformConfig.type);
  const [timeout, setTimeout] = useLinkedState(
    String(isDelayEditable && propTimeout ? propTimeout : getDefaultNoReplyTimeoutSeconds(platformConfig.type))
  );

  const onChange = (value: string) => {
    if (value !== '' && (!value.match(NUMBERS_ONLY_REGEXP) || value.length > 2)) {
      return;
    }

    setTimeout(value);
  };

  return (
    <SectionV2.SimpleSection isAccent>
      <Box.Flex>
        <TippyTooltip
          content={`This value is not editable as it's defined by ${platformConfig.name}`}
          disabled={isDelayEditable}
        >
          <Box.Flex width={52}>
            <Input
              value={timeout}
              cursor={isDelayEditable ? 'auto' : 'not-allowed'}
              onBlur={() => onChangeProp(Number(timeout))}
              disabled={!isDelayEditable}
              placeholder="10"
              onEnterPress={withInputBlur()}
              onChangeText={onChange}
            />
          </Box.Flex>
        </TippyTooltip>

        <Text color={ThemeColor.SECONDARY} ml={16}>
          Seconds delay before no reply response
        </Text>
      </Box.Flex>
    </SectionV2.SimpleSection>
  );
};

export default TimeoutSection;
