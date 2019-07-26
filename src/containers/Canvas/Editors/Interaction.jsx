import cn from 'classnames';
import _ from 'lodash';
import randomstring from 'randomstring';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, ButtonGroup } from 'reactstrap';

import PlatformTooltip from '@/components/Tooltips/PlatformTooltip';
import { setCanFulfill, updateIntents } from '@/ducks/version';

import ChoiceDropdownInputs from './components/ChoiceDropdownInputs';
import IntentInputs from './components/IntentInputs';
import SlotInputs from './components/SlotInputs';

export class Interaction extends Component {
  constructor(props) {
    super(props);

    this.state = {
      node: this.props.node,
      tab: 'choices',
    };

    this.handleChoicesChange = this.handleChoicesChange.bind(this);
    this.handleAddChoice = this.handleAddChoice.bind(this);
    this.handleRemoveChoice = this.handleRemoveChoice.bind(this);
    this.renderTab = this.renderTab.bind(this);

    this.update = this.update.bind(this);
  }

  update() {
    this.forceUpdate();
    this.props.updateIntents();
    this.props.updateLinter();
  }

  handleChoicesChange(choices) {
    const node = this.state.node;
    const extras = node.extras[this.props.platform];
    extras.choices = choices;

    this.setState({
      node,
    });
    if (node.parentCombine) {
      const bestNode = _.findIndex(node.parentCombine.combines, ['id', node.id]);
      node.parentCombine.combines[bestNode] = node;
    }
    this.props.updateIntents();
    this.props.updateLinter();
    this.props.repaint();
  }

  handleAddChoice() {
    const node = this.state.node;
    this.props.clearRedo();
    this.props.updateEvents(_.cloneDeep(node).extras, _.cloneDeep(node).ports);
    const g_extras = node.extras.google;
    const a_extras = node.extras.alexa;

    const g_choices = g_extras.choices;
    const a_choices = a_extras.choices;

    const key = randomstring.generate(12);

    g_choices.push({ intent: null, mappings: [], key, open: true });
    a_choices.push({ intent: null, mappings: [], key, open: true });

    const test = node.addOutPort(a_choices.length);
    test.setMaximumLinks(1);
    if (node.parentCombine) {
      const bestNode = _.findIndex(node.parentCombine.combines, ['id', node.id]);
      node.parentCombine.combines[bestNode] = node;
    }

    this.setState(
      {
        node,
      },
      this.props.updateIntents
    );
    this.props.updateLinter();
    // this.props.diagramEngine.setSuperSelect(node.parentCombine);
    this.props.repaint();
  }

  handleRemoveChoice(i) {
    const node = this.state.node;
    this.props.clearRedo();
    this.props.updateEvents(_.cloneDeep(node).extras, _.cloneDeep(node).ports);
    const g_extras = node.extras.google;
    const a_extras = node.extras.alexa;

    const g_choices = g_extras.choices;
    const a_choices = a_extras.choices;

    let bestNode;
    if (node.parentCombine) {
      bestNode = _.findIndex(node.parentCombine.combines, ['name', node.name]);
    }

    // eslint-disable-next-line no-restricted-syntax, guard-for-in
    for (const name in node.getPorts()) {
      const port = node.getPort(name);

      if (port.label === a_choices.length) {
        node.removePort(port);
        break;
      }
    }

    a_choices.splice(i, 1);
    g_choices.splice(i, 1);

    if (node.parentCombine) {
      node.parentCombine.combines[bestNode] = node;
    }
    this.setState({
      node,
    });
    this.props.updateIntents();
    this.props.updateLinter();
    this.props.repaint();
  }

  renderTab() {
    const node = this.state.node;
    const extras = node.extras[this.props.platform];

    switch (this.state.tab) {
      case 'choices':
        return (
          <>
            <div className="d-flex justify-content-between">
              <label>Choices</label>
              <PlatformTooltip platform={this.props.platform} field="Interaction choices" />
            </div>
            <ChoiceDropdownInputs
              choices={extras.choices}
              onAdd={this.handleAddChoice}
              onRemove={this.handleRemoveChoice}
              onChange={this.handleChoicesChange}
              intents={this.props.intents}
              variables={this.props.variables}
              slots={this.props.slots}
              built_ins={this.props.built_ins}
              update={this.update}
              platform={this.props.platform}
              live_mode={this.props.live_mode}
            />
          </>
        );
      case 'intents':
        return (
          <>
            <label>Intents</label>
            <IntentInputs
              intents={this.props.intents}
              onAdd={this.props.handleAddIntent}
              onRemove={this.props.handleRemoveIntent}
              slots={this.props.slots}
              update={this.update}
              platform={this.props.platform}
              live_mode={this.props.live_mode}
              clearRedo={this.props.clearRedo}
              updateEvents={this.props.updateEvents}
              setCanFulfill={this.props.setCanFulfill}
            />
          </>
        );
      case 'slots':
        return (
          <>
            <label>Slots</label>
            <SlotInputs
              intents={this.props.intents}
              slots={this.props.slots}
              slot_types={this.props.slot_types}
              update={this.update}
              platform={this.props.platform}
              live_mode={this.props.live_mode}
            />
          </>
        );
      default:
        return null;
    }
  }

  render() {
    return (
      <>
        <ButtonGroup className="toggle-group mb-2">
          <Button
            outline={this.state.tab !== 'choices'}
            onClick={() => {
              this.setState({ tab: 'choices' });
              this.props.clearEvents();
            }}
            disabled={this.state.tab === 'choices'}
          >
            Choices
          </Button>
          <Button
            outline={this.state.tab !== 'intents'}
            onClick={() => {
              this.setState({ tab: 'intents' });
              this.props.clearEvents();
            }}
            disabled={this.state.tab === 'intents'}
          >
            Intents
          </Button>
          <Button
            outline={this.state.tab !== 'slots'}
            onClick={() => {
              this.setState({ tab: 'slots' });
              this.props.clearEvents();
            }}
            disabled={this.state.tab === 'slots'}
          >
            Slots
          </Button>
        </ButtonGroup>
        <div className={cn({ 'disabled-overlay': this.props.live_mode })}>{this.renderTab()}</div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  intents: state.skills.skill.intents,
  slots: state.skills.skill.slots,
});

const mapDispatchToProps = (dispatch) => {
  return {
    updateIntents: () => dispatch(updateIntents()),
    setCanFulfill: (key, val) => dispatch(setCanFulfill(key, val)),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Interaction);
