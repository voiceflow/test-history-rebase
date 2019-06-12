import randomstring from 'randomstring';
import React, { Component } from 'react';

import APIMapping from './APIMapping';

class APIMappingContained extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mapping: this.props.mapping,
    };

    this.handleAddPairMapping = this.handleAddPairMapping.bind(this);
    this.handleRemovePairMapping = this.handleRemovePairMapping.bind(this);
    this.handleKVMappingChange = this.handleKVMappingChange.bind(this);
  }

  handleAddPairMapping() {
    const mapping = this.state.mapping;
    this.props.clearRedo();
    this.props.updateEvents();

    mapping.push({
      index: randomstring.generate(10),
      path: '',
      var: '',
    });

    this.setState({
      mapping,
    });
    this.props.onChange();
  } // For variable mapping fields

  handleRemovePairMapping(i) {
    const mapping = this.state.mapping;
    this.props.clearRedo();
    this.props.updateEvents();

    mapping.splice(i, 1);

    this.setState({
      mapping,
    });
    this.props.onChange();
  }

  handleKVMappingChange(new_value, i, inputType) {
    const mapping = this.state.mapping;
    this.props.clearRedo();
    this.props.updateEvents();
    mapping[i][inputType] = new_value;
    this.setState({
      mapping,
    });
    this.props.onChange();
  }

  render() {
    return (
      <APIMapping
        pairs={this.state.mapping}
        onAdd={() => this.handleAddPairMapping()}
        onRemove={(e, i) => this.handleRemovePairMapping(i)}
        onChange={this.handleKVMappingChange}
        variables={this.props.variables}
      />
    );
  }
}

export default APIMappingContained;
