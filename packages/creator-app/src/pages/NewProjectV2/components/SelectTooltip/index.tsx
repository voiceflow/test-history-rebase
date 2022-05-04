import { TippyTooltip, TippyTooltipProps } from '@voiceflow/ui';
import React from 'react';

interface ChannelSelectProps {
  header: string;
  body: string;
}

const SelectTooltip: React.FC<ChannelSelectProps> = ({ header, body }) => (
  <>
    <TippyTooltip.Multiline width={200}>
      <TippyTooltip.Title>{header}</TippyTooltip.Title>
      {body}
    </TippyTooltip.Multiline>
  </>
);

const getSelectTooltip = (header: string, body: string): TippyTooltipProps => ({
  html: <SelectTooltip header={header} body={body} />,
  style: { display: 'block' },
  position: 'right',
  bodyOverflow: true,
});

export default getSelectTooltip;
