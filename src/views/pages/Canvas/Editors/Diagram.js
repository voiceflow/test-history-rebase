import React, { Component } from 'react';
import {Button} from 'reactstrap';
import axios from 'axios';
import Select from 'react-select';
import DiagramVariables from './components/DiagramVariables';
// import Expressionfy from './components/Expressionfy';

class DiagramBlock extends Component {
    constructor(props) {
        super(props);

        // state.variables is for variables of the diagram linked
        // props.variables is for variables of the current diagram
        this.state = {
            node: this.props.node,
            variables: []
        };

        this.onUpdate = this.onUpdate.bind(this);
        this.handleAddMap = this.handleAddMap.bind(this);
        this.handleRemoveMap = this.handleRemoveMap.bind(this);
        this.handleSelection = this.handleSelection.bind(this);
    }

    componentWillMount() {
        this.getDiagramVariables();
    }

    getDiagramVariables(){
        let diagram_id = this.state.node.extras.diagram_id;
        // diagram_id = '5f33383b-a9a8-4a85-9fa5-16bdad17b37f';

        if(diagram_id){
            if(diagram_id){
                axios.get(`/diagram/${diagram_id}/variables`)
                .then(res => {
                    if(Array.isArray(res.data)){
                        this.setState({
                            variables: res.data
                        });
                    }
                })
                .catch(err => {
                    console.error(err);
                });
            }
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
        let options;
        if(!this.state.node.extras.diagram_id){
            options = this.props.diagrams
            .filter(diagram => diagram.name !== 'ROOT')
            .map(diagram => {
                return {
                    value: diagram.id,
                    label: diagram.name
                }
            });
        }

        let block
        if(this.state.node.extras.diagram_id){
            block = this.props.diagrams.find(d => d.id === this.state.node.extras.diagram_id)
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
                        <Button className="btn-primary w-100" onClick={() => this.props.createDiagram(this.state.node)}>
                            Create New Flow <i className="fas fa-sign-in"/>
                        </Button>
                    </React.Fragment>
                    : 
                    <React.Fragment>
                        <div className="text-center">
                            <h4><i className="fal fa-sign-in"/> {block ? block.name : 'New Flow'}</h4>
                        </div>
                        <Button block onClick={() => this.props.enterFlow(this.state.node.extras.diagram_id)}>Enter Flow</Button>
                        <label>Input Variables</label>
                        <DiagramVariables
                            arg1_options={this.props.variables}
                            arg2_options={this.state.variables}
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
                            arg2_options={this.state.variables}
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

export default DiagramBlock;
