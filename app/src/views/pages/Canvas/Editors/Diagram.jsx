import React, { Component } from 'react';
import {Button, Alert} from 'reactstrap';
import { connect } from 'react-redux';
import Select from 'react-select';

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
                    value: diagram.id,
                    label: diagram.name
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
                        {this.props.diagrams && this.props.diagrams.length > 0 ? 
                            <React.Fragment>
                                <label>Select Existing Flow</label>
                                <Select
                                    classNamePrefix="select-box"
                                    onChange={(selected) => {
                                        let node = this.state.node;
                                        node.extras.diagram_id = selected.value;
                                        this.props.enterFlow(selected.value);
                                    }}
                                    options={options}
                                />
                                <hr className="mb-1"/>
                                </React.Fragment>
                        : null}
                        <label>Create a New Flow</label>
                        <Button className="btn-primary btn-block btn-lg btn btn-secondary" onClick={() => this.props.createDiagram(this.state.node)}>
                            Create New Flow <i className="fas fa-sign-in"/>
                        </Button>
                    </React.Fragment>
                    : 
                    <React.Fragment>
                        <Button className="btn-primary btn-block btn-lg btn btn-secondary mb-3" block onClick={() => this.props.enterFlow(this.state.node.extras.diagram_id)}>Enter Flow</Button>
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

export default connect(mapStateToProps)(DiagramBlock);
