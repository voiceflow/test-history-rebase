import React from 'react';

import Section from '@/components/Section';
import * as History from '@/ducks/history';
import { useDispatch } from '@/hooks';
import { Content, Controls } from '@/pages/Canvas/components/Editor';

import { Button, Checkbox, InfoTooltip } from './components';

function RandomEditor({ data, node, engine, onChange }) {
  const transaction = useDispatch(History.transaction);

  const addPath = async () => {
    const nextPath = node.ports.out.dynamic.length + 1;

    await transaction(async () => {
      await Promise.all([onChange({ paths: nextPath }, false), engine.port.addDynamic(node.id, { label: nextPath })]);
    });
  };

  const removePath = async () => {
    const nextPath = node.ports.out.dynamic.length - 1;
    const lastPortID = node.ports.out.dynamic[node.ports.out.dynamic.length - 1];

    await transaction(async () => {
      await Promise.all([onChange({ paths: nextPath }, false), engine.port.removeDynamic(lastPortID)]);
    });
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
