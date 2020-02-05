import React from 'react';

import { Content, Controls, Section } from '@/containers/CanvasV2/components/Editor';
import { EngineContext } from '@/containers/CanvasV2/contexts';
import { focusedNodeSelector } from '@/ducks/creator';
import { connect } from '@/hocs';

import { Button, Checkbox, InfoTooltip } from './components';

function RandomEditor({ data, onChange, focusedNode }) {
  const engine = React.useContext(EngineContext);

  const addPath = React.useCallback(async () => {
    const index = data.paths + 1;

    onChange({ paths: index }, false);
    await engine.port.add(focusedNode.id, { label: index });
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
      ></Section>
    </Content>
  );
}

const mapStateToProps = {
  focusedNode: focusedNodeSelector,
};

export default connect(mapStateToProps)(RandomEditor);
