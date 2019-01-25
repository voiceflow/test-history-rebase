import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios';
import MUIButton from '@material-ui/core/Button'
import VoiceCards from 'views/components/Cards/VoiceCards'
import EmptyCard from 'views/components/Cards/EmptyCard'
import Masonry from 'react-masonry-component';

class Emails extends Component {

    constructor(props) {
        super(props);

        this.state = {
            templates: [],
            loading: true,
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
                loading: false
            })
            this.props.onError('Unable to Retrieve Templates')
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
            this.props.onError('Unable to delete diagram')
        });
    }

    render() {
        if(this.state.loading){
            return <div id="loading-diagram">
                <div className="text-center">
                    <h5 className="text-muted mb-2">Loading Emails</h5>
                    <span className="loader"/>
                </div>
            </div>
        }
        return (
            <div className="h-100 w-100">
                <React.Fragment>
                    {this.state.templates.length === 0 ?
                        <div className="super-center w-100 h-100">
                            <div className="empty-container">
                                <img src='/images/email_2.svg' alt="open safe" width="100"/>
                                <p className="empty">No Email Templates Exist</p>
                                <p className="empty-desc">Send users emails from within your project to provide context or deliver relivant content</p>
                                <Link to={`/business/${this.props.skill_id}/email/new`} className="no-underline">
                                    <MUIButton varient="contained" className="purple-btn">Create a Template</MUIButton>
                                </Link>
                            </div>
                        </div>
                        :
                        <div className="px-4 mx-3 mb-5 pt-3">
                            <div className="products-container position-relative">
                                <div className="space-between w-100 px-3">
                                    <h5 className="text-muted">Email Templates</h5>
                                    <Link to={`/business/${this.props.skill_id}/email/new`} className="no-underline btn purple-btn">
                                        New Template
                                    </Link>
                                </div>
                                <Masonry elementType='div' imagesLoadedOptions={{columnWidth: '200', itemSelector: ".grid-item"}}>
                                    {this.state.templates.map(template => {
                                        let name = template.title.match(/\b(\w)/g)
                                        if(name) { name = name.join('') }
                                        else { name = template.title }
                                        name = name.substring(0,3)

                                        return <VoiceCards
                                            key={template.template_id}
                                            id={template.template_id}
                                            name={template.title}
                                            placeholder={<div className='no-image card-image'><h1>{name}</h1></div>}
                                            onDelete={this.deleteTemplate}
                                            deleteLabel="Delete Template"
                                            onClick={()=>this.props.history.push(`/business/${this.props.skill_id}/email/${template.template_id}`)}
                                            buttonLabel="Edit Template"
                                            desc={template.subject ? template.subject : <span className="empty-badge">No Subject</span>}
                                        />
                                    })}
                                    <EmptyCard onClick={`/business/${this.props.skill_id}/email/new`}/>
                                </Masonry>
                            </div>
                        </div>
                    }
                </React.Fragment>
            </div>
        )
    }
}

export default Emails
