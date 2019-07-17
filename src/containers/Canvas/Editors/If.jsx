import _ from 'lodash';
import React, { Component } from 'react';

import Button from '@/components/Button';

import Expression from './components/Expression';
import Expressionfy from './components/Expressionfy';

const BLOCK_LIMIT = 22;

class IfBlock extends Component {
  constructor(props) {
    super(props);

    const node = this.props.node;

    if (!Array.isArray(node.extras.expressions)) {
      node.extras.expressions = [];
    }

    this.state = {
      node,
    };

    this.onUpdate = this.onUpdate.bind(this);
    this.handleAddBlock = this.handleAddBlock.bind(this);
    this.handleRemoveBlock = this.handleRemoveBlock.bind(this);
  }

  onUpdate() {
    this.forceUpdate();
    this.props.onUpdate();
  }

  handleAddBlock(e) {
    const node = this.state.node;
    this.props.clearRedo();
    this.props.updateEvents(_.cloneDeep(node).extras, _.cloneDeep(node).ports);

    if (node.extras.expressions.length < BLOCK_LIMIT) {
      node.extras.expressions.push({
        type: 'equals',
        depth: 0,
        value: [
          {
            type: 'variable',
            value: null,
            depth: 1,
          },
          {
            type: 'value',
            value: '',
            depth: 1,
          },
        ],
      });

      // Remove the else port and add it back in so that it is always on the bottom
      // for (var name in node.getPorts()) {
      //     let port = node.getPort(name);
      //     if (port.label === 'else') {
      //         elseport = port;
      //         node.removePort(port, false);
      //         break;
      //     }
      // }

      node.addOutPort(node.extras.expressions.length).setMaximumLinks(1);
      if (node.parentCombine) {
        const bestNode = _.findIndex(node.parentCombine.combines, ['id', node.id]);
        node.parentCombine.combines[bestNode] = node;
      }
      this.setState(
        {
          node,
        },
        this.props.onUpdate
      );
      // this.props.diagramEngine.setSuperSelect(node.parentCombine);
      this.props.repaint();
      e.preventDefault();
    }
  }

  handleRemoveBlock(i) {
    const node = this.state.node;
    this.props.clearRedo();
    this.props.updateEvents(_.cloneDeep(node).extras, _.cloneDeep(node).ports);

    if (node.extras.expressions.length > 1) {
      let bestNode;
      if (node.parentCombine) {
        bestNode = _.findIndex(node.parentCombine.combines, ['name', node.name]);
      }
      // eslint-disable-next-line guard-for-in, no-restricted-syntax
      for (const name in node.getPorts()) {
        const port = node.getPort(name);

        if (port.label === node.extras.expressions.length) {
          node.removePort(port);
          break;
        }
      }

      node.extras.expressions.splice(i, 1);
      if (node.parentCombine) {
        node.parentCombine.combines[bestNode] = node;
      }
      this.setState(
        {
          node,
        },
        this.props.onUpdate
      );

      this.props.repaint();
    }
  }

  render() {
    return (
      <>
        <small className="text-muted">If statements are evaluated in numerical order</small>
        {this.state.node.extras.expressions.map((expression, i) => {
          const show = !(expression.type === 'value' || expression.type === 'variable' || expression.type === 'advance');

          return (
            <div key={i} className="conditional-wrapper">
              {this.state.node.extras.expressions.length > 1 ? <div className="close" onClick={() => this.handleRemoveBlock(i)} /> : null}
              <div className="variable-group">
                <div className="number-bubble mr-2">{i + 1}</div>
                <span>If </span>
              </div>
              {show ? <Expressionfy expression={expression} /> : null}
              <Expression expression={expression} variables={this.props.variables} onUpdate={this.onUpdate} />
            </div>
          );
        })}

        {this.state.node.extras.expressions.length < BLOCK_LIMIT ? (
          <div className="text-center mt-3">
            <Button isFlatVariable onClick={this.handleAddBlock}>
              Add If Statement
            </Button>
          </div>
        ) : (
          <div className="text-center mt-4">Maximum options reached</div>
        )}
      </>
    );
  }
}

export default IfBlock;
