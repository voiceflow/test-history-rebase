import { fetchDiagramVariables } from 'ducks/diagram_variable';
import { setConfirm } from 'ducks/modal';
import { openTab } from 'ducks/user';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';
import { Tooltip } from 'react-tippy';
import { Alert, Input } from 'reactstrap';

import DiagramVariables from './components/DiagramVariables';

class DiagramBlock extends Component {
  constructor(props) {
    super(props);

    // state.variables is for variables of the diagram linked
    // props.variables is for variables of the current diagram
    this.state = {
      node: this.props.node,
      variables: [],
    };

    this.onUpdate = this.onUpdate.bind(this);
    this.handleAddMap = this.handleAddMap.bind(this);
    this.handleRemoveMap = this.handleRemoveMap.bind(this);
    this.handleSelection = this.handleSelection.bind(this);
    this.getDiagramVariables = this.getDiagramVariables.bind(this);
  }

  // eslint-disable-next-line react/no-deprecated
  componentWillMount() {
    this.getDiagramVariables();
  }

  getDiagramVariables() {
    const diagram_id = this.state.node.extras.diagram_id;
    // diagram_id = '5f33383b-a9a8-4a85-9fa5-16bdad17b37f';

    if (diagram_id) {
      this.props.fetchDiagramVariables(diagram_id);
    }
  }

  onUpdate() {
    this.setState(
      {
        node: this.state.node,
      },
      this.props.onUpdate
    );
  }

  handleAddMap(io) {
    const node = this.state.node;
    node.extras[io].push({
      arg1: null,
      arg2: null,
    });

    this.setState(
      {
        node,
      },
      this.props.onUpdate
    );
  }

  handleRemoveMap(io, i) {
    const node = this.state.node;

    node.extras[io].splice(i, 1);

    this.setState(
      {
        node,
      },
      this.props.onUpdate
    );
  }

  handleSelection(io, i, arg, value) {
    const node = this.state.node;

    if (node.extras[io][i][arg] !== value) {
      node.extras[io][i][arg] = value;

      this.setState(
        {
          node,
        },
        this.props.onUpdate
      );
    }
  }

  renderOptionsForNewFlow() {
    const options = this.props.diagrams
      .filter((diagram) => diagram.name !== 'ROOT' && (!this.state.node.extras.diagram_id || this.state.node.extras.diagram_id !== diagram.id))
      .map((diagram) => {
        return {
          value: `${diagram.id}::${diagram.name}`,
          label: (
            <>
              <img src="/flows.svg" alt="flows" width="15" />
              &nbsp;&nbsp; {diagram.name}
            </>
          ),
        };
      });

    if (this.props.diagrams && this.props.diagrams.length > 0) {
      return (
        <React.Fragment>
          <label>Select Existing Flow</label>
          <Select
            placeholder={
              <>
                <img src="/flows.svg" alt="flows" width="15" />
                &nbsp;&nbsp; Select Flow
              </>
            }
            classNamePrefix="select-box"
            onChange={(selected) => {
              const node = this.state.node;
              node.extras.diagram_id = selected.value.substring(0, selected.value.indexOf('::'));
              this.setState(
                {
                  node,
                },
                this.props.onUpdate
              );
            }}
            options={options}
          />
        </React.Fragment>
      );
    }
    return null;
  }

  renderNewDiagram() {
    return (
      <>
        <label>Create a New Flow</label>
        <button
          className="btn-clear btn-block btn-lg"
          onClick={() => {
            this.props.setConfirm({
              text: (
                <>
                  <label className="mb-2">Name New Flow</label>
                  <Input
                    className="mb-1"
                    placeholder="Enter flow name"
                    value={this.state.newFlowName}
                    onChange={(e) =>
                      this.setState({
                        newFlowName: e.target.value,
                      })
                    }
                  />
                </>
              ),
              confirm: () => this.props.createDiagram(this.state.node, this.state.newFlowName),
            });
          }}
        >
          <img src="/flows.svg" alt="back" className="mr-2" /> Create New Flow
        </button>
        <div className="break">
          <span className="break-text">OR</span>
        </div>
        {this.renderOptionsForNewFlow()}
      </>
    );
  }

  renderExistingDiagram() {
    return (
      <React.Fragment>
        <button className="mt-4 btn-primary btn-block mb-3 btn-lg" onClick={() => this.props.enterFlow(this.state.node.extras.diagram_id)}>
          <img src="/flows-white.svg" className="mr-2" alt="flow" /> Enter Flow
        </button>
        {/* <Select
                classNamePrefix="select-box"
                onChange={(selected) => {
                    let node = this.state.node;
                    node.extras.diagram_id = selected.value;
                    this.props.enterFlow(selected.value);
                }}
                options={options}
                placeholder="Change subflow"
            /> */}
        <label>
          Input Variables &nbsp;
          <Tooltip target="tooltip" theme="menu" position="bottom" title="Pass in variables that will be used exclusively for this flow.">
            <i className="fas fa-question-circle text-dull mr-1" />
          </Tooltip>
        </label>
        <DiagramVariables
          arg1_options={this.props.variables}
          arg2_options={this.props.diagramVariables}
          arguments={this.state.node.extras.inputs}
          onAdd={() => this.handleAddMap('inputs')}
          onRemove={(i) => this.handleRemoveMap('inputs', i)}
          handleSelection={(i, arg, value) => this.handleSelection('inputs', i, arg, value)}
          openVarTab={this.props.openVarTab}
        />
        <hr className="mb-1" />
        <label>
          Output Variables &nbsp;
          <Tooltip target="tooltip" theme="menu" position="bottom" title="Retrieve variables that are used in this flow.">
            <i className="fas fa-question-circle text-dull mr-1" />
          </Tooltip>
        </label>
        <DiagramVariables
          reverse
          arg1_options={this.props.variables}
          arg2_options={this.props.diagramVariables}
          arguments={this.state.node.extras.outputs}
          onAdd={() => this.handleAddMap('outputs')}
          onRemove={(i) => this.handleRemoveMap('outputs', i)}
          handleSelection={(i, arg, value) => this.handleSelection('outputs', i, arg, value)}
          openVarTab={this.props.openVarTab}
        />
      </React.Fragment>
    );
  }

  render() {
    if (this.props.broken || (this.state.node.extras.diagram_id && !this.props.diagrams.find((d) => d.id === this.state.node.extras.diagram_id))) {
      return (
        <Alert color="danger" className="text-center">
          <i className="fas fa-exclamation-triangle fa-2x mb-2" />
          <br />
          Unable to Retrieve Flow - This Flow may be broken or deleted
          <br />
          <br />
          If deleted, delete this block
        </Alert>
      );
    }

    return <div>{!this.state.node.extras.diagram_id ? this.renderNewDiagram() : this.renderExistingDiagram()}</div>;
  }
}

const mapStateToProps = (state) => ({
  diagrams: state.diagrams.diagrams,
  load_diagram: state.diagrams.loading,
  broken: state.diagrams.error,
  diagramVariables: state.diagramVariables.diagramVariables,
});

const mapDispatchToProps = (dispatch) => {
  return {
    setConfirm: (confirm) => dispatch(setConfirm(confirm)),
    fetchDiagramVariables: (diagram_id) => dispatch(fetchDiagramVariables(diagram_id)),
    openVarTab: (tab) => dispatch(openTab(tab)),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DiagramBlock);
