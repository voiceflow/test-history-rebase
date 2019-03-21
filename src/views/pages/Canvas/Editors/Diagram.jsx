import React, { Component } from 'react';
import {Button, Alert, Input} from 'reactstrap';
import { connect } from 'react-redux';
import Select from 'react-select';
import { setConfirm } from 'actions/modalActions'

import { fetchDiagramVariables } from './../../../../actions/diagramVariablesAction';
import DiagramVariables from './components/DiagramVariables';
// import Expressionfy from './components/Expressionfy';

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
    }

    componentWillMount() {
        this.getDiagramVariables()
    }

    getDiagramVariables(){
        let diagram_id = this.state.node.extras.diagram_id;
        // diagram_id = '5f33383b-a9a8-4a85-9fa5-16bdad17b37f';

        if(diagram_id){
            this.props.dispatch(fetchDiagramVariables(diagram_id));
        }
    }

    onUpdate(){
        this.setState({
            node: this.state.node
        }, this.props.onUpdate);
    }

    handleAddMap(io) {
        // console.log(this.state.node.extras.choices);
        var node = this.state.node;
        node.extras[io].push({
            arg1: null,
            arg2: null
        });

        this.setState({
            node: node
        }, this.props.onUpdate);
    }

    handleRemoveMap(io, i) {
        let node = this.state.node;

        node.extras[io].splice(i, 1);

        this.setState({
            node: node
        }, this.props.onUpdate);
    }

    handleSelection(io, i, arg, value) {
        let node = this.state.node;

        if(node.extras[io][i][arg] !== value){
            node.extras[io][i][arg] = value;

            this.setState({
                node: node
            }, this.props.onUpdate);
        }
    }

    render() {
        let options = this.props.diagrams
            .filter(diagram => diagram.name !== 'ROOT' && (!this.state.node.extras.diagram_id || this.state.node.extras.diagram_id !== diagram.id))
            .map(diagram => {
                return {
                    value: diagram.id + "::" + diagram.name,
                    label: <><i className="fas fa-clone mr-2 text-muted"/>{diagram.name}</>
                }
            })

        // let block
        // if(this.state.node.extras.diagram_id){
        //     block = this.props.diagrams.find(d => d.id === this.state.node.extras.diagram_id)
        // }
        if(this.props.broken){
            return <Alert color="danger" className="text-center">
                <i className="fas fa-exclamation-triangle fa-2x mb-2"/><br/>
                Unable to Retrieve Flow - This Flow may be broken or deleted<br/><br/>
                If deleted, delete this block
            </Alert>
        }

        return (
            <div>
                {!this.state.node.extras.diagram_id ? 
                    <React.Fragment>
                        <label>Create a New Flow</label>
                        <Button block className="btn-lg" onClick={() => {
                            this.props.setConfirm({
                                text: <>
                                    <div className="mb-2">Name your flow</div>
                                    <Input className="form-bg mb-3"
                                        placeholder={`Enter flow name`}
                                        value={this.state.newFlowName}
                                        onChange={e => this.setState({
                                            newFlowName: e.target.value
                                        })}
                                    />
                                </>,
                                confirm: () => this.props.createDiagram(this.state.node, this.state.newFlowName)
                            })
                        }}>
                          <i className="fas fa-clone mr-1"/> Create New Flow
                        </Button>
                        <hr className="mb-1"/>
                        {this.props.diagrams && this.props.diagrams.length > 0 ? 
                            <React.Fragment>
                                <label>Select Existing Flow</label>
                                <Select
                                    placeholder={<><i className="fas fa-clone mr-1"/> Select Flow</>}
                                    classNamePrefix="select-box"
                                    onChange={(selected) => {
                                        let node = this.state.node
                                        node.extras.diagram_id = selected.value.substring(0, selected.value.indexOf("::"))
                                        this.setState({
                                            node: node
                                        }, this.props.onUpdate)
                                        this.props.enterFlow(node.extras.diagram_id);
                                    }}
                                    options={options}
                                />
                                </React.Fragment>
                        : null}
                    </React.Fragment>
                    : 
                    <React.Fragment>
                        <Button block className="mb-3 btn-lg" onClick={() => this.props.enterFlow(this.state.node.extras.diagram_id)}>
                          <i className="fas fa-clone mr-1"/> Enter Flow
                        </Button>
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
                        <label>Input Variables</label>
                        <DiagramVariables
                            arg1_options={this.props.variables}
                            arg2_options={this.props.diagramVariables}
                            arguments={this.state.node.extras.inputs}
                            onAdd={() => this.handleAddMap('inputs')}
                            onRemove={(i) => this.handleRemoveMap('inputs', i)}
                            handleSelection={(i, arg, value) => this.handleSelection('inputs', i, arg, value)}
                        /> 
                        <hr className="mb-1"/>
                        <label>Output Variables</label>
                        <DiagramVariables
                            reverse
                            arg1_options={this.props.variables}
                            arg2_options={this.props.diagramVariables}
                            arguments={this.state.node.extras.outputs}
                            onAdd={() => this.handleAddMap('outputs')}
                            onRemove={(i) => this.handleRemoveMap('outputs', i)}
                            handleSelection={(i, arg, value) => this.handleSelection('outputs', i, arg, value)}
                        />
                    </React.Fragment>
                }
            </div>
        );
    }
}

const mapStateToProps = state => ({
    diagrams: state.diagrams.diagrams,
    load_diagram: state.diagrams.loading,
    broken: state.diagrams.error,
    diagramVariables: state.diagramVariables.diagramVariables
})

const mapDispatchToProps = dispatch => {
    return {
      setConfirm: confirm => dispatch(setConfirm(confirm))
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(DiagramBlock);
