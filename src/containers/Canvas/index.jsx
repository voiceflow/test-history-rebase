/* eslint-disable guard-for-in, no-restricted-syntax, simple-import-sort/sort */
import React, { Component } from 'react';
import * as SRD from 'components/SRD/main';
import cn from 'classnames';
import Menu from './Menu';
import Editor from './Editor';
import Test from './Test';
import axios from 'axios';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

// import Loader from './Loader'
import 'draft-js/dist/Draft.css';
import 'components/SRD/sass/main.css';
import './StoryBoard.css';

// HOCs
import { undo, redo } from 'hocs/withUndoRedo';
import { open, blockMenu } from 'hocs/withCanvasHelper';
import { keyboardModal } from 'hocs/withModalHandlers';

import { WidgetBar } from './components/WidgetBar';
import CanvasWarning from './components/CanvasWarning';
// Helpers
import { combineAppendValidation, appendValidator } from 'utils/combineHelper';

import { updateVersion, updateIntents, setCanFulfill } from 'ducks/version';
import { setVariables } from 'ducks/variable';
import { renameDiagram, appendDiagrams, updateDiagrams } from 'ducks/diagram';
import { setError, setConfirm } from 'ducks/modal';
import { openTab, closeTab, setCanvasError } from 'ducks/user';

import ActionGroup from './components/ActionGroup';
import UserTestHeader from './Test/UserTestHeader';
import HelpModal from './HelpModal';
import new_template from 'assets/templates/new';
import { Alert, ListGroup, ListGroupItem } from 'reactstrap';

import cloneDeep from 'lodash/cloneDeep';
import * as util from './util';
import Spotlight from './Spotlight';
import { Toolkit } from 'components/SRD/Toolkit';
import FlowBar from './FlowBar';
import DefaultModal from 'components/Modals/DefaultModal';
import ShortCuts from 'components/ShortCuts/ShortCuts';
import Mousetrap from 'mousetrap';

import { BlockNodeModel } from 'components/SRD/models/BlockNodeModel';
import { PointModel } from 'components/SRD/models/PointModel';
/* eslint-disable no-secrets/no-secrets */
import { BlockLinkFactory } from 'components/SRD/factories/BlockLinkFactory';
import { BlockPortFactory } from 'components/SRD/factories/BlockPortFactory';
import { BlockNodeFactory } from 'components/SRD/factories/BlockNodeFactory';
/* eslint-enable no-secrets/no-secrets */
import { Spinner } from 'components/Spinner/Spinner';

import { SLOT_TYPES, ALLOWED_GOOGLE_BLOCKS } from 'Constants';

import Linter from './linter';
import { getUtterancesWithSlotNames, getSlotsForKeys } from 'intent_util';
import randomstring from 'randomstring';
import { checkBlockDisabledLive } from './Blocks';

// eslint-disable-next-line import/no-extraneous-dependencies
import { Prompt } from 'react-router';
import moment from 'moment';
import Upgrade from 'components/Modals/MultiPlatformModalContent';
import { fetchIntegrationUsers } from 'ducks/integration';
/* eslint-enable simple-import-sort/sort */

const NLC = require('natural-language-commander');
const _ = require('lodash');

const toolkit = new Toolkit();

export class Canvas extends Component {
  constructor(props) {
    super(props);
    // preview mode
    // this.preview = !!this.props.preview

    this.onSave = this.onSave.bind(this);
    this.createDiagram = this.createDiagram.bind(this);
    this.enterFlow = this.enterFlow.bind(this);
    this.deleteFlow = this.deleteFlow.bind(this);
    this.openTab = this.openTab.bind(this);
    const engine = new SRD.DiagramEngine();
    engine.registerLabelFactory(new SRD.DefaultLabelFactory());
    engine.registerNodeFactory(new BlockNodeFactory());
    engine.registerLinkFactory(new BlockLinkFactory(null, null, this.props.preview));
    engine.registerPortFactory(new BlockPortFactory());

    const diagram_name = '';

    if (window.Appcues) {
      window.Appcues.identify(this.props.user.id, {
        email: this.props.user.email,
        name: this.props.user.name,
      });
    }
    this.loaded = false;
    this.time_mounted = null;
    this.updateTree = null;

    this.state = {
      engine,
      diagram_name,
      saving: false,
      saved: true,
      testing_info: false,
      help: null,
      helpOpen: false,
      copy: null,
      time: 0,
      activityTime: 1000 * 60 * 2, // Multiply for mins
      load_diagram: true,
      diagram_level_intents: {
        alexa: new Set(),
        google: new Set(),
      },
      confirm_info: null,
      spotlight: false,
      upgrade_modal: false,
      type_counter: {},
    };

    if (window.performance && performance.naviation && performance.navigation.type === 1) {
      this.trackCanvasTime();
    }

    // SKILL IS LOADED HERE
    this.onLoadId(props.diagram_id);
  }

  setTime = (time) => {
    this.setState({
      time,
    });
  };

  countTime = () => {
    clearInterval(this.timer);
    this.timer = setInterval(() => {
      this.setTime(this.state.time + 1);
    }, 1000);
  };

  stopTime = () => {
    clearInterval(this.timer);
  };

  setMousetrap = () => {
    Mousetrap.reset();
    Mousetrap.bind(['shift+/'], () => this.props.toggleKeyboard(!this.props.keyboardHelp));
    Mousetrap.bind(['ctrl+c', 'command+c'], () =>
      this.setState({
        copy: this.state.engine
          .getDiagramModel()
          .getSelectedItems()
          .filter((n) => n instanceof BlockNodeModel),
      })
    );
    Mousetrap.bind(['ctrl+v', 'command+v'], this.paste);
    Mousetrap.bind(['ctrl+z', 'command+z'], this.undo);
    Mousetrap.bind(['ctrl+y', 'command+y', 'ctrl+shift+z', 'command+shift+z'], this.redo);
    Mousetrap.bind(['ctrl+/', 'command+/'], this.addComment);
    Mousetrap.bind(['ctrl+s', 'command+s'], (e) => {
      e.preventDefault();
      if (!this.state.saved && !this.props.preview) {
        this.onSave();
      }
    });
    Mousetrap.bind('esc', () => this.state.spotlight && this.setState({ spotlight: false }));
    Mousetrap.bind('space', (e) => {
      if (this.diagram_focus) {
        this.onDiagramUnfocus();
        this.setState({ spotlight: true });
        e.preventDefault();
        e.stopPropagation();
      }
    });
    Mousetrap.bind('enter', (e) => e.target.click());
    Mousetrap.bind(['shift+1'], (e) => {
      e.preventDefault();
      this.openTab('blocks');
    });
    Mousetrap.bind(['shift+2'], (e) => {
      e.preventDefault();
      this.openTab('project');
    });
    Mousetrap.bind(['shift+3'], (e) => {
      e.preventDefault();
      this.openTab('variables');
    });
  };

  componentDidMount() {
    if (window.Appcues) {
      window.Appcues.page();
    }
    this.events = ['load', 'mousemove', 'mousedown', 'click', 'scroll', 'keypress'];

    for (const i in this.events) {
      window.addEventListener(this.events[i], this.resetTimeout);
    }
    this.time_mounted = new Date();
    this.total_time = 0;

    this.setTimeout();
    this.setMousetrap();
    // AUTOSAVE EVERY 10 SECONDS
    if (!this.props.preview && this.props.skill && this.props.skill.skill_id && this.props.diagram_id && !window.error) {
      this.interval = setInterval(() => {
        if (this.lastModel) {
          const currentModel = JSON.stringify(util.serializeDiagram(this.state.engine));
          if (currentModel !== this.lastModel) {
            if (util.canSave(currentModel)) {
              this.tooBig = false;
              this.onSave();
            } else {
              if (!this.tooBig) {
                this.tooBig = true;
                this.props.setError('Your flow is too large to be saved - Delete blocks and use sub-flows to reduce size');
              }
            }
          }
        }
      }, 10000);
    }
    this.props.getIntegrationsUsers().then(() => {
      if (this.props.integration_users_error) {
        this.props.setError(this.props.integration_users_error);
      }
    });
  }

  componentWillUnmount() {
    if (!this.props.preview && this.props.skill && this.props.skill.skill_id && this.props.diagram_id && !window.error) {
      this.onSave(false);
    }
    Mousetrap.reset();
    if (this.interval) {
      clearInterval(this.interval);
    }
    if (this.props.skill) {
      this.trackCanvasTime();
    }
    localStorage.setItem('is_first_session', 'false');
  }

  openTab(tab) {
    if (tab !== this.props.tab || !this.props.tabOpen) {
      localStorage.setItem('tab', tab);
      this.props.setTab(tab);
    }
  }

  clearTimeoutFunc = () => {
    if (this.activityTimeout) clearTimeout(this.activityTimeout);
  };

  setTimeout = () => {
    this.activityTimeout = setTimeout(this.pauseActivity, this.state.activityTime);
  };

  pauseActivity = () => {
    this.time_active = this.time_active ? new Date() - this.time_mounted + this.time_active : new Date() - this.time_mounted;
    this.isInactive = true;
  };

  trackCanvasTime = () => {
    const time_unmounted = new Date();
    if (!!this.props.skill && this.time_mounted) {
      axios.post('/analytics/track_active_canvas', {
        duration: this.time_active ? time_unmounted - this.time_mounted + this.time_active : time_unmounted - this.time_mounted,
        skill_id: this.props.skill.skill_id,
      });
    }
    this.time_mounted = null;
  };

  resetTimeout = () => {
    if (this.isInactive) this.time_mounted = new Date();
    this.isInactive = false;
    this.clearTimeoutFunc();
    this.setTimeout();
  };

  componentDidUpdate(previous_props) {
    if (previous_props.diagram_id !== this.props.diagram_id) {
      if (this.updateTree !== null) this.updateTree();
      this.props.setOpen(false);
      const nodes = _.values(this.state.engine.diagramModel.nodes);
      this.state.engine.enableRepaintEntities(nodes);
      this.state.engine.repaintCanvas(false);
      this.setState({
        load_diagram: true,
      });
      this.onLoadId(this.props.diagram_id);
    }
    if (
      (this.props.testing && !this.state.engine.getDiagramModel().isLocked()) ||
      (!this.props.testing && this.state.engine.getDiagramModel().isLocked())
    ) {
      this.state.engine.getDiagramModel().setLocked(!!this.props.testing);
    }
  }

  mouseMove = ({ clientX, clientY }) => {
    this.mouseX = clientX;
    this.mouseY = clientY;
  };

  paste = () => {
    if (this.state.copy) {
      const event = {
        clientX: this.mouseX,
        clientY: this.mouseY,
      };
      const point = this.state.engine.getRelativeMousePoint(event);
      const centerX = _.maxBy(this.state.copy, 'x').x - (_.maxBy(this.state.copy, 'x').x - _.minBy(this.state.copy, 'x').x) / 2;
      const centerY = _.maxBy(this.state.copy, 'y').y - (_.maxBy(this.state.copy, 'y').y - _.minBy(this.state.copy, 'y').y) / 2;
      _.forEach(this.state.copy, (node) => {
        this.copyNode(node, { x: point.x + (node.x - centerX), y: point.y + (node.y - centerY) });
      });
    }
  };

  undo = (e) => {
    if (!_.isEmpty(this.props.undoEvents) && !this.state.engine.getDiagramModel().locked) {
      const recent = _.clone(_.last(this.props.undoEvents));
      if (recent.eventType === 'remove') {
        _.forEach(recent.node, (n) => {
          if (n instanceof BlockNodeModel) {
            n.parentCombine = null;
            this.state.engine.getDiagramModel().addNode(n);
          }
        });
      } else {
        _.forEach(recent.node, (n) => n instanceof BlockNodeModel && n.remove());
      }
      this.state.engine.getDiagramModel().clearSelection();
      this.props.addRedo(recent);
      this.props.removeUndo();
    }
    e.preventDefault();
  };

  redo = (e) => {
    if (!_.isEmpty(this.props.redoEvents) && !this.state.engine.getDiagramModel().locked) {
      const recent = _.last(this.props.redoEvents);
      if (recent.eventType === 'remove') {
        _.forEach(recent.node, (n) => n instanceof BlockNodeModel && n.remove());
      } else {
        this.state.engine.getDiagramModel().clearSelection();
        _.forEach(recent.node, (n) => n instanceof BlockNodeModel && this.state.engine.getDiagramModel().addNode(n));
      }
      this.state.engine.getDiagramModel().clearSelection();
      this.props.addUndo(recent.node, recent.eventType);
      this.props.removeRedo();
    }
    e.preventDefault();
  };

  addComment = (e) => {
    e.preventDefault();
    this.onDrop('comment');
  };

  removeNode = (selectedNode = null) => {
    const selected = selectedNode || this.state.engine.getSuperSelect();
    if (!checkBlockDisabledLive(this.props.live_mode, selected.extras.type)) {
      this.state.engine.stopMove();
      if (selected.extras && selected.extras.type === 'god') {
        this.props.setConfirm({
          warning: true,
          text: (
            <Alert color="danger" className="mb-0">
              WARNING: This action can not be undone, <i>{selected.name}</i> can not be recovered
            </Alert>
          ),
          confirm: () => selected.remove(),
        });
      } else if (selected) {
        if (this.props.undoEvents.length >= 10) {
          this.props.shiftUndo();
        }
        this.props.addUndo([selected], 'remove');
        this.props.clearRedo();
        selected.remove();
      }
    } else {
      this.props.setError('Cannot delete blocks that would alter the interaction model in live version editing');
    }
  };

  // copy individual node
  copyNode = (newNode = null, pos = null) => {
    const selected = newNode || this.state.engine.getSuperSelect();
    if (selected.extras.type !== 'story') {
      const engine = this.state.engine;
      engine.stopMove();

      const node = new BlockNodeModel(`${selected.name} copy`, null, toolkit.UID());
      node.extras = cloneDeep(selected.extras);
      if (selected.extras.type === 'god') {
        const newCombines = [];
        selected.combines.forEach((combineNode, idx) => {
          const newCombineNode = new BlockNodeModel(combineNode.name, null, toolkit.UID());
          newCombineNode.extras = cloneDeep(combineNode.extras);
          newCombineNode.x = combineNode.x + 30;
          newCombineNode.y = combineNode.y + 30;
          const ports = combineNode.ports;
          let newPort;
          for (const name in ports) {
            const port = ports[name];
            port.in ? (newPort = newCombineNode.addInPort(port.label)) : (newPort = newCombineNode.addOutPort(port.label));
            if (port.hidden) {
              newPort.setHidden(port.hidden);
            }
          }
          newCombines.push(newCombineNode);
          newCombines[idx].parentCombine = node;
        });
        node.combines = newCombines;
      }
      const ports = selected.getPorts();
      let newPort;
      if (node.extras.type !== 'god') {
        for (const name in ports) {
          const port = ports[name];
          port.in ? (newPort = node.addInPort(port.label)) : (newPort = node.addOutPort(port.label));
          if (port.hidden) {
            newPort.setHidden(port.hidden);
          }
        }
      }

      node.x = pos ? pos.x : selected.x + 30;
      node.y = pos ? pos.y : selected.y + 30;
      if (!_.isEmpty(node.combines)) {
        let totalHeight = 40;
        _.forEach(node.combines, (c, idx) => {
          if (!(c instanceof String) && c.id !== node.id) {
            c.x = node.x + 10;
            c.y = node.y + totalHeight;
            if (c.height) {
              totalHeight += c.height;
            } else {
              totalHeight += selected.combines[idx].height;
            }
          }
        });
      }
      engine.getDiagramModel().clearSelection();
      node.setSelected();
      engine.setSuperSelect(node);
      engine.getDiagramModel().addNode(node);
      if (this.props.undoEvents.length >= 10) {
        this.props.shiftUndo();
      }
      this.props.addUndo([node], 'copy');
      this.props.clearRedo();
      this.setState({
        engine,
      });
    }
  };

  addCombineNode = (node, type) => {
    const engine = this.state.engine;

    const newNode = new BlockNodeModel(_.startCase(type), null, toolkit.UID());
    util.createCombineNode(newNode, type, node);
    newNode.extras.type = type;
    if (node.extras.type !== 'god') {
      const combineNode = new BlockNodeModel('New Block', null, toolkit.UID());
      combineNode.extras.type = 'god';
      node.parentCombine = combineNode;
      newNode.parentCombine = combineNode;
      combineNode.x = node.x - 10;
      combineNode.y = node.y - 15;

      newNode.x = node.x;
      newNode.y = node.y + 40;
      combineNode.combines = [node];
      combineNode.combines.push(newNode);
      node.remove('combine');
      newNode.remove('combine');
      combineNode.setSelected();
      this.state.engine.setSuperSelect(combineNode);
      this.state.engine.getDiagramModel().addNode(combineNode);
      this.state.engine.enableRepaintEntities([combineNode]);
      this.forceRepaint();
    } else {
      newNode.parentCombine = node;
      newNode.x = _.last(node.combines).x;
      newNode.y = _.last(node.combines).y + 40;
      if (appendValidator(newNode) && combineAppendValidation(_.last(node.combines))) {
        node.combines.push(newNode);
        engine.setSuperSelect(node);
        this.forceRepaint();
      }
    }
  };

  appendCombineNode = (node) => {
    const idx = _.findIndex(node.parentCombine.combines, ['id', node.id]);
    const engine = this.state.engine;
    if (idx !== -1 && combineAppendValidation(node)) {
      engine.stopMove();

      const newNode = new BlockNodeModel(`${node.name} copy`, null, toolkit.UID());
      newNode.extras = cloneDeep(node.extras);
      let name;
      const ports = node.ports;
      for (name in ports) {
        const port = ports[name];
        port.in ? newNode.addInPort(port.label) : newNode.addOutPort(port.label).setMaximumLinks(1);
      }
      newNode.ports.forEach((p) => {
        p.parent = newNode;
      });
      node.parentCombine.combines.splice(idx + 1, 0, newNode);
      if (idx === node.parentCombine.combines.length) {
        const parentPorts = node.parentCombine.getOutPorts();
        for (name in parentPorts) {
          const parentPort = parentPorts[name];
          if (!parentPort.in) {
            node.parentCombine.removePort(node.parentCombine.ports[name]);
          }
        }
        const lastPorts = newNode.getOutPorts();
        node.parentCombine.ports.push(lastPorts);
      } else {
        _.forEach(node.parentCombine.getOutPorts(), (port) => {
          if (!port.in && !_.isEmpty(port.links)) {
            // eslint-disable-next-line lodash/matches-prop-shorthand
            const pointIdx = _.findIndex(_.first(_.values(port.links)).points, (p) => p.parent.sourcePort.id === port.id);
            const point = _.first(_.values(port.links)).points[pointIdx];
            if (point instanceof PointModel) {
              _.first(_.values(port.links)).points[pointIdx].updateLocation({ x: point.x, y: point.y + 40 });
            }
          }
        });
      }
      let totalHeight = 40;
      _.forEach(node.parentCombine.combines, (c) => {
        if (!(c instanceof String) && c.id !== node.parentCombine.id) {
          c.x = node.parentCombine.x + 25;
          c.y = node.parentCombine.y + totalHeight;
          if (c.height) {
            totalHeight += c.height;
          } else {
            const dimensions = this.state.engine.getNodeDimensions(c);
            c.updateDimensions(dimensions);
            totalHeight += dimensions.height;
          }
        }
      });
      engine.setSuperSelect(node);
      this.forceRepaint();
    }
  };

  removeCombineNode = (node) => {
    const removeNode = () => {
      const diagramEngine = this.state.engine;
      const combineBlock = node.parentCombine;
      combineBlock.combines = _.without(combineBlock.combines, (c) => {
        if (c.id === node.id) {
          diagramEngine.setSuperSelect(null);
          c.remove();
          return true;
        }
      });

      if (combineBlock.extras.type !== 'god') return this.forceRepaint();
      const lastNode = _.last(combineBlock.combines);
      if (combineBlock.combines.length === 1) {
        const removed = lastNode;
        removed.parentCombine = null;
        removed.extras.nextID = null;
        diagramEngine.getDiagramModel().addNode(removed);
        combineBlock.remove();
      }
      let totalHeight = 40;
      // eslint-disable-next-line sonarjs/no-identical-functions
      _.forEach(node.parentCombine.combines, (c) => {
        if (!(c instanceof String) && c.id !== node.parentCombine.id) {
          c.x = node.parentCombine.x + 25;
          c.y = node.parentCombine.y + totalHeight;
          if (c.height) {
            totalHeight += c.height;
          } else {
            const dimensions = this.state.engine.getNodeDimensions(c);
            c.updateDimensions(dimensions);
            totalHeight += dimensions.height;
          }
        }
      });
      diagramEngine.setSuperSelect(null);
      this.forceRepaint();
    };
    if (node.extras.type === 'command') {
      if (this.props.diagram_id === this.props.skill.diagram && node.parentCombine) {
        // Do not allow help/stop be deleted
        try {
          const intents = ['AMAZON.HelpIntent', 'AMAZON.StopIntent'];
          for (const intent of intents) {
            if (node.extras.alexa.intent.value === intent) {
              let count = 0;
              for (const c_node of node.parentCombine.combines) {
                try {
                  c_node.extras.alexa.intent.value === intent && count++;
                } catch (e) {
                  // swallow error
                }
              }
              if (count < 2) {
                this.props.setConfirm({
                  text: (
                    <Alert className="mb-0">
                      <b>{intent}</b> is required by default
                    </Alert>
                  ),
                  confirm: _.noop,
                });
                return;
              }
              break;
            }
          }
        } catch (e) {
          // swallow error
        }
      }

      this.props.setConfirm({
        warning: true,
        text: (
          <Alert color="danger" className="mb-0">
            Are you sure you want to remove this command?
          </Alert>
        ),
        confirm: removeNode,
      });
    } else {
      removeNode();
    }
  };

  combineNode = (e = null) => {
    const current = this.state.engine.getSuperSelect();
    const nodeElement = e ? toolkit.closest(e.target, '.node[data-nodeid]') : null;
    const element = nodeElement ? this.state.engine.getDiagramModel().getNode(nodeElement.getAttribute('data-nodeid')) : null;
    _.values(this.state.engine.getDiagramModel().getNodes()).forEach((target_node) => {
      if (current && target_node) {
        if (target_node.id === current.id) {
          return;
        }
        if (current.parentCombine || (element && element.extras && element.extras.type === 'god')) {
          const parent = current.parentCombine ? current.parentCombine : element;
          const tempIdx = _.findIndex(parent.combines, (c) => {
            return c === 'temp';
          });
          if (tempIdx >= 0) {
            let lastNode = _.findLast(parent.combines, (c) => c !== 'temp');
            if (tempIdx === parent.combines.length - 1) {
              lastNode.clearOutLinks();
              lastNode = current;
            } else {
              current.clearOutLinks();
            }
            current.x = parent.x + 10;

            parent.combines[tempIdx] = current;
            let totalHeight = 40;
            _.forEach(parent.combines, (c) => {
              if (!(c instanceof String) && c.id !== parent.id) {
                c.x = parent.x + 25;
                c.y = parent.y + totalHeight;
                if (c.height && current.id !== c.id) {
                  totalHeight += c.height;
                } else {
                  const dimensions = this.state.engine.getNodeDimensions(c);
                  c.updateDimensions(dimensions);
                  totalHeight += dimensions.height;
                }
              }
            });
            current.remove(false);
            this.state.engine.getDiagramModel().clearSelection();
            this.state.engine.setSuperSelect(parent);
            this.state.engine.enableRepaintEntities([parent]);
            this.state.engine.repaintCanvas(false);
          }
        }
      }
    });
  };

  copyFlow = (flowId) => {
    const flow = this.props.diagrams.find((d) => d.id === flowId);
    if (!flow) {
      return;
    }

    const copy = (save = true) => {
      let newFlowName = `${flow.name} (COPY)`;
      let index = 1;
      const exists = (name) => this.props.diagrams.find((d) => d.name === name);
      while (exists(newFlowName)) {
        newFlowName = `${flow.name} (COPY ${index})`;
        index++;
      }

      axios
        .get(`/diagram/copy/${flowId}?name=${encodeURI(newFlowName)}`)
        .then((res) => {
          const newDiagram = {
            id: res.data,
            name: newFlowName,
            sub_diagrams: flow.sub_diagrams,
            module_id: null,
          };
          this.props.updateDiagrams([...this.props.diagrams, newDiagram]);
          this.enterFlow(res.data, save);
        })
        .catch(() => {
          this.setState({
            text: <Alert color="danger"> Unable to Copy Flow </Alert>,
            confirm: {
              confirm: this.setState({
                confirm: null,
              }),
            },
          });
        });
    };

    if (flowId === this.props.diagram_id && !this.props.preview) {
      this.saveCB = () => {
        copy(false);
      };
      this.onSave();
    } else {
      copy(true);
    }
  };

  deleteFlow(flowId) {
    this.props.setConfirm({
      warning: true,
      text: (
        <Alert color="danger" className="mb-0">
          <i className="fas fa-exclamation-triangle fa-2x" />
          <br />
          Deleting this flow permanently deletes everything inside and can not be recovered
          <br />
          <br />
          Are you sure ?
        </Alert>
      ),
      confirm: () => {
        this.setState({
          confirm: null,
        });
        axios
          .delete(`/diagram/${flowId}`)
          .then(() => {
            const updatedDiagrams = this.props.diagrams
              .filter(({ id }) => id !== flowId)
              .map((diagram) => {
                const updatedSubDiagrams = diagram.sub_diagrams.filter((id) => id !== flowId);
                diagram.sub_diagrams = updatedSubDiagrams;

                return diagram;
              });
            this.props.updateDiagrams(updatedDiagrams);
            // If they are deleting the flow they are currently on, go back to ROOT
            if (flowId === this.props.diagram_id) {
              this.enterFlow(this.props.root_id, false);
            }
          })
          .catch((err) => {
            // eslint-disable-next-line no-console
            console.log(err);
            alert('failed to delete diagram');
          });
      },
    });
  }

  onDiagramUnfocus = () => {
    this.diagram_focus = false;
    this.state.engine.getDiagramModel().clearSelection();
  };

  forceRepaint = () => {
    this.forceUpdate();
  };

  getSubDiagrams = (nodes) => {
    const updatedSubDiagrams = nodes.filter((node) => !!node.extras.diagram_id).map((node) => node.extras.diagram_id);

    const updatedStorySubDiagrams = nodes
      .filter((node) => node.extras.type === 'story' && Array.isArray(node.combines))
      .reduce((acc, node) => {
        const combinedNodes = node.combines
          .filter(({ extras }) => extras[this.props.skill.platform] && extras[this.props.skill.platform].diagram_id)
          .map(({ extras }) => extras[this.props.skill.platform].diagram_id);

        return [...acc, ...combinedNodes];
      }, []);

    return [...updatedSubDiagrams, ...updatedStorySubDiagrams];
  };

  updateDiagrams = (subDiagrams, newDiagram = []) => {
    const { diagrams, diagram_id, updateDiagrams } = this.props;
    const updatedDiagrams = diagrams.map((diagram) => {
      if (diagram.id === diagram_id) {
        diagram.sub_diagrams = subDiagrams;
      }

      return diagram;
    });
    updateDiagrams([...updatedDiagrams, ...newDiagram]);
  };

  onSave(state = true) {
    if (this.saving) return;
    this.saving = true;
    try {
      if (this.props.preview) return;
      state && this.setState({ saving: true });
      const serialize = util.serializeDiagram(this.state.engine);
      const data = JSON.stringify(serialize);
      const subDiagrams = this.getSubDiagrams(serialize.nodes);
      if (state) this.updateDiagrams(subDiagrams);

      if (this.updateTree !== null) this.updateTree();

      const diagram = {
        title: this.state.diagram_name,
        variables: this.props.variables,
        data,
        skill: this.props.skill.skill_id,
        sub_diagrams: JSON.stringify(subDiagrams),
        global: this.props.skill.global,
      };
      const s = this.props.skill;

      const save_skill_intents = new Promise((resolve, reject) => {
        axios
          .patch(`/skill/${s.skill_id}?intents=true`, {
            intents: JSON.stringify(s.intents),
            slots: JSON.stringify(s.slots),
            fulfillment: JSON.stringify(s.fulfillment),
            platform: s.platform,
          })
          .then(() => {
            resolve();
          })
          .catch((err) => {
            reject(err);
          });
      });

      const save_diagram = axios.post('/diagram', diagram);

      Promise.all([save_skill_intents, save_diagram])
        .then(() => {
          this.saving = false;
          this.lastModel = data;
          state &&
            this.setState({
              saving: false,
              saved: true,
            });
          if (typeof this.props.skillSaveCB === 'function') {
            this.props.skillSaveCB(serialize.id);
          } else if (typeof this.saveCB === 'function') {
            this.saveCB(serialize.id);
            this.saveCB = null;
          }
        })
        .catch(() => {
          this.saving = false;
          state &&
            this.setState({
              saving: false,
            }) &&
            this.props.setError('Error Saving Project');

          if (typeof this.props.skillSaveCB === 'function') {
            this.props.skillSaveCB(null);
          } else if (typeof this.saveCB === 'function') {
            this.saveCB(null);
            this.saveCB = null;
          }
        });
    } catch (e) {
      this.saving = false;
      // eslint-disable-next-line no-console
      console.log(e);
      state && this.props.setError('Error Saving - Project Structure (Check Logs)');
      if (typeof this.props.skillSaveCB === 'function') {
        this.props.skillSaveCB(null);
      } else if (typeof this.saveCB === 'function') {
        this.saveCB(null);
        this.saveCB = null;
      }
    }
  }

  loadDiagram = (diagram, diagram_id) => {
    const engine = this.state.engine;
    const model = new SRD.DiagramModel();

    const type_counter = {};
    let diagram_json = false;
    try {
      diagram_json = JSON.parse(diagram.data);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
    }
    if (this.props.preview) {
      model.setLocked(true);
    }
    if (diagram_json) {
      // CONVERT DEPRECATED BLOCKS
      diagram_json = util.convertDiagram(diagram_json, this.props.diagrams);
      diagram_json.id = diagram_id;
      this.lastModel = JSON.stringify(diagram_json);

      // This should not happen
      if (diagram_json.nodes.length === 0) {
        diagram_json = new_template;
      }
      engine.setSuperSelect(null);
      model.deSerializeDiagram(diagram_json, engine);
      model.addListener({ linksUpdated: this.unsave });
      model.addListener({ nodesUpdated: this.unsave });

      const diagram_level_intents = {
        alexa: new Set(),
        google: new Set(),
      };

      const makeNodeMultiPlatform = (type, node) => {
        if (type === 'intent' || type === 'jump' || type === 'interaction' || type === 'command') {
          if (!node.extras.google && !node.extras.alexa) {
            if (node.extras.choices) {
              node.extras.alexa = _.cloneDeep(_.pick(node.extras, ['choices']));

              let g_choices = _.cloneDeep(node.extras.alexa.choices);
              g_choices = g_choices.map(() => {
                return { intent: null, mappings: [], key: randomstring.generate(12), open: true };
              });

              node.extras.google = {
                choices: g_choices,
              };
              delete node.extras.choices;
              delete node.extras.choices_open;
            } else if (node.extras.intent) {
              node.extras.alexa = _.cloneDeep(_.pick(node.extras, ['intent', 'mappings', 'resume', 'end', 'diagram_id']));
              node.extras.google = {
                intent: null,
                mappings: [],
                resume: node.extras.alexa.resume,
                end: node.extras.alexa.end,
                diagram_id: node.extras.alexa.diagram_id,
              };
              delete node.extras.intent;
              delete node.extras.mappings;
              delete node.extras.resume;
              delete node.extras.end;
              delete node.extras.diagram_id;
            }
          }
          if (node.extras.alexa && node.extras.google) {
            const has_intents = node.extras.alexa.intent !== undefined || node.extras.google.intent !== undefined;
            if ((type === 'intent' && has_intents) || (type === 'jump' && has_intents)) {
              if (node.extras.google.intent) {
                diagram_level_intents.google.add(node.extras.google.intent.key);
              }
              if (node.extras.alexa.intent) {
                diagram_level_intents.alexa.add(node.extras.alexa.intent.key);
              }
            }
          }
        }
      };

      const addMissingPorts = (type, node) => {
        if (type === 'stream') {
          try {
            let hasGooglePort = false;
            const ports = node.getPorts();
            for (const name in ports) {
              const port = node.getPort(name);
              if (!port.in && port.label && port.label.trim() === '') {
                hasGooglePort = true;
              }
            }
            if (!hasGooglePort) {
              node.addOutPort(' ').setMaximumLinks(1);
            }
            if (node.parentCombine) {
              const bestNode = _.findIndex(node.parentCombine.combines, ['id', node.id]);
              node.parentCombine.combines[bestNode] = node;
            }
          } catch (e) {
            // no op
          }
        }
      };

      const nodes = model.getNodes();
      for (const key in nodes) {
        const node = nodes[key];
        const type = node.extras.type;
        if (type_counter[type] === undefined) {
          type_counter[type] = 1;
        } else {
          type_counter[type] += 1;
        }

        // Combine block
        if (Array.isArray(node.combines) && node.combines.length !== 0) {
          node.combines.forEach((n) => {
            if (typeof n !== 'object') return;

            if (type_counter[n.extras.type] === undefined) {
              type_counter[n.extras.type] = 1;
            } else {
              type_counter[n.extras.type] += 1;
            }

            if (this.props.skill.platform === 'google') {
              n.fade = !ALLOWED_GOOGLE_BLOCKS.includes(n.extras.type);
            } else {
              n.fade = false;
            }
            makeNodeMultiPlatform(n.extras.type, n);
            addMissingPorts(n.extras.type, n);
          });
        } else {
          if (this.props.skill.platform === 'google') {
            nodes[key].fade = !ALLOWED_GOOGLE_BLOCKS.includes(type);
          } else {
            nodes[key].fade = false;
          }
          makeNodeMultiPlatform(type, node);
          addMissingPorts(type, node);
        }
      }

      engine.stopMove();
      engine.setDiagramModel(model);
      // make sure variables are unique and don't overlap with global variables
      const variables = [];
      if (Array.isArray(diagram.variables)) {
        diagram.variables.forEach((v) => {
          if (!variables.includes(v) && !this.props.skill.global.includes(v)) {
            variables.push(v);
          }
        });
      }
      this.props.setVariables(variables);
      this.props.setOpen(false);
      this.setState({
        load_diagram: false,
        type_counter,
        engine,
        diagram_name: diagram.title ? diagram.title : 'New Flow',
        diagram_level_intents,
      });
      // this.props.history.push(`/canvas/${this.props.skill.skill_id}/${this.props.skill.diagram}`)
      this.setState({ saved: true });
      this.updateLinter(true);
    } else {
      this.setState({
        load_diagram: false,
        type_counter,
      });
      this.props.setError('Could Not Open Project - Corrupted File');
    }
  };

  updateLinter = (force = true) => {
    const engine = this.state.engine;
    const model = engine.getDiagramModel();
    const nodes = model.getNodes();
    let update = false;

    const lint = (n) => {
      if (typeof n !== 'object') return;
      if (!n.linter) n.linter = [];

      if (Linter[n.extras.type] && n.linter) {
        const res = Linter[n.extras.type](n, this.props.skill.platform);
        if (res) update = true;
      }
    };
    for (const key in nodes) {
      const node = nodes[key];
      const type = node.extras.type;

      if (type === 'god') {
        node.combines.forEach(lint);
      } else {
        if (!node.linter) node.linter = [];

        if (Linter[type] && node.linter) {
          const res = Linter[type](node, this.props.skill.platform);
          if (res) update = true;
        }
      }
    }

    if (force || update) {
      this.setState({
        engine,
      });
      engine.repaintCanvas();
      this.forceRepaint();
    }
  };

  renderPlatformSwitch = () => {
    const updateGoogleFade = (type, key, node, nodes) => {
      if (this.props.skill.platform === 'google') {
        if (type === 'god') {
          node.combines.forEach((n) => {
            n.fade = !ALLOWED_GOOGLE_BLOCKS.includes(n.extras.type);
          });
        } else {
          nodes[key].fade = !ALLOWED_GOOGLE_BLOCKS.includes(type);
        }
      } else {
        if (type === 'god') {
          node.combines.forEach((n) => {
            n.fade = false;
          });
        } else {
          nodes[key].fade = false;
        }
      }
    };

    const updatePortsAndLinks = (type, key, node) => {
      const ports = node.getPorts();

      if (type === 'stream') {
        for (const name in ports) {
          const port = node.getPort(name);
          // eslint-disable-next-line no-continue
          if (port.in) continue;

          if (port.label === 'pause') {
            port.setHidden(this.props.skill.platform === 'google');
          }

          if (port.label === 'previous') {
            port.setHidden(this.props.skill.platform === 'google');
          }

          if (port.label === 'next') {
            port.setHidden(this.props.skill.platform === 'google');
          }
          if (port.label.trim() === '') {
            port.setHidden(this.props.skill.platform !== 'google');
          }
        }
      }
    };

    const engine = this.state.engine;
    const model = engine.getDiagramModel();
    const nodes = model.getNodes();

    for (const key in nodes) {
      const node = nodes[key];
      const type = node.extras.type;

      // Combine block
      if (Array.isArray(node.combines) && node.combines.length !== 0) {
        node.combines.forEach((n, i) => {
          updateGoogleFade(n.extras.type, i, n, node.combines);
          updatePortsAndLinks(n.extras.type, i, n);
        });
      } else {
        updateGoogleFade(type, key, node, nodes);
        updatePortsAndLinks(type, key, node);
      }
    }
    engine.repaintCanvas();
    this.setState({
      engine,
    });
  };

  onLoadId = (diagram_id) => {
    axios
      .get(`/diagram/${diagram_id}`)
      .then((res) => {
        this.loadDiagram(res.data, diagram_id);
        // this.props.fetchDiagramSuccess(true)
        if (!this.props.preview) {
          localStorage.setItem('flow', `${this.props.skill.skill_id}/${diagram_id}`);
        }
        if (this.updateTree !== null) this.updateTree();
      })
      .catch((err) => {
        console.error(err);
        this.props.setError('Could Not Retrieve Project');
      });
  };

  unsave = (e) => {
    if (e && e.node && !e.isCreated) {
      const selected = this.state.engine.getSuperSelect();
      if (selected && e.node.id === selected.getID()) {
        this.props.setOpen(false);
      }
    }

    if (this.state.saved) {
      this.setState({ saved: false });
    }
  };

  runTest = () => {
    const engine = this.state.engine;
    const model = engine.getDiagramModel();
    const data = model.serializeDiagram();

    let nlc = this.state.testing_info ? this.state.testing_info.nlc : null;
    let slot_mappings = this.state.testing_info ? this.state.testing_info.slot_mappings : {};

    const nodes = [];
    data.nodes.forEach((node) => {
      if (node.extras && node.extras.type !== 'story') {
        nodes.push({
          value: node.id,
          label: node.name,
        });
      }
    });
    if (!nlc) {
      nlc = new NLC();

      const built_in_slots = [];

      SLOT_TYPES.forEach((s) => {
        if (s.type.alexa) built_in_slots.push(s.type.alexa);
        if (s.type.google) built_in_slots.push(s.type.google);
      });
      built_in_slots.forEach((s) => {
        const matcher = /[\S\s]*/;
        nlc.addSlotType({
          type: s,
          matcher,
        });
      });

      slot_mappings = {};
      this.props.skill.slots.forEach((slot) => {
        if (slot.type.value && slot.type.value.toLowerCase() === 'custom') {
          nlc.addSlotType({
            type: slot.name,
            matcher: slot.inputs,
          });
        }
      });

      this.props.skill.intents.forEach((intent) => {
        let samples;
        if (!intent.built_in) {
          samples = getUtterancesWithSlotNames(intent.inputs, this.props.skill.slots);
        }
        const slots = getSlotsForKeys(intent.inputs.map((input) => input.slots), this.props.skill.slots, this.props.skill.platform);

        nlc.registerIntent({
          slots,
          intent: intent.name,
          utterances: samples,
          callback: _.noop,
        });

        slot_mappings[intent.name] = slots;
      });
    }

    this.setState({
      testing_info: {
        id: this.props.diagram_id,
        nodes,
        nlc,
        slot_mappings,
      },
    });
  };

  onTest = () => {
    this.state.engine.getDiagramModel().clearSelection();

    if (this.props.preview) {
      this.runTest();
    } else {
      this.saveCB = (diagram_id) => {
        if (diagram_id !== null) {
          axios
            .post(`/diagram/${diagram_id}/test/publish`, {
              intents: this.props.skill.intents,
              slots: this.props.skill.slots,
              platform: this.props.skill.platform,
            })
            .then(this.runTest)
            .catch(() => {
              this.props.setError('Could Not Render Your Project');
            });
        }
      };
      this.onSave();
    }
  };

  generateBlockMenu = (e, combineNode = null) => {
    if (this.props.preview) {
      this.props.setBlockMenu(null);
      return;
    }
    const nodeElement = toolkit.closest(e.target, '.node[data-nodeid]');
    e.preventDefault();
    const engine = this.state.engine;
    if (nodeElement) {
      const node = this.state.engine.getDiagramModel().getNode(nodeElement.getAttribute('data-nodeid'));
      engine.getDiagramModel().clearSelection();
      engine.setSuperSelect(node);
      this.props.setBlockMenu(
        <React.Fragment>
          <div
            style={{
              top: engine.getDiagramModel().getGridPosition(e.clientY - 100),
              left: engine.getDiagramModel().getGridPosition(e.clientX),
              cursor: 'pointer',
              position: 'absolute',
              zIndex: 10,
            }}
          >
            <ListGroup>
              {!combineNode && (
                <ListGroupItem
                  onClick={() => {
                    node.setLocked(true);
                    node.selected = true;
                    node.edit = true;
                    this.props.setBlockMenu(null);
                  }}
                >
                  Rename
                </ListGroupItem>
              )}
              <ListGroupItem
                onClick={() => {
                  if (combineNode) {
                    this.appendCombineNode(combineNode);
                  } else {
                    this.copyNode(node);
                  }
                  this.props.setBlockMenu(null);
                }}
              >
                Copy Block
              </ListGroupItem>
              <ListGroupItem
                onClick={() => {
                  if (combineNode) {
                    this.removeCombineNode(combineNode);
                  } else {
                    this.removeNode(node);
                  }
                  this.props.setBlockMenu(null);
                }}
              >
                Delete Block
              </ListGroupItem>
            </ListGroup>
          </div>
        </React.Fragment>
      );
    } else {
      this.props.setBlockMenu(
        <React.Fragment>
          <div
            style={{
              top: engine.getDiagramModel().getGridPosition(e.clientY - 110),
              left: engine.getDiagramModel().getGridPosition(e.clientX),
              cursor: 'pointer',
              position: 'absolute',
              zIndex: 10,
            }}
          >
            <ListGroup>
              <ListGroupItem
                onClick={() => {
                  this.addComment(e);
                  this.props.setBlockMenu(null);
                }}
              >
                Add Comment
              </ListGroupItem>
            </ListGroup>
          </div>
        </React.Fragment>
      );
    }
  };

  // Create a new diagram from the flow block
  createDiagram(node, base_flow_name = 'New Flow', template = null, forCommand = false) {
    this.setState({ load_diagram: true });
    const id = util.generateID();

    // Generate a new diagram, save it, and go to it
    let curr_template;
    if (!template) {
      curr_template = new_template;
    } else {
      curr_template = template;
    }
    curr_template.id = id;
    const skill_id = this.props.skill.skill_id;
    const data = JSON.stringify(curr_template);

    // No Duplicate Flow Names
    let newFlowName = base_flow_name;
    let index = 1;
    const exists = (name) => this.props.diagrams.find((d) => d.name === name);

    while (exists(newFlowName)) {
      newFlowName = `${base_flow_name} ${index}`;
      index++;
    }

    const diagram = {
      id,
      title: newFlowName,
      variables: [],
      data,
      skill: skill_id,
    };

    axios
      .post('/diagram?new=1', diagram)
      .then(() => {
        if (forCommand) {
          node.extras[this.props.skill.platform].diagram_id = id;
        } else {
          node.extras.diagram_id = id;
        }
        const subDiagrams = [...this.props.diagram.sub_diagrams, id];
        const newDiagram = {
          id,
          name: newFlowName,
          sub_diagrams: [],
          module_id: null,
        };
        this.updateDiagrams(subDiagrams, [newDiagram]);
        this.enterFlow(id);
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.log(err.response);
        this.setState({ loading_diagram: false });
        this.props.setError('Unable to create new Flow');
      });
  }

  enterFlow(new_diagram_id, save = true) {
    if (new_diagram_id !== this.props.diagram_id) {
      this.setState({ load_diagram: true });
      if (save && !this.props.preview) {
        this.saveCB = () => {
          this.props.updateSkill('diagram', new_diagram_id);
          this.props.history.push(`/canvas/${this.props.skill.skill_id}/${new_diagram_id}`);
        };
        this.onSave();
      } else {
        this.props.updateSkill('diagram', new_diagram_id);
        this.props.history.push(`/${this.props.preview ? 'preview' : this.props.page}/${this.props.skill.skill_id}/${new_diagram_id}`);
      }
    }
  }

  updateFulfillmentOnDeletion = (deleted_node) => {
    const extras = deleted_node.extras[this.props.skill.platform];

    if (extras.intent && extras.intent.key) {
      const key = extras.intent.key;
      const new_value = false;
      this.props.setCanFulfill(key, new_value);
      this.state.diagram_level_intents[this.props.skill.platform].delete(key);
    }
    this.removeNode(deleted_node);
  };

  onDeleteIntentNode = (deleted_node) => {
    const skill = this.props.skill;
    const fulfillments = skill.fulfillment;

    const extras = deleted_node.extras[skill.platform];
    const key = extras.intent ? extras.intent.key : null;
    if (key && fulfillments[key]) {
      const confirm_info = {
        // eslint-disable-next-line prettier/prettier
        text: `CanfulfillIntent is enabled for the "${
          extras.intent.label
        }" intent. Deleting this intent will also delete any slot fulfillment values you have set for this intent.`,
        confirm: () => {
          this.updateFulfillmentOnDeletion(deleted_node);
          this.setState({
            confirm_info: null,
          });
        },
      };
      this.props.setConfirm(confirm_info);
    } else {
      this.updateFulfillmentOnDeletion(deleted_node);
    }
  };

  onDrop = (rawEvent) => {
    if (this.props.preview) return;
    let event = rawEvent;
    let type;
    let name;
    let diagram_id;
    if (typeof event === 'string') {
      type = event;
      event = {
        clientX: this.mouseX,
        clientY: this.mouseY,
      };
      if (this.state.spotlight) {
        this.setState({ spotlight: false });
      }
    } else {
      try {
        type = event.dataTransfer.getData('node');
        name = event.dataTransfer.getData('name');
        diagram_id = event.dataTransfer.getData('diagram_id');
      } catch (e) {
        return;
      }
    }

    if (diagram_id) {
      // Track which flow was used
      const module = this.props.diagrams.find((diagram) => {
        return diagram.id === diagram_id;
      });
      axios.post('/analytics/track_flow_used', {
        module_id: module.module_id,
      });
    }

    if (!name) {
      name = type.charAt(0).toUpperCase() + type.substr(1);
    }
    util.createDropNode(event, this.state.engine, type, name);
    this.combineNode();
    this.props.setOpen(type !== 'comment');
    this.setState({
      open: type !== 'comment',
    });
    this.renderPlatformSwitch();
    this.updateLinter();
  };

  onUpdate = () => {
    this.updateLinter();
    this.unsave();
  };

  toggleUpgradeModal = () =>
    this.setState({
      upgrade_modal: !this.state.upgrade_modal,
    });

  render() {
    return (
      <React.Fragment>
        <Prompt
          message={() => {
            if (!util.canSave()) {
              return 'This flow is too large to be saved, please remove blocks to reduce size - are you sure you would like to leave without saving?';
            }
            return true;
          }}
        />
        <DefaultModal
          open={this.state.upgrade_modal}
          header="Multi Platform Development"
          toggle={this.toggleUpgradeModal}
          content={<Upgrade history={this.props.history} toggle={this.toggleUpgradeModal} />}
          hideFooter={true}
          noPadding={true}
        />
        <DefaultModal
          open={this.props.keyboardHelp}
          header="Keyboard Shortcuts"
          toggle={() => this.props.toggleKeyboard(!this.props.keyboardHelp)}
          content={<ShortCuts />}
        />
        <HelpModal
          open={this.state.helpOpen}
          help={this.state.help}
          toggle={() => this.setState({ helpOpen: !this.state.helpOpen })}
          setHelp={(help) => this.setState({ help })}
        />
        {!this.props.preview && this.props.page === 'canvas' && (
          <ActionGroup
            lastSave={this.state.last_save ? `Last saved ${moment(this.state.last_save).fromNow()}` : 'Save'}
            setCB={(cb) => {
              this.saveCB = cb;
            }}
            onSave={this.onSave}
            saving={this.state.saving}
            saved={this.state.saved}
            onTest={this.onTest}
            updateLinter={this.updateLinter}
            renderPlatformSwitch={this.renderPlatformSwitch}
            history={this.props.history}
            preview={this.props.preview}
          />
        )}
        {!this.props.preview && this.props.page === 'test' && (
          <UserTestHeader
            preview={this.props.preview}
            history={this.props.history}
            onTest={this.onTest}
            time={this.state.time}
            testing_info={this.state.testing_info}
            resetTest={() => this.setState({ testing_info: false })}
            page={this.props.page}
          />
        )}
        {this.state.spotlight && <Spotlight addBlock={this.onDrop} cancel={() => this.setState({ spotlight: false })} />}
        <div
          id={this.props.preview ? 'canvas_preview' : 'canvas'}
          onMouseMove={this.mouseMove}
          onMouseUp={this.combineNode}
          onMouseDown={() => {
            this.diagram_focus = true;
          }}
        >
          <Menu
            unfocus={this.onDiagramUnfocus}
            enterFlow={this.enterFlow}
            history={this.props.history}
            user={this.props.user}
            loading_diagram={this.props.load_diagram}
            copyFlow={this.copyFlow}
            deleteFlow={this.deleteFlow}
            preview={this.props.preview}
            toggleUpgrade={this.props.toggleUpgrade}
            type_counter={this.state.type_counter}
            openTab={this.openTab}
            closeTab={this.props.closeTab}
            tab={this.props.tab}
            open={!this.props.preview && this.props.tabOpen && this.props.page === 'canvas'}
            build={(fn) => {
              this.updateTree = fn;
            }}
          />
          {this.state.load_diagram && React.createElement(Spinner, { name: 'Flow' })}

          <Editor
            unfocus={this.onDiagramUnfocus}
            open={this.props.open && this.props.page === 'canvas'}
            diagramEngine={this.state.engine}
            node={this.state.engine.getSuperSelect()}
            onUpdate={this.onUpdate}
            close={() => this.props.setOpen(false)}
            setHelp={(help) => this.setState({ help, helpOpen: true })}
            createDiagram={this.createDiagram}
            enterFlow={this.enterFlow}
            repaint={this.forceRepaint}
            removeNode={!this.props.preview ? this.removeNode : _.noop()}
            copyNode={!this.props.preview ? this.copyNode : _.noop()}
            appendCombineNode={!this.props.preview ? this.appendCombineNode : _.noop()}
            removeCombineNode={!this.props.preview ? this.removeCombineNode : _.noop()}
            preview={this.props.preview}
            onboarding={this.onboarding}
            finished={() => {
              this.onboarding = false;
            }}
            history={this.props.history}
            diagram_level_intents={this.state.diagram_level_intents}
            setCanvasEvents={this.setMousetrap}
            updateLinter={this.updateLinter}
          />
          <Test
            open={this.props.testing}
            testing_info={this.state.testing_info}
            flow={this.props.diagram.name}
            onTest={this.onTest}
            history={this.props.history}
            enterFlow={this.enterFlow}
            diagramEngine={this.state.engine}
            stop={this.stopTime}
            resetTest={() => this.setState({ testing_info: false })}
            resume={this.countTime}
            time={this.state.time}
            open={this.props.page === 'test'}
            setTime={this.setTime}
          />
          <div
            key={this.props.diagram_id}
            id="diagram"
            className={cn({ 'no-padding': this.props.preview })}
            onDrop={this.onDrop}
            onDragOver={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
            onMouseLeave={() => {
              this.diagram_focus = false;
            }}
            onContextMenu={this.generateBlockMenu}
          >
            <div className="canvas-warnings">
              <ReactCSSTransitionGroup transitionName="fade" transitionEnterTimeout={500} transitionLeaveTimeout={300}>
                {_.map(this.props.canvasError, (err, idx) => (
                  <CanvasWarning key={idx} idx={idx} err={err} />
                ))}
              </ReactCSSTransitionGroup>
            </div>
            <WidgetBar
              toggleKeyboard={this.props.toggleKeyboard}
              keyboardHelp={this.props.keyboardHelp}
              engine={this.state.engine}
              setOpen={this.props.setOpen}
              update={(engine) => this.setState({ engine })}
              preview={this.props.preview}
              isCanvas={this.props.page === 'canvas'}
            />
            {this.props.root_id !== this.props.diagram_id && (
              <FlowBar
                enterFlow={this.enterFlow}
                preview={this.props.preview}
                root_id={this.props.root_id}
                setBlockMenu={this.props.setBlockMenu}
                testing_info={this.state.testing_info}
                engine={this.state.engine}
                isCanvas={this.props.page === 'canvas'}
              />
            )}
            {this.props.blockMenu}
            {this.props.page === 'test' && (
              <div className="read-only">
                <div className="read-only-container">
                  <img className="mr-2" src="/eye.svg" width={10} height={10} />
                  <span>Read Only</span>
                </div>
              </div>
            )}
            <SRD.DiagramWidget
              diagramEngine={this.state.engine}
              allowLooseLinks={false}
              onConfirm={this.props.setConfirm}
              onDeleteIntentNode={this.onDeleteIntentNode.bind(this)}
              nodeProps={{
                hasFlow: (diagram_id) => this.props.diagram_set.has(diagram_id),
                enterFlow: this.enterFlow,
                setCanvasError: this.props.setCanvasError,
                removeNode: this.removeNode,
                diagram: this.props.diagram,
                removeCombineNode: this.removeCombineNode,
                addCombineNode: this.addCombineNode,
                generateBlockMenu: this.generateBlockMenu,
                setBlockMenu: this.props.setBlockMenu,
                disabled: !!this.props.preview,
                renameFlow: this.props.renameFlow,
              }}
              removeHandler={(node) => {
                if (this.props.undoEvents.length >= 10) {
                  this.props.shiftUndo();
                }
                this.props.addUndo(node, 'remove');
                this.props.clearRedo();
              }}
              forceRepaint={this.forceRepaint}
              live_mode={this.props.live_mode}
              editorOpen={this.props.open}
              setBlockMenu={this.props.setBlockMenu}
              setOpen={this.props.setOpen}
              platform={this.props.skill.platform}
              locked={this.state.engine.getDiagramModel().isLocked() || this.props.preview}
            />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  const tab = localStorage.getItem('tab');
  return {
    user: state.account,
    skill: state.skills.skill,
    diagram_id: state.skills.skill.diagram,
    diagrams: state.diagrams.diagrams,
    diagram_error: state.diagrams.error,
    root_id: state.diagrams.root_id,
    error: state.skills.error,
    variables: state.variables.localVariables,
    diagram_set: new Set(state.diagrams.diagrams.map((d) => d.id)),
    diagram: _.find(state.diagrams.diagrams, ['id', state.skills.skill.diagram]),
    canvasError: state.userSetting.canvasError,
    integration_users_error: state.integrationUsers.error,
    tab: tab || state.userSetting.tab,
    tabOpen: state.userSetting.menuOpen,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateSkill: (type, val) => dispatch(updateVersion(type, val)),
    setVariables: (variable) => dispatch(setVariables(variable)),
    updateIntents: () => dispatch(updateIntents()),
    setCanFulfill: (key, val) => dispatch(setCanFulfill(key, val)),
    renameFlow: (id, name) => dispatch(renameDiagram(id, name)),
    setCanvasError: (err) => dispatch(setCanvasError(err)),
    setError: (err) => dispatch(setError(err)),
    setConfirm: (confirm) => dispatch(setConfirm(confirm)),
    getIntegrationsUsers: () => dispatch(fetchIntegrationUsers()),
    appendDiagrams: (name, id, sub_diagrams) => dispatch(appendDiagrams({ name, id, sub_diagrams })),
    updateDiagrams: (diagrams) => dispatch(updateDiagrams(diagrams)),
    setTab: (tab) => dispatch(openTab(tab)),
    closeTab: () => dispatch(closeTab()),
  };
};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  open,
  blockMenu,
  keyboardModal,
  undo,
  redo
)(Canvas);
