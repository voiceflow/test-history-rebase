import { BlockText, Box, Title } from '@voiceflow/ui';
import React from 'react';

import RadioGroup from '@/components/RadioGroup';
import Upgrade from '@/components/Upgrade';
import { Permission } from '@/config/permissions';
import { ExportFormat } from '@/constants';
import * as Workspace from '@/ducks/workspace';
import { usePermission, useSelector } from '@/hooks';
import { FadeLeftContainer } from '@/styles/animations';

import { ExportContext } from '../contexts';

export const EXPORT_OPTIONS = [
  { id: ExportFormat.PNG, label: 'Image (PNG)' },
  { id: ExportFormat.PDF, label: 'PDF' },
  { id: ExportFormat.VF, label: 'Local copy (.vf)' },
];

export const EXPORT_OPTIONS_TEMPLATE_WORKSPACE = [{ id: ExportFormat.VF, label: 'Local copy (.vf)' }];

const ExportContent: React.FC = () => {
  const { exportFormat, setExportFormat } = React.useContext(ExportContext)!;

  const [canExportWithoutBranding] = usePermission(Permission.CANVAS_EXPORT);

  const isTemplateWorkspace = useSelector(Workspace.isTemplateWorkspaceSelector);

  return (
    <FadeLeftContainer style={{ height: '100%' }} paddingTop={24} paddingX={32}>
      <Title fontSize={15} mb={8} textAlign="left">
        Export
      </Title>

      <BlockText color="#62778c" fontSize={13} mb={24}>
        Export the content of your project, or save it locally.
      </BlockText>

      <BlockText color="#62778c" fontSize={13} mb={11} fontWeight="bold">
        Content Format
      </BlockText>

      <RadioGroup
        isFlat
        options={isTemplateWorkspace ? EXPORT_OPTIONS_TEMPLATE_WORKSPACE : EXPORT_OPTIONS}
        checked={exportFormat}
        column
        onChange={setExportFormat}
      />

      {!canExportWithoutBranding && (
        <Box position="absolute" left={0} right={0} bottom={0}>
          <Upgrade>Remove branding from PNG & PDF exports.</Upgrade>
        </Box>
      )}
    </FadeLeftContainer>
  );
};

export default ExportContent;
