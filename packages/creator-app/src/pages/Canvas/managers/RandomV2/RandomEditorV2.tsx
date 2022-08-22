import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, SectionV2, TippyTooltip, Toggle } from '@voiceflow/ui';
import React from 'react';

import * as Documentation from '@/config/documentation';
import { useMapManager } from '@/hooks';
import EditorV2 from '@/pages/Canvas/components/EditorV2';
import { NodeEditorV2 } from '@/pages/Canvas/managers/types';

import { PathInput } from './components';

const RandomEditorV2: NodeEditorV2<Realtime.NodeData.RandomV2> = ({ data, onChange }) => {
  const [numPaths, setNumPaths] = React.useState(2);

  const syncDynamicPorts = EditorV2.useSyncDynamicPorts();
  const mapManager = useMapManager(data.namedPaths, (namedPaths) => onChange({ namedPaths }), {
    ...syncDynamicPorts,
    factory: () => ({ label: `Path ${numPaths + 1}` }),
  });

  const addPath = () => {
    setNumPaths(numPaths + 1);
    mapManager.onAdd();
  };

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
            <SectionV2.AddButton onClick={addPath} />
          </SectionV2.Header>
        )}
      </SectionV2.Sticky>
      <SectionV2.Content>
        {data.namedPaths &&
          mapManager.map((item, { key, isLast, onUpdate, onRemove }) => {
            const removePath = () => {
              if (numPaths - 1 >= 2) {
                setNumPaths(numPaths - 1);
                onRemove();
              }
            };
            return (
              <Box key={key} pb={isLast ? 16 : 12}>
                <PathInput key={key} pathName={item.label} onUpdate={onUpdate} onRemove={removePath} removeDisabled={data.namedPaths.length <= 2} />
              </Box>
            );
          })}
      </SectionV2.Content>
      <SectionV2.Divider />

      <TippyTooltip
        style={{ cursor: 'pointer', display: 'block' }}
        bodyOverflow
        position="bottom-end"
        distance={-10}
        html={
          <TippyTooltip.Multiline>When on, the step will ignore paths that have already been activated in a given session.</TippyTooltip.Multiline>
        }
      >
        <SectionV2.SimpleSection onClick={toggle}>
          <SectionV2.Title>Ignore duplicate paths</SectionV2.Title>
          <Toggle size={Toggle.Size.EXTRA_SMALL} checked={!!data.noDuplicates} />
        </SectionV2.SimpleSection>
      </TippyTooltip>
    </EditorV2>
  );
};

export default RandomEditorV2;
