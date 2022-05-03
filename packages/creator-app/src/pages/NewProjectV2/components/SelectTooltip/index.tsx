import { BoxFlexAlignStart, Text, TippyTooltipProps } from '@voiceflow/ui';
import React from 'react';

interface ChannelSelectProps {
  header: string;
  body: string;
}

const SelectTooltip: React.FC<ChannelSelectProps> = ({ header, body }) => (
  <BoxFlexAlignStart width={200} column py="4px">
    <Text pb="4px" fontWeight={600} textAlign="start" color="#C0C5C6">
      {header}
    </Text>

    <Text textAlign="start" color="#F2F7F7">
      {body}
    </Text>
  </BoxFlexAlignStart>
);

const getSelectTooltip = (header: string, body: string): TippyTooltipProps => ({
  html: <SelectTooltip header={header} body={body} />,
  offset: -30,
  position: 'right-end',
  distance: -390,
});

export default getSelectTooltip;
