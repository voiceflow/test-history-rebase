import { Box, Select } from '@voiceflow/ui';
import React from 'react';

import Upgrade from '@/components/Upgrade';
import { Permission } from '@/config/permissions';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { usePermission, useSelector } from '@/hooks';

import { CANVAS_EXPORT_OPTIONS, CANVAS_EXPORT_OPTIONS_LABELS, CANVAS_OPTIONS_TEMPLATE_WORKSPACE } from '../constants';
import { ExportContext } from '../contexts';

const ExportCanva: React.FC = () => {
  const { canvasExportFormat, setCanvasExportFormat } = React.useContext(ExportContext)!;
  const [canExportWithoutBranding] = usePermission(Permission.CANVAS_EXPORT);

  const isTemplateWorkspace = useSelector(WorkspaceV2.active.isTemplatesSelector);

  return (
    <>
      <Select
        value={canvasExportFormat}
        options={isTemplateWorkspace ? CANVAS_OPTIONS_TEMPLATE_WORKSPACE : CANVAS_EXPORT_OPTIONS}
        onSelect={setCanvasExportFormat}
        getOptionLabel={(value) => value && CANVAS_EXPORT_OPTIONS_LABELS[value]}
      />

      {!canExportWithoutBranding && (
        <Box position="absolute" left={0} right={0} bottom={0}>
          <Upgrade>Remove branding from PNG & PDF exports.</Upgrade>
        </Box>
      )}
    </>
  );
};

export default ExportCanva;
