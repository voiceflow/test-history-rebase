import React from 'react';

import Section from '@/components/Section';
import { Text } from '@/components/Text';

import InfoTooltip from './InfoTooltip';

export const chipFactory = () => [];

type ChipSectionProps = {
  pushToPath: (path: { type: string; label: string }) => void;
};

const ChipSection: React.FC<ChipSectionProps> = ({ pushToPath }) => {
  const openChips = React.useCallback(
    () =>
      pushToPath({
        type: 'chips',
        label: 'chips',
      }),
    [pushToPath]
  );

  return (
    <Section
      header={<Text fontWeight="normal">Chips</Text>}
      tooltip={<InfoTooltip />}
      tooltipProps={{ helpTitle: null, helpMessage: null }}
      status="Empty"
      isLink
      onClick={openChips}
    ></Section>
  );
};

export default ChipSection;
