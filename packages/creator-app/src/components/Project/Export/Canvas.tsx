import { Box, defaultMenuLabelRenderer, Select } from '@voiceflow/ui';
import React from 'react';

import PermittedMenuItem from '@/components/PermittedMenuItem';
import Upgrade from '@/components/Upgrade';
import { Permission } from '@/constants/permissions';
import { usePermission } from '@/hooks';

import { CANVAS_EXPORT_OPTIONS, CANVAS_EXPORT_OPTIONS_LABELS } from './constants';
import { Context } from './Context';

export const Canvas: React.FC = () => {
  const { allowed: isAllowed, planConfig } = usePermission(Permission.CANVAS_EXPORT);
  const { canvasExportFormat, setCanvasExportFormat } = React.useContext(Context)!;

  return (
    <>
      <Select
        value={canvasExportFormat}
        label={CANVAS_EXPORT_OPTIONS_LABELS[canvasExportFormat]}
        options={CANVAS_EXPORT_OPTIONS}
        onSelect={setCanvasExportFormat}
        getOptionLabel={(value) => value && CANVAS_EXPORT_OPTIONS_LABELS[value]}
        renderOptionLabel={(format, searchLabel, getOptionLabel, getOptionValue, options) => (
          <PermittedMenuItem
            data={{ format }}
            label={defaultMenuLabelRenderer(format, searchLabel, getOptionLabel, getOptionValue, options)}
            isFocused={options.isFocused}
            isAllowed={planConfig && !planConfig.isPaidExportFormat(format)}
            permission={Permission.CANVAS_EXPORT}
            tooltipProps={{ offset: [0, 30] }}
          />
        )}
      />

      {!isAllowed && (
        <Box position="absolute" left={0} right={0} bottom={0}>
          <Upgrade>Remove branding from PNG & PDF exports.</Upgrade>
        </Box>
      )}
    </>
  );
};
