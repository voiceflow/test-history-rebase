import './Display.css';

import axios from 'axios';
import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import { connect } from 'react-redux';
import { Col, FormGroup, Row } from 'reactstrap';
import { compose } from 'redux';
import { getFormValues, isDirty, reduxForm } from 'redux-form';

import AceEditor from '@/components/AceEditor';
import Button from '@/components/Button';
import { Spinner } from '@/components/Spinner';
import { FormTextInput } from '@/componentsV2/form/TextInput';
import { addDisplay, updateDisplay } from '@/ducks/display';
import { setError } from '@/ducks/modal';

const DISPLAY_FORM_NAME = 'display_visual_form';

class Display extends Component {
  constructor(props) {
    super(props);
    const { computedMatch } = this.props;

    const id = computedMatch.params.id;
    const is_new = id === 'new';

    this.state = {
      loading: !is_new,
      display_id: id,
      document: is_new ? 'Write/Paste APL Document Here' : '',
      title: '',
      description: '',
      datasource: '',
      saved: !is_new,
      saving: false,
    };

    this.onChange = this.onChange.bind(this);
    this.save = this.save.bind(this);
    this.onChangeDocument = this.onChangeDocument.bind(this);
    this.onChangeDataSource = this.onChangeDataSource.bind(this);
    this.onDropJSON = this.onDropJSON.bind(this);
  }

  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
      saved: false,
    });
  }

  componentDidMount() {
    const { display_id } = this.state;
    const { setError } = this.props;
    if (display_id !== 'new') {
      axios
        .get(`/multimodal/display/${display_id}`)
        .then((res) => {
          this.setState({
            document: res.data.document,
            datasource: res.data.datasource ? res.data.datasource : '',
            title: res.data.title,
            description: res.data.description,
            loading: false,
          });
          this.props.initialize({
            display_name: res.data.title,
            display_description: res.data.description,
          });
        })
        .catch((err) => {
          console.error(err);
          setError({
            message: 'Unable to Retrieve Display',
          });
        });
    } else {
      this.setState({
        title: 'New Display',
      });
    }
  }

  onChangeDocument(value) {
    this.setState({
      saved: false,
      document: value,
    });
  }

  onChangeDataSource(value) {
    this.setState({
      saved: false,
      datasource: value,
    });
  }

  save() {
    const { saved, document, datasource, display_id } = this.state;
    const { skill_id, history, dispatch, setError } = this.props;

    const title = this.props.displayForm.display_name;
    const description = this.props.displayForm.display_description;
    if (saved && !this.props.isDirty) return;

    this.setState({
      saving: true,
    });

    const payload = {
      document,
      datasource,
      title,
      description,
    };

    if (display_id === 'new') {
      axios
        .post(`/multimodal/display?skill_id=${skill_id}`, payload)
        .then((res) => {
          // get display id back
          history.push(`/visuals/${skill_id}/display/${res.data}`);
          payload.display_id = res.data;
          dispatch(addDisplay(payload));
          this.setState({
            display_id: res.data,
            saved: true,
            saving: false,
          });
        })
        .catch((err) => {
          console.error(err);
          setError({
            message: 'Unable to save new display',
          });
          this.setState({
            saving: false,
          });
        });
    } else {
      axios
        .patch(`/multimodal/display/${display_id}?skill_id=${skill_id}`, payload)
        .then(() => {
          payload.display_id = display_id;
          dispatch(updateDisplay(payload));
          this.setState({
            saved: true,
            saving: false,
          });
        })
        .catch((err) => {
          console.error(err);
          setError({
            message: 'Unable to save display',
          });
          this.setState({
            saving: false,
          });
        });
    }
  }

  onDropJSON(accepted, rejected) {
    const { setError } = this.props;
    if (Array.isArray(accepted) && accepted.length === 1) {
      // eslint-disable-next-line compat/compat
      const fileReader = new FileReader();

      const handleFileRead = () => {
        let data = fileReader.result;
        let document;
        let datasource;
        try {
          data = JSON.parse(data);
          if (data.document && data.document.type && data.document.version) {
            document = data.document;
            if (data.datasources) {
              datasource = data.datasources;
            } else if (data.dataSources) {
              datasource = data.dataSources;
            }
          } else if (data.type && data.version) {
            document = data;
          } else {
            throw new Error('Unable to parse document');
          }
          this.setState({
            saved: false,
            document: JSON.stringify(document, null, '\t'),
            datasource: JSON.stringify(datasource, null, '\t'),
          });
        } catch (err) {
          return setError('Invalid JSON Format');
        }
      };

      fileReader.onloadend = handleFileRead;
      fileReader.readAsText(accepted[0]);
    } else if (Array.isArray(rejected) && rejected.length > 0) {
      setError('APL JSON Files Only');
    }
  }

  render() {
    const { loading, saving, saved, document, datasource } = this.state;
    const { history, skill_id } = this.props;
    return (
      <form onSubmit={this.props.handleSubmit(this.save)}>
        <div className="business-page-inner">
          {loading ? (
            <Spinner name="Displays" />
          ) : (
            <Dropzone
              id="page-drop"
              activeClassName="active"
              rejectClassName="reject"
              multiple={false}
              disableClick={true}
              maxSize={1024 * 1024}
              accept=".json,.JSON,application/json"
              onDrop={this.onDropJSON}
            >
              {({ open }) => (
                <>
                  <div className="drop-overlay active">
                    <div>
                      <h1>
                        <i className="fas fa-file-code" />
                      </h1>
                      <p>Drag and Drop APL JSON Files</p>
                    </div>
                  </div>
                  <div className="drop-overlay reject">
                    <div>
                      <h1>
                        <i className="fas fa-file-times" />
                      </h1>
                      <p>APL JSON Files Only</p>
                    </div>
                  </div>
                  <div className="content">
                    <div className="space-between">
                      <div className="text-muted">
                        <h5 className="mb-0">APL Template</h5>{' '}
                        <small>
                          <i className="far fa-link" /> ({' '}
                          <a href="https://developer.amazon.com/alexa/console/ask/displays" target="_blank" rel="noopener noreferrer">
                            Authoring Tool
                          </a>{' '}
                          )
                        </small>
                      </div>
                      <div className="subheader-right">
                        <Button
                          isFlat
                          varient="contained"
                          className="mr-2"
                          type="button"
                          onClick={() => {
                            history.push(`/visuals/${skill_id}`);
                          }}
                        >
                          Back
                        </Button>
                        <Button isPrimary varient="contained" style={{ width: 100 }}>
                          {saving ? <Spinner isEmpty /> : <>Save{saved ? '' : '*'}</>}
                        </Button>
                      </div>
                    </div>
                    <hr />
                    <FormGroup className="mt-0">
                      <label>Display Name</label>
                      <FormTextInput name="display_name" type="text" placeholder="Name of Display" />
                    </FormGroup>
                    <FormGroup>
                      <label>Description</label>
                      <FormTextInput name="display_description" type="text" placeholder="Description of Display" />
                    </FormGroup>
                    <hr />
                    <Button isClear onClick={() => open()} className="mb-4 w-100">
                      <i className="fas fa-file-code mr-1" /> Upload JSON File
                    </Button>
                    <FormGroup>
                      <Row className="no-padding-row">
                        <Col md="6">
                          <div>APL Document</div>
                          <AceEditor
                            name="document_editor"
                            className="document_editor"
                            mode="json"
                            theme="monokai"
                            onChange={this.onChangeDocument}
                            fontSize={14}
                            showPrintMargin={false}
                            showGutter={true}
                            highlightActiveLine={true}
                            value={document}
                            editorProps={{ $blockScrolling: true }}
                            setOptions={{
                              enableBasicAutocompletion: true,
                              enableLiveAutocompletion: false,
                              enableSnippets: false,
                              showLineNumbers: true,
                              tabSize: 2,
                              useWorker: false,
                            }}
                          />
                        </Col>
                        <Col md="6">
                          <div>Default Datasource (optional)</div>
                          <AceEditor
                            name="document_editor"
                            className="document_editor"
                            mode="json"
                            theme="monokai"
                            onChange={this.onChangeDataSource}
                            fontSize={14}
                            showPrintMargin={false}
                            showGutter={true}
                            highlightActiveLine={true}
                            value={datasource}
                            editorProps={{ $blockScrolling: true }}
                            setOptions={{
                              enableBasicAutocompletion: true,
                              enableLiveAutocompletion: false,
                              enableSnippets: false,
                              showLineNumbers: true,
                              tabSize: 2,
                              useWorker: false,
                            }}
                          />
                        </Col>
                      </Row>
                    </FormGroup>
                  </div>
                </>
              )}
            </Dropzone>
          )}
        </div>
      </form>
    );
  }
}

const validate = (values) => {
  const errors = {};
  if (!values.display_name) {
    errors.display_name = 'Display Name is Required';
  }
  return errors;
};

const mapStateToProps = (state) => ({
  skill_id: state.skills.skill.skill_id,
  displayForm: getFormValues(DISPLAY_FORM_NAME)(state),
  isDirty: isDirty(DISPLAY_FORM_NAME)(state),
});

const mapDispatchToProps = (dispatch) => {
  return {
    setError: (err) => dispatch(setError(err)),
  };
};
export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  reduxForm({
    form: DISPLAY_FORM_NAME,
    validate,
  })
)(Display);
