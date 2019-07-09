import cn from 'classnames';
import _ from 'lodash';
import randomstring from 'randomstring';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import ChoiceInputs from './components/ChoiceInputs';

export class Choice extends Component {
  constructor(props) {
    super(props);

    // ensure choices/inputs maintain consistency (this is done for backwards compatiability)
    if (!Array.isArray(props.node.extras.choices) || props.node.extras.choices.length !== props.node.extras.inputs.length) {
      props.node.extras.choices = new Array(props.node.extras.inputs.length).fill(null);
    }

    props.node.extras.choices = props.node.extras.choices.map((c) =>
      c && c.key
        ? c
        : {
            open: false,
            key: randomstring.generate(5),
          }
    );

    this.state = {
      node: props.node,
      voices: Array.isArray(props.voices) ? props.voices : [],
    };
  }

  handleChange = (text, key) => {
    const { node } = this.state;

    node.extras.inputs[key] = text;

    if (node.parentCombine) {
      const bestNode = _.findIndex(node.parentCombine.combines, ['id', node.id]);
      node.parentCombine.combines[bestNode] = node;
    }

    this.setState({ node }, this.props.onUpdate);
    this.props.repaint();
  };

  handleAddChoice = () => {
    const { node } = this.state;

    this.props.clearRedo();
    this.props.updateEvents(_.cloneDeep(node).extras, _.cloneDeep(node).ports);

    node.extras.inputs.push('');
    node.extras.choices.push({
      open: true,
      key: randomstring.generate(5),
    });

    const test = node.addOutPort(node.extras.inputs.length);
    test.setMaximumLinks(1);

    if (node.parentCombine) {
      const bestNode = _.findIndex(node.parentCombine.combines, ['id', node.id]);
      node.parentCombine.combines[bestNode] = node;
    }

    this.setState({ node }, this.props.onUpdate);
    this.props.repaint();
  };

  handleRemoveChoice = (i) => {
    const { node } = this.state;

    this.props.clearRedo();
    this.props.updateEvents(_.cloneDeep(node).extras, _.cloneDeep(node).ports);

    let bestNode;
    if (node.parentCombine) {
      bestNode = _.findIndex(node.parentCombine.combines, ['id', node.id]);
    }
    // eslint-disable-next-line no-restricted-syntax, guard-for-in
    for (const name in node.getPorts()) {
      const port = node.getPort(name);

      if (port.label === node.extras.inputs.length) {
        node.removePort(port);
        break;
      }
    }

    node.extras.choices.splice(i, 1);
    node.extras.inputs.splice(i, 1);

    if (node.parentCombine) {
      node.parentCombine.combines[bestNode] = node;
    }

    this.setState({ node }, this.props.onUpdate);
    this.props.repaint();
  };

  render() {
    const { live_mode } = this.props;
    const { node } = this.state;

    return (
      <div className={cn({ 'disabled-overlay': live_mode })}>
        <ChoiceInputs
          choices={node.extras.choices}
          inputs={node.extras.inputs}
          onAdd={this.handleAddChoice}
          onRemove={this.handleRemoveChoice}
          onChange={this.handleChange}
          live_mode={live_mode}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  live_mode: state.skills.live_mode,
});
export default connect(mapStateToProps)(Choice);
