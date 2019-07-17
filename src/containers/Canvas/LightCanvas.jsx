import 'draft-js/dist/Draft.css';
import 'components/SRD/sass/main.css';
import './StoryBoard.css';

import axios from 'axios';
import Button from 'components/Button';
/* eslint-disable no-secrets/no-secrets */
import { BlockLinkFactory } from 'components/SRD/factories/BlockLinkFactory';
import { BlockNodeFactory } from 'components/SRD/factories/BlockNodeFactory';
import { BlockPortFactory } from 'components/SRD/factories/BlockPortFactory';
/* eslint-enable no-secrets/no-secrets */
import * as SRD from 'components/SRD/main';
import { Spinner } from 'components/Spinner';
import { setError } from 'ducks/modal';
import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ButtonGroup } from 'reactstrap';

import new_template from '../../assets/templates/new';
import { convertDiagram } from './util';

const line_color = '#D1D8E2';
const line_width = 2.5;

class LightCanvas extends Component {
  constructor(props) {
    super(props);

    const { preview } = this.props;

    this.repaint = this.repaint.bind(this);
    this.loadDiagram = this.loadDiagram.bind(this);
    this.onDiagramUnfocus = this.onDiagramUnfocus.bind(this);
    this.zoom = this.zoom.bind(this);
    // build diagram tree function from child
    this.buildDiagrams = null;
    // preview mode
    this.preview = !!preview;

    const engine = new SRD.DiagramEngine();
    engine.registerLabelFactory(new SRD.DefaultLabelFactory());
    engine.registerNodeFactory(new BlockNodeFactory());
    engine.registerLinkFactory(new BlockLinkFactory(line_color, line_width));
    engine.registerPortFactory(new BlockPortFactory());

    const diagram_name = '';

    // ONBOARDING
    this.onboarding = localStorage.getItem('onboarding');
    this.loaded = false;

    this.state = {
      engine,
      diagram_name,
      diagrams: [],
      products: [],
      error: null,
      loading_diagram: true,
      saving: false,
      saved: true,
      testing_modal: false,
      testing_info: false,
      variables: [],
      help: null,
      helpOpen: false,
      currentProduct: null,
      user_modules: null,
      user_templates: [],
      email_templates: [],
      display_templates: [],
      default_templates: [],
    };
  }

  // eslint-disable-next-line react/no-deprecated
  componentWillMount() {
    const { diagram_id } = this.props;
    this.onLoadId(diagram_id);
  }

  zoom(delta) {
    const { engine } = this.state;
    const diagramModel = engine.getDiagramModel();
    const oldZoomFactor = diagramModel.getZoomLevel() / 100;
    const scrollDelta = delta / 60;

    if (scrollDelta < 0) {
      if (diagramModel.getZoomLevel() + scrollDelta > 10) {
        diagramModel.setZoomLevel(diagramModel.getZoomLevel() + scrollDelta);
      } else {
        diagramModel.setZoomLevel(10);
      }
    } else {
      if (diagramModel.getZoomLevel() + scrollDelta < 150) {
        diagramModel.setZoomLevel(diagramModel.getZoomLevel() + scrollDelta);
      } else {
        diagramModel.setZoomLevel(150);
      }
    }

    const zoomFactor = diagramModel.getZoomLevel() / 100;

    const boundingRect = engine.canvas.getBoundingClientRect();
    const clientWidth = boundingRect.width;
    const clientHeight = boundingRect.height;
    // compute difference between rect before and after scroll
    const widthDiff = clientWidth * zoomFactor - clientWidth * oldZoomFactor;
    const heightDiff = clientHeight * zoomFactor - clientHeight * oldZoomFactor;
    // compute mouse coords relative to canvas
    const clientX = clientWidth / 2 - boundingRect.left;
    const clientY = clientHeight / 2 - boundingRect.top;

    // compute width and height increment factor
    const xFactor = (clientX - diagramModel.getOffsetX()) / oldZoomFactor / clientWidth;
    const yFactor = (clientY - diagramModel.getOffsetY()) / oldZoomFactor / clientHeight;

    diagramModel.setOffset(diagramModel.getOffsetX() - widthDiff * xFactor, diagramModel.getOffsetY() - heightDiff * yFactor);

    this.setState({
      engine,
    });
  }

  onDiagramUnfocus() {
    const { engine } = this.state;
    engine.getDiagramModel().clearSelection();
  }

  repaint() {
    const { engine } = this.state;
    engine.repaintCanvas();
  }

  loadDiagram(diagram) {
    const { engine, diagrams, global_variables } = this.state;
    const { preview, setError } = this.props;
    const model = new SRD.DiagramModel();
    model.setLocked(true);

    let diagram_json = false;
    try {
      diagram_json = JSON.parse(diagram.data);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
    }
    if (preview) {
      model.setLocked(true);
    }
    if (diagram_json) {
      // CONVERT DEPRECATED BLOCKS
      diagram_json = convertDiagram(diagram_json, diagrams);

      // This should not happen
      if (diagram_json.nodes.length === 0) {
        diagram_json = new_template;
      }
      engine.setSuperSelect(null);
      model.deSerializeDiagram(diagram_json, engine);
      model.addListener({ nodesUpdated: this.unsave });
      model.addListener({ linksUpdated: this.unsave });

      const nodes = model.getNodes();
      // eslint-disable-next-line guard-for-in, no-restricted-syntax
      for (const key in nodes) {
        if (nodes[key].extras.type === 'story' || nodes[key].extras.type === 'comment') {
          nodes[key].clearListeners();
          nodes[key].addListener({ entityRemoved: (e) => e.stopPropagation() });
        }
      }

      const links = model.getLinks();
      // eslint-disable-next-line guard-for-in, no-restricted-syntax
      for (const key in links) {
        links[key].setColor(line_color);
        links[key].setWidth(line_width);
      }

      engine.stopMove();
      engine.setDiagramModel(model);
      // make sure variables are unique and don't overlap with global variables
      const variables = [];
      if (Array.isArray(diagram.variables)) {
        diagram.variables.forEach((v) => {
          if (!variables.includes(v) && !global_variables.includes(v)) {
            variables.push(v);
          }
        });
      }

      this.setState({
        open: false,
        engine,
        diagram_name: diagram.title ? diagram.title : 'New Flow',
        loading_diagram: false,
        variables,
      });

      this.setState({ saved: true });
    } else {
      setError('Could Not Open Project - Corrupted File');
    }
  }

  onLoadDiagrams() {
    const { skill } = this.state;
    const { diagram_id, setError } = this.props;
    axios
      .get(`/skill/${skill.skill_id}/diagrams`, {
        headers: { Pragma: 'no-cache' },
      })
      .then((res) => {
        this.setState(
          {
            diagrams: res.data.map((flow) => {
              try {
                return {
                  id: flow.id,
                  name: flow.name,
                  sub_diagrams: JSON.parse(flow.sub_diagrams),
                };
              } catch (err) {
                return {
                  id: flow.id,
                  name: flow.name,
                };
              }
            }),
          },
          () => {
            this.onLoadId(diagram_id);
          }
        );
      })
      .catch((err) => {
        console.error(err.response);
        setError('Could Not Retrieve Project Diagrams');
      });
  }

  onLoadId(diagram_id) {
    axios
      .get(`/diagram/${diagram_id}`, {
        headers: { Pragma: 'no-cache' },
      })
      .then((res) => {
        this.loadDiagram(res.data);
        if (this.buildDiagrams !== null) {
          this.buildDiagrams(diagram_id);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }

  render() {
    const { diagram_id } = this.props;
    const { diagrams, engine, loading_diagram } = this.state;
    const diagram = _.find(diagrams, ['id', diagram_id]);
    return (
      <React.Fragment>
        <div id="lightcanvas">
          {loading_diagram && <Spinner name="Preview" />}
          <div key={diagram_id} id="diagram" onDrop={this.onDrop} onDragOver={(e) => e.preventDefault()} onClick={this.clickDiagram}>
            <div id="widget-bar">
              <ButtonGroup>
                <Button isWhiteCirc onClick={() => this.zoom(1000)} className="round-left">
                  <i className="far fa-plus" />
                </Button>
                <Button isWhiteCirc onClick={() => this.zoom(-1000)} className="round-right">
                  <i className="far fa-minus" />
                </Button>
              </ButtonGroup>
            </div>
            <SRD.DiagramWidget
              nodeProps={{
                hasFlow: _.noop,
                enterFlow: _.noop,
                removeNode: _.noop,
                diagram,
                removeCombineNode: _.noop,
                addRemoveListener: _.noop,
                disabled: true,
              }}
              diagramEngine={engine}
              clickDiagram={_.noop}
              allowLooseLinks={false}
              locked={true}
            />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setError: (err) => dispatch(setError(err)),
  };
};
export default connect(
  null,
  mapDispatchToProps
)(LightCanvas);
