import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import ErrorModal from './../../components/Modals/ErrorModal'
import axios from 'axios';
import MUIButton from '@material-ui/core/Button';
import { Input, Col, Row, FormGroup } from 'reactstrap';

import AceEditor from 'react-ace';

import 'brace/mode/html';
import 'brace/theme/monokai';
import 'brace/ext/language_tools';

class Template extends Component {

    constructor(props) {
        super(props);

        let id = this.props.computedMatch.params.id;
        let is_new = (id === 'new');

        this.state = {
            loading: !is_new,
            error: null,
            template_id: id,
            content: is_new ? 'Write/Paste Email HTML Content Here' : '',
            title: '',
            subject: '',
            saved: !is_new,
            sender: 'mail@getvoiceflow.com',
            saving: false
        }

        this.onChangeAce = this.onChangeAce.bind(this);
        this.onChange = this.onChange.bind(this);
        this.save = this.save.bind(this);
    }

    onChange(e){
        this.setState({
            [e.target.name]: e.target.value,
            saved: false
        });
    }

    onChangeAce(content) {
        this.setState({
            content: content,
            saved: false
        });

        if(this.iframe){
            const iframe = this.iframe;
            const doc = iframe.contentDocument;
            doc.body.innerHTML = content;
        }
    }

    componentDidMount() {
        if(this.state.template_id !== 'new'){
            axios.get('/email/template/' + this.state.template_id)
            .then(res => {
                this.setState({
                    content: res.data.content,
                    title: res.data.title,
                    subject: res.data.subject,
                    sender: res.data.sender,
                    loading: false
                });
                if(this.iframe){
                    const iframe = this.iframe;
                    const doc = iframe.contentDocument;
                    doc.body.innerHTML = res.data.content;
                }
            }).catch(err => {
                console.error(err);
                this.setState({
                    error: {
                        message: 'Unable to Retrieve Template',
                    }
                });
            })
        }else{
            this.setState({
                title: 'New Template'
            });
            if(this.iframe){
                const iframe = this.iframe;
                const doc = iframe.contentDocument;
                doc.body.innerHTML = this.state.content;
            }
        }
    }

    save() {
        if(this.state.saved) return;
        if(!this.state.title){
            this.setState({
                error: {
                    message: 'Empty Template Title'
                }
            })
            return
        }

        this.setState({
            saving: true
        });

        let payload = {
            title: this.state.title,
            subject: this.state.subject,
            sender: this.state.sender,
            content: this.state.content
        }

        if(this.state.template_id === 'new'){
            axios.post('/email/template', payload)
            .then(res=>{
                // get template id back
                this.props.history.push('/business/email/template/' + res.data);
                this.setState({
                    template_id: res.data,
                    saved: true,
                    saving: false
                })
            })
            .catch(err=>{
                console.error(err);
                this.setState({
                    error: {
                        message: 'Unable to save new template'
                    },
                    saving: false
                });
            });
        }else{
            axios.patch('/email/template/' + this.state.template_id, payload)
            .then(res=>{
                this.setState({
                    saved: true,
                    saving: false
                });
            })
            .catch(err=>{
                console.error(err);
                this.setState({
                    error: {
                        message: 'Unable to save template'
                    },
                    saving: false
                });
            });
        }
    }

    render() {
        return (
            <div className="business-page-inner">
                <ErrorModal error={this.state.error} dismiss={()=>{
                    this.setState({error: null});
                }}/>
                <div className="subheader">
                    <div className="space-between">
                        <span className="subheader-title">
                            <b>Email</b>
                            <div className="hr-label">
                                <small><i className="far fa-user mr-1"></i></small>{' '} 
                                {this.props.user.name}{' '}
                                <small><i className="far fa-chevron-right"/></small>{' '} 
                                <Link to="/business/email/templates">Templates</Link>{' '}
                                <small><i className="far fa-chevron-right"/></small>{' '}
                                <span className="text-secondary">{this.state.title}</span>
                            </div>
                        </span>
                        <div className="subheader-right">
                            <MUIButton varient="contained" className="purple-btn mr-2" onClick={()=>{
                                this.props.history.push("/business/email/templates");
                            }}>
                                <i className="fas fa-arrow-left mr-2"/>{' '}Back
                            </MUIButton>
                            <MUIButton varient="contained" className="white-btn" onClick={this.save} style={{width: 100}}>
                                {this.state.saving ? 
                                    <span className="loader"/> : 
                                    <React.Fragment>
                                        Save{this.state.saved ? '' : '*'}
                                    </React.Fragment>
                                }
                            </MUIButton>
                        </div>
                    </div>
                </div>
                { this.state.loading ? 
                    <div className="super-center h-100 w-100">Loading...</div> :
                    <div className="content">
                        <FormGroup className="mt-0">
                            <label>Template Title (INTERNAL)</label>
                            <Input 
                                name="title"
                                placeholder="Name of Template"
                                value={this.state.title}
                                onChange={this.onChange}
                            />
                        </FormGroup>
                        <hr/>
                        <FormGroup>
                            <label>Subject</label>
                            <Input 
                                name="subject"
                                placeholder="Subject of Email"
                                value={this.state.subject}
                                onChange={this.onChange}
                            />
                        </FormGroup>

                        <FormGroup>
                            <label>From</label>
                            <Input 
                                name="sender"
                                value={this.state.sender}
                                onChange={this.onChange}
                                readOnly
                                disabled
                            />
                        </FormGroup>

                        <FormGroup>
                            <Row className="no-padding-row">
                                <Col md="6">
                                    <div>
                                        HTML Code
                                    </div>
                                </Col>
                                <Col md="6">
                                    <div>
                                        Preview
                                    </div>
                                </Col>
                            </Row>
                            <Row className="no-padding-row">
                                <Col md="6">
                                    <AceEditor
                                        name="email_editor"
                                        className="email_editor"
                                        mode="html"
                                        theme="monokai"
                                        onChange={this.onChangeAce}
                                        fontSize={14}
                                        showPrintMargin={true}
                                        showGutter={true}
                                        highlightActiveLine={true}
                                        value={this.state.content}
                                        editorProps={{$blockScrolling: true}}
                                        setOptions={{
                                            enableBasicAutocompletion: true,
                                            enableLiveAutocompletion: false,
                                            enableSnippets: false,
                                            showLineNumbers: true,
                                            tabSize: 2
                                        }}/>
                                </Col>
                                <Col md="6">
                                    <iframe
                                        title="email_preview"
                                        className="email_preview"
                                        ref={(frame) => { this.iframe = frame }} 
                                        sandbox="allow-same-origin allow-scripts allow-popups" 
                                    />
                                </Col>
                            </Row>
                        </FormGroup>
                    </div>
                }
            </div>
        )
    }
}

export default Template;
