import React from 'react';

import Section from '@/components/Section';
import { Content, Controls } from '@/pages/Canvas/components/Editor';

import { Button, Checkbox, InfoTooltip } from './components';

function RandomEditor({ data, node, engine, onChange }) {
  const addPath = async () => {
    const nextPath = node.ports.out.dynamic.length + 1;

    onChange({ paths: nextPath }, false);

    await engine.port.addOutDynamic(node.id, { label: nextPath });
  };

  const removePath = async () => {
    const nextPath = node.ports.out.dynamic.length - 1;

    onChange({ paths: nextPath }, false);

    const lastPortID = node.ports.out.dynamic[node.ports.out.dynamic.length - 1];

    await engine.port.removeOutDynamic(lastPortID);
  };

  const toggleDuplicates = React.useCallback(() => onChange({ noDuplicates: !data.noDuplicates }), [data.noDuplicates, onChange]);

  return (
    <Content
      footer={() => (
        <Controls
          menu={
            <>
              {node.ports.out.dynamic.length > 1 && (
                <Button hasRight variant="secondary" onClick={removePath}>
                  Remove Path
                </Button>
              )}

              <Button variant="secondary" onClick={addPath}>
                Add Path
              </Button>
            </>
          }
        />
      )}
    >
      <Section
        header={
          <Checkbox checked={!!data.noDuplicates} onChange={toggleDuplicates}>
            <span>No duplicates</span>
          </Checkbox>
        }
        tooltip={<InfoTooltip />}
      />
    </Content>
  );
}

export default RandomEditor;
