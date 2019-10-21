import React from 'react';
import { Tooltip } from 'react-tippy';

import Divider from '@/components/Divider';
import Button from '@/componentsV2/Button';
import FlowError from '@/containers/CanvasV2/components/FlowError';
import { diagramByIDSelector } from '@/ducks/diagram';
import { goToDiagram } from '@/ducks/router';
import { connect } from '@/hocs';

import ExistingFlowSection from './ExistingFlowSection';
import FlowVariables from './FlowVariables';

const ExisitingFlow = ({ data, onChange, goToDiagram, diagram, withVariables }) => {
  const updateInputs = (inputs) => onChange({ inputs });
  const updateOutputs = (outputs) => onChange({ outputs });

  return (
    <ExistingFlowSection>
      {diagram ? <Button onClick={goToDiagram}>{diagram.name}</Button> : <FlowError />}
      <Button variant="tertiary" onClick={() => onChange({ diagramID: null, inputs: [], outputs: [] })}>
        Unlink Flow
      </Button>
      {withVariables && (
        <>
          <label>
            Input Variables &nbsp;
            <Tooltip target="tooltip" theme="menu" position="bottom" title="Pass in variables that will be used exclusively for this flow.">
              <i className="fas fa-question-circle text-dull mr-1" />
            </Tooltip>
          </label>
          <FlowVariables diagramID={data.diagramID} items={data.inputs} onChange={updateInputs} />
          <Divider />
          <label>
            Output Variables &nbsp;
            <Tooltip target="tooltip" theme="menu" position="bottom" title="Retrieve variables that are used in this flow.">
              <i className="fas fa-question-circle text-dull mr-1" />
            </Tooltip>
          </label>
          <FlowVariables reverse diagramID={data.diagramID} items={data.outputs} onChange={updateOutputs} />
        </>
      )}
    </ExistingFlowSection>
  );
};

const mapStateToProps = {
  diagram: diagramByIDSelector,
};

const mapDispatchToProps = {
  goToDiagram,
};

const mergeProps = ({ diagram }, { goToDiagram }, { data }) => ({
  goToDiagram: () => goToDiagram(data.diagramID),
  diagram: data.diagramID && diagram(data.diagramID),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(ExisitingFlow);
