import React, { Component } from 'react'
// import moment from 'moment'
// import 'react-table/react-table.css'
import { Link } from 'react-router-dom'
import Masonry from 'react-masonry-component'
import './DashBoard.css'
import axios from 'axios'
import ConfirmModal from './../../components/Modals/ConfirmModal'
import WarningModal from './../../components/Modals/WarningModal'
import SkillCard from './Skill/SkillCard'
import {Alert} from 'reactstrap'

class DashBoard extends Component {
    constructor(props) {
        super(props)

        this.state = { 
            confirm: false,
            loading: false,
            skills: null,
            modal: false,
            onboarding: false,
            error: null
        }

        this.onLoadSkills = this.onLoadSkills.bind(this)
        this.openSkill = this.openSkill.bind(this)
        this.copySkill = this.copySkill.bind(this)
        this.deleteSkill = this.deleteSkill.bind(this)
    }

    deleteSkill(skill_id, skill_name){
        this.setState({
            confirm: {
                text: <Alert color="danger" className="mb-0">WARNING: This action can not be undone, <i>{skill_name}</i> and all flows can not be recovered</Alert>,
                warning: true,
                confirm: () => {
                    axios.delete(`/skill/${skill_id}`)
                    .then(() => {
                        let skills = this.state.skills
                        skills = skills.filter(s => s.skill_id !== skill_id)
                        this.setState({
                            confirm: null,
                            skills: skills
                        })
                    })
                    .catch(err => {
                        console.log(err)
                        this.setState({
                            confirm: null,
                            error: 'Error Deleting Skill'
                        })
                    })
                }
            }
        })
    }

    openSkill(skill, diagram){
        setTimeout(() => { 
            this.props.history.push(`/canvas/${skill}/${diagram}`);
        }, 100);
    }

    componentDidMount() {
        this.onLoadSkills()
    }

    toggleDropDown() {
        this.setState({
          dropdownOpen: !this.state.dropdownOpen
        });
    }

    toggleEnv() {
        this.setState({
            openEnv: !this.state.openEnv
        })
    }

    onLoadSkills() {
        axios.get('/skills')
        .then(res => {
            this.setState({
                skills: res.data,
                loading: false
            }, ()=>{
                if(!res.data.length){
                    this.setState({
                        onboarding: !!localStorage.getItem("onboarding")
                    })
                }
            })
        })
        .catch( error => {
            console.log(error);
        });
    }

    dismissLoadingModal() {
        this.setState({
            loading: false
        });
    }

    copySkill(skill_id) {
        axios.post(`/skill/${skill_id}/${window.user_detail.id}/copy`)
        .then(res => {
            let skills = this.state.skills
            skills.push(res.data)
            this.setState({
                skills: skills
            })
        })
        .catch(err => {
            this.setState({
                error: 'Error copying skill'
            })
        })
    }

    render() {
        let skills;

        if(this.state.skills === null){
            skills = <div className="super-center w-100 text-muted mt-5">
                        <div className="text-center">
                            <h5 className="pb-3">Loading Skills</h5>
                            <h1><span className="loader"/></h1>
                        </div>
                     </div>
        }else if(this.state.skills.length === 0){
            skills = <div className="super-center w-100 text-muted mt-5">
                <div className="horizontal-center mt-5">
                    <div className="">
                      <div className="card-body p-4">
                        <img src="/images/entertainment-icon.svg" alt="skill-icon" width="400" style={{height: 259}} className="mb-5"/><br/>
                        <Link to="/canvas/new" className="no-underline super-center">
                            <button varient="contained" className="purple-btn w-75" id="createskill">Create Skill</button>
                        </Link>
                            <small>
                                <a href="https://intercom.help/vfu" className="text-muted super-center mt-3" target="_blank" rel="noopener noreferrer">
                                    <b>Voiceflow University</b>
                                    <i className="fal fa-long-arrow-right ml-1"/>
                                </a>
                            </small>
                        </div>
                    </div>
                </div>
             </div>
        }else{
            skills = <Masonry elementType='div' className="skills-container">
                {this.state.skills.map((skill, i) => 
                    <SkillCard
                        key={i}
                        skill={skill}
                        open={this.openSkill}
                        history={this.props.history}
                        copySkill={()=>this.copySkill(skill.skill_id)}
                        deleteSkill={()=>this.deleteSkill(skill.skill_id, skill.name)}
                    />)}
            </Masonry>
        }

        return (
            <div className='Window'>
                <div className="subheader">
                    <div className="container space-between">
                        <span className="subheader-title">
                            <b>Dashboard</b>
                            <div className="hr-label">
                                <small><i className="far fa-user mr-1"></i></small>{' '}
                                {this.props.user.name}{' '}
                                <small><i className="far fa-chevron-right"/></small>{' '} 
                                <span className="text-secondary">Skills</span>
                            </div>
                        </span>
                        <div className="subheader-right">
                            <Link to="/canvas/new" className="no-underline">
                                <button varient="contained" className="purple-btn"><i className="far fa-plus mr-2"/> New Project</button>
                            </Link>
                        </div>
                    </div>
                </div>
                <ConfirmModal confirm={this.state.confirm} toggle={()=>this.setState({confirm: null})}/>
                <WarningModal error={this.state.error} dismiss={()=>this.setState({error: null})}/>
                <div className="my-5 pt-5 container">
                    {skills}
                </div>
            </div>
        );
    }
}

export default DashBoard;
