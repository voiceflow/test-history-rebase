import Button from 'components/Button';
import _ from 'lodash';
import React, { Component } from 'react';

import SetExpression from './components/SetExpression';

class SetBlock extends Component {
  constructor(props) {
    super(props);

    const node = this.props.node;

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

    this.state = {
      node,
    };

    this.onUpdate = this.onUpdate.bind(this);
    this.handleAddBlock = this.handleAddBlock.bind(this);
    this.handleRemoveBlock = this.handleRemoveBlock.bind(this);
    this.handleSelection = this.handleSelection.bind(this);
  }

  onUpdate() {
    this.setState(
      {
        node: this.state.node,
      },
      this.props.onUpdate
    );
  }

  handleAddBlock() {
    const node = this.state.node;
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

      this.setState(
        {
          node,
        },
        this.props.onUpdate
      );
    }
  }

  handleRemoveBlock(i) {
    const node = this.state.node;
    this.props.clearRedo();
    this.props.updateEvents(_.cloneDeep(node).extras, _.cloneDeep(node).ports);
    if (node.extras.sets.length > 1) {
      node.extras.sets.splice(i, 1);

      this.setState(
        {
          node,
        },
        this.props.onUpdate
      );
    }
  }

  handleSelection(i, value) {
    const node = this.state.node;

    if (node.extras.sets[i].variable !== value) {
      node.extras.sets[i].variable = value;

      this.setState(
        {
          node,
        },
        this.props.onUpdate
      );
    }
  }

  render() {
    return (
      <div className="text-center">
        {this.state.node.extras.sets.map((block, i) => {
          return (
            <SetExpression
              key={i}
              block={block}
              onRemove={() => this.handleRemoveBlock(i)}
              onSelection={(selected) => this.handleSelection(i, selected.value)}
              onUpdate={this.onUpdate}
              variables={this.props.variables}
            />
          );
        })}
        {this.state.node.extras.sets.length < 20 ? (
          <Button isBtn isFlatVariable className="mt-1" onClick={this.handleAddBlock}>
            Add Variable Set
          </Button>
        ) : null}
      </div>
    );
  }
}

export default SetBlock;
