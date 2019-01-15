import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import ErrorModal from './../../components/Modals/ErrorModal'
import ConfirmModal from './../../components/Modals/ConfirmModal'
import axios from 'axios';
import MUIButton from '@material-ui/core/Button'
import CardActionArea from '@material-ui/core/CardActionArea'
import { Card } from 'reactstrap'

class Templates extends Component {

    constructor(props) {
        super(props);

        this.state = {
            templates: [],
            loading: true,
            error: null,
            confirm: null
        }

        this.deleteTemplate = this.deleteTemplate.bind(this);
    }

    componentWillMount() {
        axios.get(`/email/templates?skill_id=${this.props.skill_id}`)
        .then(res => {
            if(Array.isArray(res.data)){
                this.setState({
                    templates: res.data,
                    loading: false
                })
            }else{
                this.setState({
                    loading: false
                })
            }
        })
        .catch(err => {
            console.error(err);
            this.setState({
                error: {
                    message: 'Unable to Retrieve Templates',
                },
                loading: false
            });
        })
    }

    deleteTemplate(id) {
        this.setState({confirm: null});

        axios.delete(`/email/template/${id}`)
        .then(()=>{
            let templates = this.state.templates;
            let index = templates.findIndex(t => t.template_id === id);
            if (index > -1) {
              templates.splice(index, 1);
            }
            this.setState({
                templates: templates
            });
        })
        .catch(err=>{
            console.error(err)
            this.setState({
                error: {
                    message: 'Unable to delete diagram',
                }
            });
        });
    }

    render() {

        return (
            <div className="business-page-inner">
                <ErrorModal error={this.state.error} dismiss={()=>this.setState({error: null})}/>
                {!!this.state.confirm && <ConfirmModal 
                    toggle={() => this.setState({confirm: null})}
                    confirm={this.state.confirm}
                />}
                { this.state.loading ? 
                    <div className="super-center h-100 w-100">Loading...</div> :
                    <div className="content">
                        <Link to={`/business/${this.props.skill_id}/email/template/new`} className="no-underline">
                            <MUIButton varient="contained" className="purple-btn"><i className="far fa-plus mr-2"/> New Template</MUIButton>
                        </Link>
                        <hr/>
                        {this.state.templates.length === 0 ? 
                            <h5 className="text-muted">No Email Templates</h5> :
                            <React.Fragment>
                                {this.state.templates.map(template => 
                                    <Card key={template.template_id} className="template-card">
                                        <CardActionArea className="template-card-action"
                                            onClick={()=>this.props.history.push(`/business/${this.props.skill_id}/email/template/${template.template_id}`)}>
                                            <div>
                                                <h5>{template.title}</h5>
                                                <small className="text-muted"><b>id:</b> {template.template_id}</small><br/>
                                                <small className="text-muted"><b>subject:</b> {template.subject ? template.subject : <span className="empty-badge">EMPTY</span>}</small>
                                            </div>
                                        </CardActionArea>
                                        <div className="template-card-delete" onClick={()=>{
                                            this.setState({
                                                confirm: {
                                                    text: 'Are you sure you want to delete this template? Any Skill using this template will fail to send emails',
                                                    confirm: ()=> this.deleteTemplate(template.template_id)
                                                }
                                            })
                                        }}>
                                            Delete <br/>
                                            <i className="fas fa-trash"/>
                                        </div>
                                    </Card>
                                )}
                            </React.Fragment>
                        }
                    </div>
                }
            </div>
        )
    }
}

export default Templates;
