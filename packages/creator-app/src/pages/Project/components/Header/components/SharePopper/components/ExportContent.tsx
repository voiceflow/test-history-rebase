import { Box, Title } from '@voiceflow/ui';
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
      <Title fontSize={15} mb={16} textAlign="left">
        Export Type
      </Title>

      <Box mb={16}>
        <RadioGroup isFlat options={EXPORT_TYPE_OPTIONS} checked={exportType} onChange={setExportType} />
      </Box>
      {exportType === ExportType.MODEL && <ExportModel />}

      {exportType === ExportType.CANVAS && <ExportCanva />}
    </FadeLeftContainer>
  );
};

export default ExportContent;
