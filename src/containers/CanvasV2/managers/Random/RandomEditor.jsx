import React from 'react';
import { InputGroup } from 'reactstrap';

import Checkbox from '@/components/Checkbox';
import Button from '@/componentsV2/Button';
import { FlexEnd } from '@/componentsV2/Flex';
import { Content, Section } from '@/containers/CanvasV2/components/BlockEditor';
import { EngineContext } from '@/containers/CanvasV2/contexts';
import { focusedNodeSelector } from '@/ducks/creator';
import { connect } from '@/hocs';

function RandomEditor({ data, onChange, focusedNode }) {
  const engine = React.useContext(EngineContext);

  const addPath = () => {
    const index = data.paths + 1;

    onChange({ paths: index });
    engine.port.add(focusedNode.id, { label: index });
  };
  const removePath = () => {
    const lastPortID = focusedNode.ports.out[focusedNode.ports.out.length - 1];

    onChange({ paths: data.paths - 1 });
    engine.port.remove(lastPortID);
  };
  const toggleDuplicates = () => onChange({ noDuplicates: !data.noDuplicates });

  return (
    <Content>
      <Section>
        <FlexEnd>
          {data.paths > 1 && (
            <Button className="mr-3" variant="tertiary" onClick={removePath}>
              Remove Path
            </Button>
          )}
          <Button variant="secondary" onClick={addPath}>
            Add Path
          </Button>
        </FlexEnd>
      </Section>
      <Section>
        <InputGroup>
          <label className="input-group-text w-100 m-0 text-left">
            <Checkbox checked={!!data.noDuplicates} onChange={toggleDuplicates} />
            <span>No Duplicates</span>
          </label>
        </InputGroup>
      </Section>
    </Content>
  );
}

const mapStateToProps = {
  focusedNode: focusedNodeSelector,
};

export default connect(mapStateToProps)(RandomEditor);
