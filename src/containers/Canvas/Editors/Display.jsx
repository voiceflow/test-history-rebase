/* eslint-disable simple-import-sort/sort */
import './Display.css';
import AceEditor from 'react-ace';
import 'brace/mode/json_custom';
import 'brace/theme/monokai';
import 'brace/ext/language_tools';
/* eslint-enable simple-import-sort/sort */

import axios from 'axios';
import { ModalHeader } from 'components/Modals/ModalHeader';
import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import { Tooltip } from 'react-tippy';
import { Button, Input, InputGroup, InputGroupAddon, Modal, ModalBody } from 'reactstrap';

import DisplayRender from './components/DisplayRender';

export class Display extends Component {
  constructor(props) {
    super(props);

    let selected;
    if (props.node.extras.display_id) {
      const find = props.displays.find((t) => t.display_id === props.node.extras.display_id);
      if (find) {
        selected = {
          label: find.title,
          value: find.display_id,
        };
      }
    }

    this.state = {
      node: props.node,
      selected,
      modal: false,
      current_request: false,
      user_variables: {},
      variables: [],
      variables_error: '',
      modal_error: '',
      rendered_datasource: '',
    };

    this.onChange = this.onChange.bind(this);
    this.selectDisplay = this.selectDisplay.bind(this);
    this.onChangeEditor = this.onChangeEditor.bind(this);
    this.onChangeCommands = this.onChangeCommands.bind(this);
    this.updateOnChange = this.updateOnChange.bind(this);
    this.renderDisplayTest = this.renderDisplayTest.bind(this);
    this.testDisplay = this.testDisplay.bind(this);
    this.handleVariableChange = this.handleVariableChange.bind(this);
    this.openModal = this.openModal.bind(this);
  }

  onChange(e) {
    const node = node;
    node.extras[e.target.name] = e.target.value;

    this.setState(
      {
        node,
      },
      () => onUpdate()
    );
  }

  onChangeEditor(value) {
    const node = node;
    node.extras.datasource = value;
    this.setState(
      {
        node,
      },
      () => onUpdate()
    );
  }

  onChangeCommands(value) {
    const node = node;
    node.extras.apl_commands = value;
    this.setState(
      {
        node,
      },
      () => onUpdate()
    );
  }

  updateOnChange() {
    const node = node;
    node.extras.update_on_change = !node.extras.update_on_change;
    this.setState(
      {
        node,
      },
      () => onUpdate()
    );
  }

  selectDisplay(selected) {
    if (selected.value === node.extras.display_id) return;

    const find = displays.find((t) => t.display_id === selected.value);
    const node = node;
    node.extras.display_id = find.display_id;
    node.extras.datasource = find.datasource.trim() ? find.datasource : '';

    this.setState(
      {
        selected,
        node,
        modal_error: '',
      },
      () => onUpdate()
    );
  }

  handleVariableChange(e) {
    const user_variables = user_variables;
    user_variables[e.target.name] = e.target.value;
    this.setState({
      user_variables,
      variables_error: '',
    });
  }

  testDisplay() {
    let datasource = node.extras.datasource;

    for (let i = 0; i < variables.length; i++) {
      const variable = variables[i];
      const user_variable = user_variables[variable];
      if (_.isNil(user_variable) || user_variable === '') {
        this.setState({
          variables_error: 'Variables cannot be blank!',
        });
        return;
      }
    }

    if (!current_request) {
      this.setState({
        current_request: true,
        modalContent: null,
      });

      Object.entries(user_variables).forEach(([old_str, new_str]) => {
        const replacement = new_str;
        const re = new RegExp(`{${old_str}}`, 'g');
        datasource = datasource.replace(re, replacement);
      });

      axios
        .get(`/multimodal/display/${node.extras.display_id}`)
        .then((res) => {
          this.setState({
            modalContent: res.data.document,
            current_request: false,
            rendered_datasource: datasource,
          });
        })
        .catch((err) => {
          this.setState({
            modalContent: err,
            current_request: false,
          });
        });
    }
  }

  openModal() {
    const datasource = node.extras.datasource;
    const variables = (datasource.match(/{\w+}/g) || []).map((s) => s.slice(1, -1));

    if (!node.extras.display_id) {
      this.setState({
        modal_error: 'Select a display first from the drop down!',
      });
      return;
    }

    this.setState(
      {
        modal: true,
        modalContent: null,
        variables,
        variables_error: '',
        user_variables: {},
        rendered_datasource: null,
      },
      () => this.testDisplay()
    );
  }

  // Render entire modal
  renderDisplayTest() {
    const { variables, modalContent, variables_error, current_request, rendered_datasource } = this.state;

    const loading = (
      <div className="text-center mt-3">
        <div className="loader text-lg" />
      </div>
    );
    if (_.isNil(modalContent) && _.isEmpty(variables)) {
      return loading;
    }

    return (
      <div>
        {!_.isEmpty(variables) && (
          <React.Fragment>
            <Button color="primary" onClick={() => this.testDisplay()} className="mt-2" disabled={variables_error}>
              <i className="fas fa-play mr-2" /> Run
            </Button>
            <br />
            <label>We've detected you are using variables in your Data Source JSON, please set variables and run</label>
            <br />
            {_.map(variables, (val, key) => (
              <React.Fragment key={key}>
                <InputGroup className="mb-2">
                  <InputGroupAddon addonType="prepend">{val}</InputGroupAddon>
                  <Input
                    className="form-control form-control-border right"
                    name={val}
                    placeholder="set variable"
                    onChange={this.handleVariableChange}
                  />
                </InputGroup>
              </React.Fragment>
            ))}
          </React.Fragment>
        )}
        {modalContent && variables_error && <div className="error-message text-center">{variables_error}</div>}
        {current_request && loading}
        {modalContent && <div className="space-between flex-hard" />}

        {modalContent && (
          <DisplayRender
            apl={modalContent}
            data={rendered_datasource}
            commands={node.extras.apl_commands}
            error={(e) => this.setState({ variables_error: e })}
          />
        )}
      </div>
    );
  }

  disableModal = () => this.setState({ modal: false });

  render() {
    const { displays, skill_id } = this.props;
    const { modal, modal_error, node } = this.state;

    if (displays.length === 0) {
      return (
        <div className="text-center">
          <img className="mb-3 mt-5" src="/images/desktop.svg" alt="user" width="80" />
          <br />
          <span className="text-muted">You currently have no Multimodal Displays</span>
          <Link className="btn btn-secondary mt-3" to={`/visuals/${skill_id}`}>
            Add Displays
          </Link>
        </div>
      );
    }

    return (
      <React.Fragment>
        <Modal size="lg" isOpen={modal} toggle={this.disableModal}>
          <ModalHeader toggle={this.disableModal} header="Multimodal Display Test" />
          <ModalBody>{modal && this.renderDisplayTest()}</ModalBody>
        </Modal>
        <div>
          <label>Multimodal Display</label>
          <Select
            classNamePrefix="select-box"
            value={selected}
            onChange={this.selectDisplay}
            placeholder="Select Multimodal Display"
            options={displays.map((t) => {
              return {
                value: t.display_id,
                label: t.title,
              };
            })}
          />
          <InputGroup className="my-3">
            <label className="input-group-text w-100 m-0 d-flex">
              <Input
                addon
                type="checkbox"
                value={node.extras.update_on_change}
                checked={node.extras.update_on_change}
                onChange={this.updateOnChange}
              />
              <div className="ml-2 space-between flex-hard">
                <span>Update on Variable Changes</span>
                <span>
                  <Tooltip
                    className="menu-tip"
                    title="When this option is checked, the multimodal display will update whenever a change is detected in any of the variables used in the Data Source JSON"
                    position="bottom"
                    theme="block"
                  >
                    ?
                  </Tooltip>
                </span>
              </div>
            </label>
          </InputGroup>
          <hr />
          <Button color="clear" onClick={this.openModal} size="sm" block>
            <i className="fas fa-power-off mr-1" />
            Test Display
          </Button>
          {modal_error && <div className="error-message">{modal_error}</div>}
          <label>Data Source JSON</label>
          <AceEditor
            name="datasource_editor"
            className="datasource_editor"
            mode="json_custom"
            theme="monokai"
            onChange={this.onChangeEditor}
            fontSize={14}
            showPrintMargin={false}
            showGutter={true}
            highlightActiveLine={true}
            value={node.extras.datasource}
            editorProps={{
              $blockScrolling: true,
              $rules: {
                start: [
                  {
                    token: 'highlightWords',
                    regex: 'word1|word2|word3|phrase one|phrase number two|etc',
                  },
                ],
              },
            }}
            setOptions={{
              enableBasicAutocompletion: true,
              enableLiveAutocompletion: false,
              enableSnippets: false,
              showLineNumbers: true,
              tabSize: 2,
              useWorker: false,
            }}
          />
          <label>APL Commands</label>
          <AceEditor
            name="apl_commands_editor"
            className="datasource_editor"
            mode="json_custom"
            theme="monokai"
            onChange={this.onChangeCommands}
            fontSize={14}
            showPrintMargin={false}
            showGutter={true}
            highlightActiveLine={true}
            value={node.extras.apl_commands}
            editorProps={{
              $blockScrolling: true,
              $rules: {
                start: [
                  {
                    token: 'highlightWords',
                    regex: 'word1|word2|word3|phrase one|phrase number two|etc',
                  },
                ],
              },
            }}
            setOptions={{
              enableBasicAutocompletion: true,
              enableLiveAutocompletion: false,
              enableSnippets: false,
              showLineNumbers: true,
              tabSize: 2,
              useWorker: false,
            }}
          />
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.account,
  skill_id: state.skills.skill_id,
  displays: state.displays.displays,
});
export default connect(mapStateToProps)(Display);
