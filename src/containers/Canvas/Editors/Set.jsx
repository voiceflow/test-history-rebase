import _ from 'lodash';
import React, { Component } from 'react';

import Button from '@/components/Button';

import SetExpression from './components/SetExpression';

class SetBlock extends Component {
  constructor(props) {
    super(props);

    const { node } = props;

    if (!Array.isArray(node.extras.sets) || node.extras.sets.length === 0) {
      node.extras.sets = [
        {
          variable: null,
          expression: {
            type: 'value',
            value: '',
            depth: 0,
          },
        },
      ];
    }

    this.state = { node };
  }

  onUpdate = () => this.setState({ node: this.state.node }, this.props.onUpdate);

  handleAddBlock = () => {
    const { node } = this.state;

    this.props.clearRedo();
    this.props.updateEvents(_.cloneDeep(node).extras, _.cloneDeep(node).ports);

    if (node.extras.sets.length < 20) {
      node.extras.sets.push({
        variable: null,
        expression: {
          type: 'value',
          value: '',
          depth: 0,
        },
      });

      this.onUpdate();
    }
  };

  handleRemoveBlock(index) {
    const { node } = this.state;

    this.props.clearRedo();
    this.props.updateEvents(_.cloneDeep(node).extras, _.cloneDeep(node).ports);

    if (node.extras.sets.length > 1) {
      node.extras.sets.splice(index, 1);

      this.onUpdate();
    }
  }

  handleSelection(index, value) {
    const { node } = this.state;

    if (node.extras.sets[index].variable !== value) {
      node.extras.sets[index].variable = value;

      this.onUpdate();
    }
  }

  render() {
    const { variables } = this.props;
    const { node } = this.state;

    return (
      <>
        <div id="set-container">
          {node.extras.sets.map((block, index) => (
            <SetExpression
              key={index}
              block={block}
              onRemove={() => this.handleRemoveBlock(index)}
              onSelection={(selected) => this.handleSelection(index, selected.value)}
              onUpdate={this.onUpdate}
              variables={variables}
            />
          ))}
        </div>
        {node.extras.sets.length < 20 && (
          <div className="text-center mt-3">
            <Button isBtn isFlatVariable onClick={this.handleAddBlock}>
              Add Variable Set
            </Button>
          </div>
        )}
      </>
    );
  }
}

export default SetBlock;
