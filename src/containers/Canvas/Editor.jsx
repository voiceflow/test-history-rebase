import cn from 'classnames';
import Button from 'components/Button';
import { ModalHeader } from 'components/Modals/ModalHeader';
import Prompt from 'components/Uploads/Prompt';
// HOCs
import { redo, undo } from 'hocs/withUndoRedo';
import _ from 'lodash';
import Mousetrap from 'mousetrap';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import CreatableSelect from 'react-select/lib/Creatable';
import { Alert, DropdownItem, DropdownMenu, DropdownToggle, Modal, ModalBody, UncontrolledDropdown } from 'reactstrap';
import { compose } from 'recompose';

import { BUILT_IN_INTENTS_ALEXA, BUILT_IN_INTENTS_GOOGLE, SLOT_TYPES } from 'Constants';

import API from './Editors/API';
import CancelPayment from './Editors/CancelPayment';
import Capture from './Editors/Capture';
import Card from './Editors/Card';
import Choice from './Editors/Choice';
import Code from './Editors/Code';
import Command from './Editors/Command';
import Diagram from './Editors/Diagram';
import Display from './Editors/Display';
import IfBlock from './Editors/If';
import Integrations from './Editors/Integrations';
import Intent from './Editors/Intent';
import Interaction from './Editors/Interaction';
import Line from './Editors/Line';
import Mail from './Editors/Mail';
import Module from './Editors/Module';
import OldCommand from './Editors/OldCommand';
import OldIfBlock from './Editors/OldIf';
import OldSpeak from './Editors/OldSpeak';
import Payment from './Editors/Payment';
import PermissionCard from './Editors/PermissionCard';
import Permissions from './Editors/Permissions';
import Random from './Editors/Random';
import Reminder from './Editors/Reminder';
import SetBlock from './Editors/Set';
import Speak from './Editors/Speak';
import Stream from './Editors/Stream';
import Variable from './Editors/Variable';

const CMD_Z = 'command+z';
const CTRL_Z = 'ctrl+z';
const CTRL_SHIFT_Z = 'ctrl+shift+z';
const CMD_Y = 'command+y';
const CTRL_Y = 'ctrl+y';
const CMD_SHIFT_Z = 'command+shift+z';

const ALEXA_BUILT_INS =
  BUILT_IN_INTENTS_ALEXA &&
  BUILT_IN_INTENTS_ALEXA.map((intent) => {
    return {
      built_in: true,
      platform: 'alexa',
      name: intent.name,
      key: intent.name,
      inputs: [
        {
          text: '',
          slots: intent.slots,
        },
      ],
    };
  });

const GOOGLE_BUILT_INS =
  BUILT_IN_INTENTS_GOOGLE &&
  BUILT_IN_INTENTS_GOOGLE.map((intent) => {
    return {
      built_in: true,
      platform: 'google',
      name: intent.name,
      key: intent.name,
      inputs: [
        {
          text: '',
          slots: intent.slots,
        },
      ],
    };
  });

class Editor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      node: props.node,
      templates: [],
      account_linking: {},
      modal: false,
      expanded: false,
      error: null,
      confirm: null,
      chipsInput: '',
    };

    this.eventHandler = this.eventHandler.bind(this);
    this.getSlotTypes = this.getSlotTypes.bind(this);
    this.BlockViewer = this.BlockViewer.bind(this);
    this.renderTitle = this.renderTitle.bind(this);
    this.toggleReprompt = this.toggleReprompt.bind(this);
    this.undo = this.undo.bind(this);
    this.redo = this.redo.bind(this);
    this.EditorRender = this.EditorRender.bind(this);
    this.updateExtras = this.updateExtras.bind(this);
  }

  componentDidMount() {
    Mousetrap.reset();
    Mousetrap.bind([CTRL_Z, CMD_Z], this.undo);
    Mousetrap.bind([CTRL_Y, CMD_Y, CTRL_SHIFT_Z, CMD_SHIFT_Z], this.redo);
  }

  static getDerivedStateFromProps(props, state) {
    if (state.node && props.node && state.node.id !== props.node.id) {
      props.clearRedo();
      props.clearUndo();
    }
    return {
      node: props.node,
    };
  }

  undo() {
    if (!_.isEmpty(this.props.undoEvents) && this.state.node) {
      const recent = _.last(this.props.undoEvents);
      this.props.addRedo({
        node: _.cloneDeep(this.state.node.extras),
        eventType: _.cloneDeep(this.state.node.ports),
      });
      const node = this.state.node;
      node.extras = recent.node;
      if (recent.eventType) {
        let diff = _.difference(_.keys(node.ports), _.keys(recent.eventType));
        if (!_.isEmpty(diff)) {
          node.removePort(node.ports[_.last(diff)]);
        } else {
          diff = _.difference(_.keys(recent.eventType), _.keys(node.ports));
          if (!_.isEmpty(diff)) {
            node.addOutPort(recent.eventType[_.last(diff)].label);
          }
        }
      }
      this.props.removeUndo();
      this.props.onUpdate();
      this.props.diagramEngine.enableRepaintEntities([this.state.node]);
      this.props.diagramEngine.repaintCanvas(false);
    }
    // e.stopPropagation();
    // e.preventDefault()
  }

  redo(e) {
    if (!_.isEmpty(this.props.redoEvents) && this.state.node) {
      const recent = _.last(this.props.redoEvents);
      this.props.addUndo(_.cloneDeep(this.state.node.extras), _.cloneDeep(this.state.node.ports));
      const node = this.state.node;
      node.extras = recent.node;
      if (recent.eventType) {
        let diff = _.difference(_.keys(recent.eventType), _.keys(node.ports));
        if (!_.isEmpty(diff)) {
          node.addOutPort(recent.eventType[_.last(diff)].label);
        } else {
          diff = _.difference(_.keys(node.ports), _.keys(recent.eventType));
          node.removePort(node.ports[_.last(diff)]);
        }
        // node.ports = recent.eventType;
      }
      this.props.removeRedo();
      // this.props.onUpdate()
      this.props.diagramEngine.enableRepaintEntities([this.state.node]);
      this.props.diagramEngine.repaintCanvas(false);
    }
    e.stopPropagation();
    e.preventDefault();
  }

  handleChange(e) {
    const node = this.state.node;
    const name = e.target.getAttribute('name');
    const value = e.target.value;
    node[name] = value;
    if (node.parentCombine) {
      _.find(node.parentCombine.combines, ['id', node.id]).name = value;
    }
    this.setState(
      {
        node,
      },
      () => {
        this.props.onUpdate();
        if (name === 'name') {
          this.props.repaint();
        }
      }
    );
  }

  getSlotTypes(locales, filter) {
    let slots = [SLOT_TYPES[0]]; // Custom Slot
    // eslint-disable-next-line no-restricted-syntax
    for (const slot of Object.values(SLOT_TYPES)) {
      // eslint-disable-next-line no-continue
      if (filter && filter === slot.label) continue;
      // eslint-disable-next-line no-continue
      if (!slot.type[this.props.platform]) continue;

      const slot_locales = slot.locales[this.props.platform];

      switch (this.props.platform) {
        case 'google':
          // eslint-disable-next-line no-case-declarations
          const google_info = this.props.google_publish_info;
          if (!(google_info && google_info.main_locale && !slot_locales.includes(google_info.main_locale))) slots.push(slot);
          break;
        case 'alexa':
          if (!slot_locales || (locales && _.intersection(slot_locales, locales).length === locales.length)) {
            slots.push(slot);
          }
          break;
        default:
          break;
      }
    }

    slots = slots.slice(0, 1).concat(
      slots.slice(1).sort((a, b) => {
        if (a.type.google && a.type.alexa && !(b.type.google && b.type.alexa)) {
          return -1;
        }
        if (b.type.google && b.type.alexa && !(a.type.google && a.type.alexa)) {
          return 1;
        }
        return a.label.localeCompare(b.label);
      })
    );
    return slots.map((type) => {
      let value;
      if ((type.type.alexa && type.type.google) || (!type.type.alexa && !type.type.google)) {
        value = type.label;
      } else if (type.type.alexa && !type.type.google) {
        value = type.type.alexa;
      } else if (!type.type.alexa && type.type.google) {
        value = type.type.google;
      }

      return { label: type.label, value };
    });
  }

  BlockViewer(variables) {
    switch (this.state.node.extras.type) {
      case 'story':
        return;
      case 'choice':
      case 'choicenew':
        return <Choice diagramEngine={this.props.diagramEngine} repaint={this.props.repaint} />;
      case 'intent':
        return (
          <Intent
            diagramEngine={this.props.diagramEngine}
            updateLinter={this.props.updateLinter}
            slot_types={this.getSlotTypes(this.props.locales)}
            built_ins={this.props.platform === 'google' ? GOOGLE_BUILT_INS : ALEXA_BUILT_INS}
            history={this.props.history}
            diagram_level_intents={this.props.diagram_level_intents}
            platform={this.props.platform}
          />
        );
      case 'command':
        // DEPRECATE OLD COMMAND BLOCKS
        if (typeof this.state.node.extras.commands === 'string') {
          return <OldCommand />;
        }
        return (
          <Command
            slot_types={this.getSlotTypes(this.props.locales)}
            updateLinter={this.props.updateLinter}
            built_ins={this.props.platform === 'google' ? GOOGLE_BUILT_INS : ALEXA_BUILT_INS}
            repaint={this.props.repaint}
            createDiagram={this.props.createDiagram}
            enterFlow={this.props.enterFlow}
            platform={this.props.platform}
            diagram_level_intents={this.props.diagram_level_intents}
          />
        );

      case 'interaction':
        return (
          <Interaction
            repaint={this.props.repaint}
            updateLinter={this.props.updateLinter}
            clearEvents={() => {
              this.props.clearRedo();
              this.props.clearUndo();
            }}
            onSlot={this.props.onSlot}
            onIntent={this.props.onIntent}
            diagramEngine={this.props.diagramEngine}
            slot_types={this.getSlotTypes(this.props.locales)}
            built_ins={this.props.platform === 'google' ? GOOGLE_BUILT_INS : ALEXA_BUILT_INS}
            onConfirm={this.props.onConfirm}
            platform={this.props.platform}
          />
        );
      case 'combine':
      case 'line':
      case 'audio':
      case 'multiline':
        // DEPRECATE OLD LINE BLOCKS
        if (this.state.node.extras.type !== 'combine') {
          const node = this.state.node;
          node.extras.type = 'combine';
          this.setState({ node });
        }
        return <Line />;
      case 'set':
        return <SetBlock />;
      case 'variable':
        return <Variable />;
      case 'if':
        // DEPRECATE OLD IF BLOCK
        if (this.state.node.extras.expressions) {
          return <IfBlock diagramEngine={this.props.diagramEngine} repaint={this.props.repaint} />;
        }
        return <OldIfBlock repaint={this.props.repaint} />;

      case 'random':
        return <Random diagramEngine={this.props.diagramEngine} repaint={this.props.repaint} />;
      case 'speak':
        // DEPRECATE OLD SPEAK BLOCKS
        if (this.state.node.extras.raw !== undefined) {
          return <OldSpeak />;
        }
        return <Speak />;

      case 'card':
        return <Card />;
      case 'capture':
        return (
          <Capture
            slot_types={this.getSlotTypes(this.props.locales, 'SearchQuery')}
            platform={this.props.platform}
            node={this.state.node}
            onUpdate={this.props.onUpdate}
            variables={variables}
          />
        );
      case 'flow':
        return (
          <Diagram
            node={this.state.node}
            onUpdate={this.props.onUpdate}
            variables={variables}
            createDiagram={this.props.createDiagram}
            enterFlow={this.props.enterFlow}
          />
        );
      case 'api':
        return <API />;
      case 'integrations':
        return <Integrations onUpdate={this.props.onUpdate} variables={variables} editorOpen={this.props.open} />;
      case 'payment':
        return <Payment history={this.props.history} createProduct={this.props.createProduct} editProduct={this.props.editProduct} />;
      case 'cancel':
        return <CancelPayment createProduct={this.props.createProduct} editProduct={this.props.editProduct} />;
      case 'module':
        return <Module user_modules={this.props.user_modules} />;
      case 'mail':
        return <Mail />;
      case 'display':
        return <Display />;
      case 'stream':
        return (
          <Stream
            diagramEngine={this.props.diagramEngine}
            forceRepaint={this.props.forceRepaint}
            repaint={this.props.repaint}
            platform={this.props.platform}
          />
        );
      case 'permissions':
        return <Permissions />;
      case 'exit':
        return <Alert>This block ends the skill in its current flow and state</Alert>;
      case 'reminder':
        return <Reminder />;
      case 'permission':
        return <PermissionCard />;
      case 'code':
        return <Code />;
      default:
        return null;
    }
  }

  titleInput() {
    switch (this.state.node.extras.type) {
      case 'story':
        return <div id="label">Start Block</div>;
      case 'module':
        return <div id="label">{this.state.node.name}</div>;
      case 'flow':
        if (this.state.node.extras.diagram_id) {
          const block = this.props.diagrams.find((d) => d.id === this.state.node.extras.diagram_id);
          if (block && block.name !== this.state.node.name) {
            const node = this.state.node;
            node.name = block.name;
          }
          return <div id="label">{block ? block.name : 'New Flow'}</div>;
        }
        return <div id="label">Add Flow</div>;
      default:
        return (
          <input
            id="label"
            placeholder="Block Label"
            type="text"
            name="name"
            value={this.state.node.name}
            onChange={this.handleChange.bind(this)}
            onKeyPress={(e) => {
              if (e.charCode === 13) {
                e.preventDefault();
              }
            }}
          />
        );
    }
  }

  renderTitle() {
    return (
      <div className="label-container d-flex mb-3 pl-2">
        <div className="w-100 dropdown text-left">{this.titleInput()}</div>
        <i className="more-info dropdown d-flex align-items-center" onClick={() => this.props.setHelp({ type: this.state.node.extras.type })} />
        <UncontrolledDropdown nav inNavbar>
          <DropdownToggle nav tag="div">
            <div className="cog" />
          </DropdownToggle>
          <DropdownMenu right className="arrow arrow-right no-select" style={{ right: 2, marginTop: -10 }}>
            <DropdownItem header>Block Options</DropdownItem>
            {['interaction', 'choice', 'capture'].includes(this.state.node.extras.type) && !this.state.node.extras.reprompt && (
              <DropdownItem onClick={this.toggleReprompt}>Reprompt</DropdownItem>
            )}
            {['interaction', 'choice', 'capture', 'stream'].includes(this.state.node.extras.type) &&
              this.props.platform === 'google' &&
              !this.state.node.extras.chips && <DropdownItem onClick={this.toggleChips}>Chips</DropdownItem>}
            <DropdownItem
              onClick={() =>
                this.setState({
                  expanded: true,
                  modal: true,
                })
              }
              className="pointer"
            >
              Expand
            </DropdownItem>
            <DropdownItem
              onClick={() => (this.props.node.parentCombine ? this.props.appendCombineNode(this.state.node) : this.props.copyNode())}
              className="pointer"
            >
              Duplicate
            </DropdownItem>
            <DropdownItem
              onClick={() => (this.props.node.parentCombine ? this.props.removeCombineNode(this.state.node) : this.props.removeNode())}
              className="pointer"
            >
              Delete
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      </div>
    );
  }

  eventHandler(e) {
    if (this.props.preview) {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  toggleReprompt() {
    const node = this.state.node;
    if (node.extras.reprompt) {
      delete node.extras.reprompt;
    } else {
      node.extras.reprompt = {
        voice: 'Alexa',
        content: '',
      };
    }
    this.setState({ node });
  }

  toggleChips = () => {
    const node = this.state.node;
    if (node.extras.chips) {
      delete node.extras.chips;
    } else {
      node.extras.chips = [];
    }
    this.setState({ node, chipsInput: '' });
  };

  handleChipsInputKeyDown = (event) => {
    const { chipsInput } = this.state;
    if (!chipsInput || !chipsInput.trim()) return;
    switch (event.key) {
      case 'Enter':
      case 'Tab':
        // eslint-disable-next-line no-case-declarations
        const node = this.state.node;
        node.extras.chips = [
          ...node.extras.chips,
          {
            label: chipsInput,
            value: chipsInput,
          },
        ];
        this.setState({
          chipsInput: '',
          node,
        });
        event.preventDefault();
        break;
      default:
        break;
    }
  };

  updateExtras(extras, callback) {
    const node = this.state.node;
    node.extras = extras;
    if (node.parentCombine) {
      const bestNode = _.findIndex(node.parentCombine.combines, ['id', node.id]);
      node.parentCombine.combines[bestNode] = node;
    }
    this.forceUpdate(callback);
  }

  EditorRender() {
    let variables = this.props.global_variables.concat(this.props.variables);
    variables = variables.concat(['Create Variable']);
    return (
      <React.Fragment>
        {this.BlockViewer(variables) &&
          React.cloneElement(this.BlockViewer(variables), {
            node: this.state.node,
            extras: this.props.node.extras,
            onUpdate: this.props.onUpdate,
            updateEvents: this.props.addUndo,
            clearRedo: this.props.clearRedo,
            variables,
            updateExtras: this.updateExtras,
          })}
        {this.state.node.extras.reprompt && (
          <React.Fragment>
            <hr />
            <div className="space-between">
              <label>Custom Reprompt</label>
              <Button className="close" onClick={this.toggleReprompt} />
            </div>
            <Prompt
              placeholder="Sorry I didn't get that! Do you like this or that?"
              voice={this.state.node.extras.reprompt.voice}
              content={this.state.node.extras.reprompt.content}
              updatePrompt={(prompt) => {
                const node = this.state.node;
                if (node && node.extras && node.extras.reprompt) {
                  node.extras.reprompt = { ...node.extras.reprompt, ...prompt };
                  this.setState({ node });
                }
              }}
            />
          </React.Fragment>
        )}
        {this.state.node.extras.chips && this.props.platform === 'google' && (
          <React.Fragment>
            <hr />
            <div className="space-between">
              <label>Suggestion Chips</label>
              <Button className="close" onClick={this.toggleChips} />
            </div>
            <CreatableSelect
              components={{
                DropdownIndicator: null,
              }}
              inputValue={this.state.chipsInput}
              isClearable
              isMulti
              menuIsOpen={false}
              onChange={(v) => {
                const node = this.state.node;
                node.extras.chips = v;
                this.setState({ node });
              }}
              onInputChange={(v) => {
                this.setState({
                  chipsInput: v,
                });
              }}
              onKeyDown={this.handleChipsInputKeyDown}
              placeholder="Enter suggestion and press enter"
              value={this.state.node.extras.chips}
            />
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }

  render() {
    const type = this.state.node ? this.state.node.extras.type : null;
    if (type === 'god' || type === 'story') {
      return null;
    }
    return (
      <div
        id="Editor"
        className={cn({
          open: this.props.open && type && !this.state.modal,
          testing: this.props.testing,
        })}
        onFocus={this.props.unfocus}
        onClickCapture={this.eventHandler}
        onKeyDownCapture={this.eventHandler}
        onMouseDown={this.props.unfocus}
        onKeyDown={this.props.unfocus}
        onMouseEnter={() => {
          this.props.diagramEngine.getDiagramModel().setLocked();
          Mousetrap.unbind([CTRL_Z, CMD_Z]);
          Mousetrap.unbind([CTRL_Y, CMD_Y, CTRL_SHIFT_Z, CMD_SHIFT_Z]);
          Mousetrap.bind([CTRL_Z, CMD_Z], this.undo);
          Mousetrap.bind([CTRL_Y, CMD_Y, CTRL_SHIFT_Z, CMD_SHIFT_Z], this.redo);
        }}
        onMouseLeave={() => {
          if (!this.props.testing) this.props.diagramEngine.getDiagramModel().setLocked(false);
          this.props.setCanvasEvents();
        }}
      >
        {type ? (
          <div className="controls" key={this.state.node.id}>
            <div
              id="editor-section"
              className={cn({
                disabled: this.props.testing,
              })}
            >
              {this.renderTitle()}
              {!this.state.expanded ? (
                this.EditorRender()
              ) : (
                <div className="text-center mt-5">
                  <span className="loader text-lg" />
                </div>
              )}
              {this.state.expanded && (
                <React.Fragment>
                  <Modal
                    isOpen={this.state.modal}
                    toggle={() => this.setState({ modal: false })}
                    onClosed={() => this.setState({ expanded: false })}
                    size="lg"
                  >
                    <ModalHeader toggle={() => this.setState({ modal: false })} header={`${this.state.node.name} Settings`} />
                    <ModalBody className="pb-4 px-4">{this.EditorRender()}</ModalBody>
                  </Modal>
                </React.Fragment>
              )}
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  locales: state.skills.skill.locales,
  platform: state.skills.skill.platform,
  global_variables: state.skills.skill.global,
  variables: state.variables.localVariables,
  google_publish_info: state.skills.skill.google_publish_info,
  diagrams: state.diagrams.diagrams,
});
export default compose(
  connect(mapStateToProps),
  undo,
  redo
)(Editor);
