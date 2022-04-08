import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import React from 'react';

import Section, { SectionVariant } from '@/components/Section';
import { useHover } from '@/hooks';

import { NLUSectionErrorMessage } from '../../constants';
import NLUSectionHeader from '../NLUSectionHeader';
import { NLUSelect } from '../Select';
import { SectionErrorMessage } from './components';

interface NLUSectionProps {
  nluValue: VoiceflowConstants.PlatformType | undefined;
  onNluSelect: (value: VoiceflowConstants.PlatformType) => void;
  nluError: boolean;
}

const NLUSection: React.FC<NLUSectionProps> = ({ nluValue, onNluSelect, nluError }) => {
  const [isHovered, , hoverHandlers] = useHover();

  return (
    <Section
      {...hoverHandlers}
      header={<NLUSectionHeader showInfoIcon={isHovered} />}
      variant={SectionVariant.FORM}
      dividers={false}
      customHeaderStyling={{ paddingTop: '24px' }}
      customContentStyling={{ paddingBottom: '0px' }}
    >
      <NLUSelect value={nluValue} onSelect={onNluSelect} error={nluError} />
      {nluError && <SectionErrorMessage>{NLUSectionErrorMessage}</SectionErrorMessage>}
    </Section>
  );
};

export default NLUSection;
