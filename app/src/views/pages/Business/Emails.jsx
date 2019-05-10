import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

import Button from 'components/Button'

import { deleteEmail } from 'ducks/email'
import VoiceCards from 'views/components/Cards/VoiceCards'
import EmptyCard from 'views/components/Cards/EmptyCard'
import Masonry from 'react-masonry-component';

class Emails extends Component {

    constructor(props) {
        super(props);

        this.state = {
            confirm: null
        }
    }

    render() {
        if(this.props.loading){
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
                    {this.props.templates.length === 0 ?
                        <div className="super-center w-100 h-100">
                            <div className="empty-container">
                                <img src='/images/email_2.svg' alt="open safe" width="100"/>
                                <p className="empty">No Email Templates Exist</p>
                                <p className="empty-desc">Send users emails from within your project to provide context or deliver relivant content</p>
                                <Link to={`/tools/${this.props.skill_id}/email/new`} className="no-underline">
                                    <Button isPrimary varient="contained">Create a Template</Button>
                                </Link>
                            </div>
                        </div>
                        :
                        <div className="px-4 mx-3 mb-5 pt-3">
                            <div className="products-container position-relative">
                                <div className="space-between w-100 px-3 mb-1">
                                    <h5 className="text-muted mb-0">Email Templates</h5>
                                    <Link to={`/tools/${this.props.skill_id}/email/new`} className="no-underline btn btn-primary">
                                        New Template
                                    </Link>
                                </div>
                                <Masonry elementType='div' imagesLoadedOptions={{columnWidth: '200', itemSelector: ".grid-item"}}>
                                    {this.props.templates.map(template => {
                                        let name = template.title.match(/\b(\w)/g)
                                        if(name) { name = name.join('') }
                                        else { name = template.title }
                                        name = name.substring(0,3)

                                        return <VoiceCards
                                            key={template.template_id}
                                            id={template.template_id}
                                            name={template.title}
                                            placeholder={<div className='no-image card-image'><h1>{name}</h1></div>}
                                            onDelete={id => this.props.deleteEmail(id)}
                                            deleteLabel="Delete Template"
                                            onClick={()=>this.props.history.push(`/tools/${this.props.skill_id}/email/${template.template_id}`)}
                                            buttonLabel="Edit Template"
                                            desc={template.subject ? template.subject : <span className="empty-badge">No Subject</span>}
                                        />
                                    })}
                                    <EmptyCard onClick={()=>this.props.history.push(`/tools/${this.props.skill_id}/email/new`)}/>
                                </Masonry>
                            </div>
                        </div>
                    }
                </React.Fragment>
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        deleteEmail: id => dispatch(deleteEmail(id))
    }
}
const mapStateToProps = state => ({
    templates: state.emails.email_templates,
    skill_id: state.skills.skill.skill_id,
    loading: state.emails.loading
})
export default connect(mapStateToProps, mapDispatchToProps)(Emails)
