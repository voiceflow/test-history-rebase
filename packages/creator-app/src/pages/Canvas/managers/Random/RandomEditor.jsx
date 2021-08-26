import React from 'react';

import Section from '@/components/Section';
import { focusedNodeSelector } from '@/ducks/creator';
import { connect } from '@/hocs';
import { Content, Controls } from '@/pages/Canvas/components/Editor';
import { EngineContext } from '@/pages/Canvas/contexts';

import { Button, Checkbox, InfoTooltip } from './components';

function RandomEditor({ data, onChange, focusedNode }) {
  const engine = React.useContext(EngineContext);

  const addPath = React.useCallback(async () => {
    const index = data.paths + 1;

    await engine.port.add(focusedNode.id, { label: index });
    onChange({ paths: index }, false);
  }, [data.paths, focusedNode.id, onChange]);

  const removePath = React.useCallback(async () => {
    const lastPortID = focusedNode.ports.out[focusedNode.ports.out.length - 1];

    onChange({ paths: data.paths - 1 }, false);
    await engine.port.remove(lastPortID);
  }, [data.paths, focusedNode.ports.out, onChange]);

  const toggleDuplicates = React.useCallback(() => onChange({ noDuplicates: !data.noDuplicates }), [data.noDuplicates, onChange]);

  return (
    <Content
      footer={() => (
        <Controls
          menu={
            <>
              {data.paths > 1 && (
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

const mapStateToProps = {
  focusedNode: focusedNodeSelector,
};

export default connect(mapStateToProps)(RandomEditor);
