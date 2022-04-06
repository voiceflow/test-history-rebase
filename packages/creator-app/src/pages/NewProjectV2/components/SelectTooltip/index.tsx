import { BoxFlexAlignStart, Text, TippyTooltipProps } from '@voiceflow/ui';
import React from 'react';

interface ChannelSelectProps {
  header: string;
  body: string;
}

const SelectTooltip: React.FC<ChannelSelectProps> = ({ header, body }) => (
  <BoxFlexAlignStart width={200} column>
    <Text pb="8px" textAlign="start" color="rgba(255, 255, 255, 0.6);">
      {header}
    </Text>

    <Text textAlign="start">{body}</Text>
  </BoxFlexAlignStart>
);

const getSelectTooltip = (header: string, body: string): TippyTooltipProps => ({
  html: <SelectTooltip header={header} body={body} />,
  offset: -30,
  position: 'right-end',
  distance: -390,
});

export default getSelectTooltip;
