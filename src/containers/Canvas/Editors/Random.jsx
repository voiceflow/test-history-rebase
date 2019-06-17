import Button from 'components/Button';
import _ from 'lodash';
import React, { Component } from 'react';
import { Input, InputGroup } from 'reactstrap';

class RandomBlock extends Component {
  constructor(props) {
    super(props);

    this.state = {
      node: this.props.node,
    };

    this.handleAddPath = this.handleAddPath.bind(this);
    this.handleRemovePath = this.handleRemovePath.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleAddPath(e) {
    const node = this.state.node;

    node.extras.paths++;

    const path = node.addOutPort(node.extras.paths);
    path.setMaximumLinks(1);

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

  handleRemovePath() {
    const node = this.state.node;

    if (node.extras.paths <= 1) {
      return;
    }

    const ports = node.getPorts();
    let bestNode;
    if (node.parentCombine) {
      bestNode = _.findIndex(node.parentCombine.combines, ['name', node.name]);
    }
    // eslint-disable-next-line no-restricted-syntax, guard-for-in
    for (const name in ports) {
      const port = node.getPort(name);
      // eslint-disable-next-line no-continue
      if (port.in) continue;

      if (port.label === node.extras.paths) {
        node.removePort(port);
        break;
      }
    }

    node.extras.paths--;
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

  handleInputChange(event) {
    const node = this.state.node;
    node.extras.smart = event.target.checked;
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
    this.props.repaint();
  }

  render() {
    return (
      <div>
        <div>
          <Button isBtn isClear isLarge isBlock className="mt-2" onClick={this.handleAddPath}>
            Add Path
          </Button>
        </div>
        {this.state.node.extras.paths > 1 ? (
          <div className="mt-2">
            <Button isBtn isFlat isLarge isBlock onClick={this.handleRemovePath}>
              Remove Path
            </Button>
          </div>
        ) : null}
        <InputGroup className="my-3">
          <label className="input-group-text w-100 m-0 text-left">
            <Input addon type="checkbox" checked={!!this.state.node.extras.smart} onChange={this.handleInputChange} />
            <span className="ml-3">No duplicates</span>
          </label>
        </InputGroup>
      </div>
    );
  }
}

export default RandomBlock;
