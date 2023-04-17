import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, SectionV2, TippyTooltip, Toggle } from '@voiceflow/ui';
import React from 'react';

import * as Documentation from '@/config/documentation';
import { useMapManager } from '@/hooks';
import EditorV2 from '@/pages/Canvas/components/EditorV2';
import { NodeEditorV2 } from '@/pages/Canvas/managers/types';

import PathInput from './PathInput';

const Editor: NodeEditorV2<Realtime.NodeData.RandomV2> = ({ data, onChange }) => {
  const syncDynamicPorts = EditorV2.useSyncDynamicPorts();

  const mapManager = useMapManager<{ label: string }>(data.namedPaths, (namedPaths) => onChange({ namedPaths }), {
    ...syncDynamicPorts,
    factory: () => ({ label: `Path ${data.namedPaths.length + 1}` }),
  });

  const toggle = React.useCallback(() => onChange({ noDuplicates: !data.noDuplicates }), [data.noDuplicates, onChange]);

  return (
    <EditorV2
      header={<EditorV2.DefaultHeader title="Random" />}
      footer={<EditorV2.DefaultFooter tutorial={Documentation.RANDOM_STEP}></EditorV2.DefaultFooter>}
    >
      <SectionV2.Sticky>
        {({ sticked }) => (
          <SectionV2.Header sticky sticked={sticked}>
            <SectionV2.Title bold>Paths</SectionV2.Title>
            <SectionV2.AddButton onClick={mapManager.onAdd} />
          </SectionV2.Header>
        )}
      </SectionV2.Sticky>

      <SectionV2.Content>
        {mapManager.map((item, { key, isLast, onUpdate, onRemove }) => (
          <Box key={key} pb={isLast ? 16 : 12}>
            <PathInput
              key={key}
              value={item.label}
              onChange={(label) => onUpdate({ label })}
              onRemove={onRemove}
              removeDisabled={mapManager.size <= 2}
            />
          </Box>
        ))}
      </SectionV2.Content>

      <SectionV2.Divider />

      <TippyTooltip
        width={208}
        content={
          <TippyTooltip.Multiline>When on, the step will ignore paths that have already been activated in a given session.</TippyTooltip.Multiline>
        }
        style={{ cursor: 'pointer' }}
        display="block"
        offset={[0, -10]}
        position="bottom-end"
      >
        <SectionV2.SimpleSection onClick={toggle}>
          <SectionV2.Title>Ignore duplicate paths</SectionV2.Title>

          <Toggle size={Toggle.Size.EXTRA_SMALL} checked={!!data.noDuplicates} />
        </SectionV2.SimpleSection>
      </TippyTooltip>
    </EditorV2>
  );
};

export default Editor;
