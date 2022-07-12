import { Box, Select } from '@voiceflow/ui';
import React from 'react';

import Upgrade from '@/components/Upgrade';
import UpgradeOption from '@/components/UpgradeOption';
import { FeatureFlag } from '@/config/features';
import { Permission } from '@/config/permissions';
import { GATED_EXPORT_TYPES, getCanvasExportLimitDetails, isGatedCanvasExportType } from '@/config/planLimits/canvasExport';
import { ExportFormat } from '@/constants';
import { UpgradePrompt } from '@/ducks/tracking';
import { useFeature, usePermission } from '@/hooks';

import { CANVAS_EXPORT_OPTIONS, CANVAS_EXPORT_OPTIONS_LABELS } from '../constants';
import { ExportContext } from '../Context';

const Canvas: React.FC = () => {
  const { canvasExportFormat, setCanvasExportFormat, setCanExport } = React.useContext(ExportContext)!;
  const [canExportWithoutBranding] = usePermission(Permission.CANVAS_EXPORT);
  const [permissionToExport] = usePermission(Permission.MODEL_EXPORT);
  const revisedEntitlements = useFeature(FeatureFlag.REVISED_CREATOR_ENTITLEMENTS);

  const canvasExportSelection = (value: ExportFormat) => {
    setCanvasExportFormat(value);
    setCanExport(permissionToExport || !GATED_EXPORT_TYPES.has(value));
  };

  return (
    <>
      {revisedEntitlements.isEnabled ? (
        <Select
          value={canvasExportFormat}
          options={CANVAS_EXPORT_OPTIONS}
          onSelect={canvasExportSelection}
          getOptionLabel={(value) => value && CANVAS_EXPORT_OPTIONS_LABELS[value]}
          renderOptionLabel={(option, searchLabel, getOptionLabel, getOptionValue, { isFocused }) => (
            <UpgradeOption<ExportFormat, ExportFormat>
              option={option}
              isFocused={isFocused}
              searchLabel={searchLabel}
              getOptionLabel={getOptionLabel}
              getOptionValue={getOptionValue}
              isGated={isGatedCanvasExportType(option, permissionToExport)}
              planDetails={getCanvasExportLimitDetails(option)}
              promptOrigin={UpgradePrompt.EXPORT_PROJECT}
            />
          )}
        />
      ) : (
        <Select
          value={canvasExportFormat}
          options={CANVAS_EXPORT_OPTIONS}
          onSelect={setCanvasExportFormat}
          getOptionLabel={(value) => value && CANVAS_EXPORT_OPTIONS_LABELS[value]}
        />
      )}

      {!canExportWithoutBranding && (
        <Box position="absolute" left={0} right={0} bottom={0}>
          <Upgrade>Remove branding from PNG & PDF exports.</Upgrade>
        </Box>
      )}
    </>
  );
};

export default Canvas;
