import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import React from 'react';

import Section, { SectionVariant } from '@/components/Section';
import { useHover } from '@/hooks';

import { getPlatformOrProjectTypeMeta, NLUSectionErrorMessage } from '../../constants';
import { ImportModel } from '../../types';
import ModelImport from '../ModelImport';
import NLUSectionHeader from '../NLUSectionHeader';
import { NLUSelect } from '../Select';
import { SectionErrorMessage } from './components';

interface NLUSectionProps {
  nluValue: VoiceflowConstants.PlatformType | undefined;
  onNluSelect: (value: VoiceflowConstants.PlatformType) => void;
  nluError: boolean;
  importModel?: ImportModel;
  onImportModel: (importModel: ImportModel) => void;
}

const NLUSection: React.FC<NLUSectionProps> = ({ nluValue, onNluSelect, nluError, onImportModel, importModel }) => {
  const [isImportLoading, setIsImportLoading] = React.useState<boolean>(false);

  const [isHovered, , hoverHandlers] = useHover();
  const hasImport = nluValue && getPlatformOrProjectTypeMeta[nluValue]?.importMeta;

  return (
    <Section
      {...hoverHandlers}
      header={<NLUSectionHeader showInfoIcon={isHovered} />}
      variant={SectionVariant.FORM}
      dividers={false}
      customHeaderStyling={{ paddingTop: '24px' }}
      customContentStyling={{ paddingBottom: '0px' }}
    >
      <NLUSelect value={nluValue} onSelect={onNluSelect} error={nluError} isImportLoading={isImportLoading} />
      {hasImport && (
        <ModelImport
          platform={nluValue}
          importModel={importModel}
          onImportModel={onImportModel}
          isImportLoading={isImportLoading}
          setIsImportLoading={setIsImportLoading}
        />
      )}
      {nluError && <SectionErrorMessage>{NLUSectionErrorMessage}</SectionErrorMessage>}
    </Section>
  );
};

export default NLUSection;
