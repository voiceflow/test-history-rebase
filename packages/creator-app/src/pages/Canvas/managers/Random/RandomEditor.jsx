import React from 'react';

import Section from '@/components/Section';
import { focusedNodeSelector } from '@/ducks/creator';
import { connect } from '@/hocs';
import { Content, Controls } from '@/pages/Canvas/components/Editor';
import { EngineContext } from '@/pages/Canvas/contexts';

import { Button, Checkbox, InfoTooltip } from './components';

function RandomEditor({ data, onChange, focusedNode }) {
  const [pathCount, setPathCount] = React.useState(data.paths);
  const engine = React.useContext(EngineContext);

  const addPath = async () => {
    const index = pathCount + 1;

    setPathCount(index);
    onChange({ paths: index }, false);
    await engine.port.add(focusedNode.id, { label: pathCount });
  };

  const removePath = async () => {
    const index = data.paths - 1;

    setPathCount(index);
    onChange({ paths: index }, false);

    const lastPortID = focusedNode.ports.out[focusedNode.ports.out.length - 1];
    await engine.port.remove(lastPortID);
  };

  const toggleDuplicates = React.useCallback(() => onChange({ noDuplicates: !data.noDuplicates }), [data.noDuplicates, onChange]);

  return (
    <Content
      footer={() => (
        <Controls
          menu={
            <>
              {pathCount > 1 && (
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
