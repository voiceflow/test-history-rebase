import { Utils } from '@voiceflow/common';
import { BlockText, Box, createUIOnlyMenuItemOption, defaultMenuLabelRenderer, Select } from '@voiceflow/ui';
import React, { useMemo } from 'react';

import PermittedMenuItem from '@/components/PermittedMenuItem';
import Upgrade from '@/components/Upgrade';
import { ExportFormat } from '@/constants';
import { Permission } from '@/constants/permissions';
import { Designer } from '@/ducks';
import { usePermission } from '@/hooks';
import { useSelector } from '@/hooks/store.hook';

import { CANVAS_EXPORT_OPTIONS, CANVAS_EXPORT_OPTIONS_LABELS } from './constants';
import { Context } from './Context';

export const Canvas: React.FC = () => {
  const CANVAS_SPECIFIC_EXPORT_OPTIONS = [ExportFormat.PDF, ExportFormat.PNG];

  const { allowed: isAllowed, planConfig } = usePermission(Permission.FEATURE_CANVAS_EXPORT);
  const { canvasExportFormat, setCanvasExportFormat, exportDiagramID, setExportDiagramID } = React.useContext(Context)!;

  const workflows = useSelector(Designer.Workflow.selectors.all);
  const components = useSelector(Designer.Flow.selectors.all);

  const [diagramOptions, diagramOptionsMap] = useMemo(() => {
    const options: Array<{ id: string; label: string }> = [];

    if (workflows.length) {
      options.push(
        createUIOnlyMenuItemOption('workflows-header', { label: 'Workflows', groupHeader: true }),
        ...[...workflows]
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((workflow) => ({ id: workflow.diagramID, label: workflow.name }))
      );
    }

    if (components.length) {
      options.push(
        createUIOnlyMenuItemOption('components-header', { label: 'Components', groupHeader: true }),
        ...[...components]
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((component) => ({ id: component.diagramID, label: component.name }))
      );
    }

    return [options, Utils.array.createMap(options, (option) => option.id)];
  }, [workflows, components]);

  return (
    <>
      <div>
        <BlockText fontSize={15} color="#62778C" fontWeight={600} marginBottom={11}>
          Export format
        </BlockText>

        <Select
          fullWidth
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
              permission={Permission.FEATURE_CANVAS_EXPORT}
              tooltipProps={{ offset: [0, 30] }}
            />
          )}
        />

        {CANVAS_SPECIFIC_EXPORT_OPTIONS.includes(canvasExportFormat) && (
          <Box mt={20}>
            <BlockText fontSize={15} color="#62778C" fontWeight={600} marginBottom={11}>
              Workflow / Component
            </BlockText>

            <Select
              fullWidth
              value={exportDiagramID}
              options={diagramOptions}
              onSelect={setExportDiagramID}
              placeholder="Select workflow or component"
              getOptionValue={(option) => option?.id}
              getOptionLabel={(id) => (id && diagramOptionsMap[id]?.label) ?? ''}
            />
          </Box>
        )}
      </div>

      {!isAllowed && (
        <Box paddingTop={22} left={0} right={0} bottom={0} width={'430px'} height="50px" marginX="-24px">
          <Upgrade>Remove branding from PNG & PDF exports.</Upgrade>
        </Box>
      )}
    </>
  );
};
