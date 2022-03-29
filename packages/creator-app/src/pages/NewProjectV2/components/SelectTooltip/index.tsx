import { BoxFlexAlignStart, Text } from '@voiceflow/ui';
import React from 'react';

interface ChannelSelectProps {
  header: string;
  body: string;
}

const SelectTooltip: React.FC<ChannelSelectProps> = ({ header, body }) => {
  return (
    <BoxFlexAlignStart column>
      <Text pb="8px" textAlign="start" color="rgba(255, 255, 255, 0.6);">
        {header}
      </Text>
      <Text textAlign="start">{body}</Text>
    </BoxFlexAlignStart>
  );
};

const getSelectTooltip = (header: string, body: string): React.ReactNode => {
  return <SelectTooltip header={header} body={body} />;
};

export default getSelectTooltip;
