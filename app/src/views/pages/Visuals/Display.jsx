import React, { Component } from 'react';
import { connect } from 'react-redux'

import { addDisplay, updateDisplay } from "ducks/display"
import { setError } from 'ducks/modal'

import { Spinner } from 'views/components/Spinner'
import axios from 'axios';
import { Input, Row, Col, FormGroup, Button } from 'reactstrap';
import Dropzone from 'react-dropzone';

import AceEditor from 'react-ace';

import 'brace/mode/json';
import 'brace/theme/monokai';
import 'brace/ext/language_tools';

import './Display.css'

class Display extends Component {

    constructor(props) {
        super(props);

        let id = this.props.computedMatch.params.id;
        let is_new = (id === 'new');

        this.state = {
            loading: !is_new,
            display_id: id,
            document: is_new ? 'Write/Paste APL Document Here' : '',
            title: '',
            description: '',
            datasource: '',
            saved: !is_new,
            saving: false
        }

        this.onChange = this.onChange.bind(this);
        this.save = this.save.bind(this);
        this.onChangeDocument = this.onChangeDocument.bind(this)
        this.onChangeDataSource = this.onChangeDataSource.bind(this)
        this.onDropJSON = this.onDropJSON.bind(this)
    }

    onChange(e){
        this.setState({
            [e.target.name]: e.target.value,
            saved: false
        });
    }

    componentDidMount() {
        if(this.state.display_id !== 'new'){
            axios.get('/multimodal/display/' + this.state.display_id)
            .then(res => {
                this.setState({
                    document: res.data.document,
                    datasource: res.data.datasource ? res.data.datasource : '',
                    title: res.data.title,
                    description: res.data.description,
                    loading: false
                });
            }).catch(err => {
                console.error(err);
                this.props.setError({
                        message: 'Unable to Retrieve Display',
                    })
            })
        }else{
            this.setState({
                title: 'New Display'
            });
        }
    }

    onChangeDocument(value) {
        this.setState({
            saved: false,
            document: value
        })
    }

    onChangeDataSource(value) {
        this.setState({
            saved: false,
            datasource: value
        })
    }

    save() {
        if(this.state.saved) return;
        if(!this.state.title){
            this.setState({
                error: {
                    message: 'Empty Display Title'
                }
            })
            return
        }

        this.setState({
            saving: true
        });

        let payload = {
            document: this.state.document,
            datasource: this.state.datasource,
            title: this.state.title,
            description: this.state.description
        }

        if(this.state.display_id === 'new'){
            axios.post(`/multimodal/display?skill_id=${this.props.skill_id}`, payload)
            .then(res=>{
                // get display id back
                this.props.history.push(`/visuals/${this.props.skill_id}/display/${res.data}`);
                payload.display_id = res.data;
                this.props.dispatch(addDisplay(payload));
                this.setState({
                    display_id: res.data,
                    saved: true,
                    saving: false
                })
            })
            .catch(err=>{
                console.error(err);
                this.props.setError({
                  message: "Unable to save new display"
                });
                this.setState({
                    saving: false
                })
            })
        }else{
            axios.patch(`/multimodal/display/${this.state.display_id}?skill_id=${this.props.skill_id}`, payload)
            .then(res=>{
                payload.display_id = this.state.display_id;
                this.props.dispatch(updateDisplay(payload))
                this.setState({
                    saved: true,
                    saving: false
                });
            })
            .catch(err=>{
                console.error(err);
                this.props.setError({
                  message: "Unable to save display"
                });
                this.setState({
                    saving: false
                });
            });
        }
    }

    onDropJSON(accepted, rejected) {
        if(Array.isArray(accepted) && accepted.length === 1){
            let fileReader = new FileReader()

            const handleFileRead = (e) => {
                let data = fileReader.result;
                let document, datasource
                try{
                    data = JSON.parse(data)
                    if(data.document && data.document.type && data.document.version){
                        document = data.document
                        if(data.datasources){
                          datasource = data.datasources
                        }else if(data.dataSources){
                          datasource = data.dataSources
                        }
                    }else if(data.type && data.version){
                        document = data
                    }else{
                        throw new Error("Unable to parse document")
                    }
                    this.setState({
                        saved: false,
                        document: JSON.stringify(document, null, "\t"),
                        datasource: JSON.stringify(datasource, null, "\t")
                    })
                }catch(err){
                    return this.props.setError("Invalid JSON Format")
                }
            }

            fileReader.onloadend = handleFileRead;
            fileReader.readAsText(accepted[0])
        }else if(Array.isArray(rejected) && rejected.length > 0){
            this.props.setError("APL JSON Files Only")
        }
    }

    render() {

        return (
            <div className="business-page-inner">
                { this.state.loading ? 
                    React.createElement(Spinner, {name: 'Displays'}) :
                    <Dropzone
                        id="page-drop"
                        activeClassName="active"
                        rejectClassName="reject"
                        multiple={false}
                        disableClick={true}
                        maxSize={1024*1024}
                        accept={".json,.JSON,application/json"}
                        onDrop={this.onDropJSON}
                    >
                        {({getRootProps, getInputProps, open}) => (
                            <React.Fragment>
                            <div className="drop-overlay active">
                                <div>
                                    <h1>
                                        <i className="fas fa-file-code"/>
                                    </h1>
                                    <p>Drag and Drop APL JSON Files</p>
                                </div>
                                
                            </div>
                            <div className="drop-overlay reject">
                                <div>
                                    <h1>
                                        <i className="fas fa-file-times"/>
                                    </h1>
                                    <p>APL JSON Files Only</p>
                                </div>
                            </div>
                            <div className="content">
                            <div className="space-between">
                                <div className="text-muted"><h5 className="mb-0">APL Template</h5> <small><i className="far fa-link"/> ( <a href="https://developer.amazon.com/alexa/console/ask/displays" target="_blank" rel="noopener noreferrer">Authoring Tool</a> )</small></div>
                                <div className="subheader-right">
                                    <button varient="contained" className="btn-tertiary mr-2" onClick={()=>{
                                        this.props.history.push(`/visuals/${this.props.skill_id}`);
                                    }}>
                                        {' '}Back
                                    </button>
                                    <button varient="contained" className="btn-primary" onClick={this.save} style={{width: 100}}>
                                        {this.state.saving ? 
                                            <span className="loader"/> : 
                                            <React.Fragment>
                                                Save{this.state.saved ? '' : '*'}
                                            </React.Fragment>
                                        }
                                    </button>
                                </div>
                            </div>
                            <hr/>
                            <FormGroup className="mt-0">
                                <label>Display Name</label>
                                <Input 
                                    name="title"
                                    placeholder="Name of Display"
                                    value={this.state.title}
                                    onChange={this.onChange}
                                />
                            </FormGroup>
                            <FormGroup>
                                <label>Description</label>
                                <Input 
                                    name="description"
                                    placeholder="Description of Display"
                                    value={this.state.description}
                                    onChange={this.onChange}
                                />
                            </FormGroup>
                            <hr/>
                            <Button color="clear" block onClick={() => open()} className="mb-4"><i className="fas fa-file-code mr-1"/> Upload JSON File</Button>
                            <FormGroup>
                                <Row className="no-padding-row">
                                    <Col md="6">
                                        <div>
                                            APL Document
                                        </div>
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
                                            value={this.state.document}
                                            editorProps={{$blockScrolling: true}}
                                            setOptions={{
                                                enableBasicAutocompletion: true,
                                                enableLiveAutocompletion: false,
                                                enableSnippets: false,
                                                showLineNumbers: true,
                                                tabSize: 2,
                                                useWorker: false
                                            }}/>
                                    </Col>
                                    <Col md="6">
                                        <div>
                                            Default Datasource (optional)
                                        </div>
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
                                            value={this.state.datasource}
                                            editorProps={{$blockScrolling: true}}
                                            setOptions={{
                                                enableBasicAutocompletion: true,
                                                enableLiveAutocompletion: false,
                                                enableSnippets: false,
                                                showLineNumbers: true,
                                                tabSize: 2,
                                                useWorker: false
                                            }}/>
                                    </Col>
                                </Row>
                            </FormGroup>
                            </div>
                            </React.Fragment>
                        )}
                    </Dropzone>
                }
            </div>
        )
    }
}

const mapStateToProps = state => ({
    skill_id: state.skills.skill.skill_id
})

const mapDispatchToProps = dispatch => {
    return {
        setError: err => dispatch(setError(err)),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Display);
