import { BlockText, Box, Title } from '@voiceflow/ui';
import React from 'react';

import RadioGroup from '@/components/RadioGroup';
import { FadeLeftContainer } from '@/styles/animations';

import { EXPORT_TYPE_OPTIONS, ExportType } from '../constants';
import { ExportContext } from '../contexts';
import ExportCanva from './ExportCanva';
import ExportModel from './ExportModel';

const ExportContent: React.FC = () => {
  const { exportType, setExportType } = React.useContext(ExportContext)!;

  return (
    <FadeLeftContainer style={{ height: '100%' }} paddingTop={24} paddingX={32}>
      <Title fontSize={15} mb={8} textAlign="left">
        Export
      </Title>

      <BlockText color="#62778c" fontSize={13} mb={24}>
        Export project content for sharing, or for external platforms like Dialogflow, Luis or Rasa.
      </BlockText>

      <BlockText color="#62778c" fontSize={13} mb={10} fontWeight="bold">
        Export type
      </BlockText>

      <Box mb={16}>
        <RadioGroup isFlat options={EXPORT_TYPE_OPTIONS} checked={exportType} onChange={setExportType} />
      </Box>

      {exportType === ExportType.CANVAS && <ExportCanva />}

      {exportType === ExportType.MODEL && <ExportModel />}
    </FadeLeftContainer>
  );
};

export default ExportContent;
