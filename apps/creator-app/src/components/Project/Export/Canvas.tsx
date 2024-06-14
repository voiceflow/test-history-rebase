import { Utils } from '@voiceflow/common';
import { BlockText, Box, createUIOnlyMenuItemOption, defaultMenuLabelRenderer, Select } from '@voiceflow/ui';
import React, { useMemo } from 'react';

import { MenuItem } from '@/components/MenuItem';
import { ExportFormat } from '@/constants';
import { Designer } from '@/ducks';
import { useSelector } from '@/hooks/store.hook';

import { CANVAS_EXPORT_OPTIONS, CANVAS_EXPORT_OPTIONS_LABELS } from './constants';
import { ProjectExportContext } from './Context';

export const Canvas: React.FC = () => {
  const CANVAS_SPECIFIC_EXPORT_OPTIONS = [ExportFormat.PDF, ExportFormat.PNG];

  const { canvasExportFormat, setCanvasExportFormat, exportDiagramID, setExportDiagramID } =
    React.useContext(ProjectExportContext)!;

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
            <MenuItem label={defaultMenuLabelRenderer(format, searchLabel, getOptionLabel, getOptionValue, options)} />
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
    </>
  );
};
