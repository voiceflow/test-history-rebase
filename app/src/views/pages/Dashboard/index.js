import _ from 'lodash'
import React, { Component } from 'react'
// import moment from 'moment'
// import 'react-table/react-table.css'
import { Link } from 'react-router-dom'
import Masonry from 'react-masonry-component'
import './DashBoard.css'
import axios from 'axios'
import ConfirmModal from './../../components/Modals/ConfirmModal'
import WarningModal from './../../components/Modals/WarningModal'
import VoiceCards from './../../components/Cards/VoiceCards'
import EmptyCard from './../../components/Cards/EmptyCard'
import {Alert, Input} from 'reactstrap'

// const FILTER_OPTIONS = ["All", "Published", "Development"];

class DashBoard extends Component {
    constructor(props) {
        super(props)

        this.state = {
            confirm: false,
            loading: false,
            skills: null,
            filter_skills: null,
            modal: false,
            onboarding: false,
            error: null,
            filter_text: null,
            filter_tab: "All",
        }

        this.onLoadSkills = this.onLoadSkills.bind(this)
        this.openSkill = this.openSkill.bind(this)
        this.copySkill = this.copySkill.bind(this)
        this.deleteSkill = this.deleteSkill.bind(this)
        this.onFilter = this.onFilter.bind(this)
        this.switchTab = this.switchTab.bind(this)
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
                            skills: skills,
                            filter_skills: _.filter(this.state.filter_skills, s => s.skill_id !== skill_id)
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

    toggleEnv() {
        this.setState({
            openEnv: !this.state.openEnv
        })
    }

    switchTab(tab){
        let filter_skills = this.state.skills;
        if (tab === "Published"){
          filter_skills = _.filter(filter_skills, skill => skill.live || skill.review)
        } else if (tab === "Development") {
          filter_skills = _.filter(filter_skills, skill => !skill.live || !skill.review)
        }
        filter_skills = _.filter(filter_skills, skill =>
          _.includes(_.toLower(skill.name), _.toLower(this.state.filter_text))
        )
        if(tab !== this.state.tab){
            this.setState({
                filter_skills: filter_skills,
                filter_tab: tab
            })
        }
    }

    onLoadSkills() {
        axios.get('/skills')
        .then(res => {
            this.setState({
                skills: res.data,
                filter_skills: res.data,
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
            let skills = this.state.skills.slice()
            let filter_skills = this.state.filter_skills.slice()

            skills.push(res.data)
            filter_skills.push(res.data)

            this.setState({
                skills: skills,
                filter_skills: filter_skills,
            })
        })
        .catch(err => {
            this.setState({
                error: 'Error copying skill'
            })
        })
    }

    onFilter(property, e=null) {
      let filtered_skills = this.state.skills;
      if (e) {
        filtered_skills = _.filter(filtered_skills, skill =>
          _.includes(_.toLower(skill[property]), _.toLower(e.value))
        )
      }
      if (this.state.filter_tab === "Published"){
        filtered_skills = _.filter(filtered_skills, skill => skill.live || skill.review)
      } else if (this.state.filter_tab === "Development") {
        filtered_skills = _.filter(filtered_skills, skill => !skill.live || !skill.review)
      }
      this.setState({
        filter_skills: filtered_skills,
        filter_text: e.value
      })
    }

    render() {
        let skills;

        if(this.state.filter_skills === null){
            skills = <div id="loading-diagram">
                <div className="text-center">
                    <h5 className="text-muted mb-2">Loading Skills</h5>
                    <span className="loader"/>
                </div>
            </div>
        }else if(this.state.filter_skills.length === 0 && this.state.skills.length === 0){
            skills = <div className="super-center w-100 text-muted mt-5">
                <div className="horizontal-center mt-5">
                    <div className="">
                      <div className="card-body p-4">
                        <img src="/images/entertainment-icon.svg" alt="skill-icon" width="400" style={{height: 259}} className="mb-5"/><br/>
                        <Link to="/templates" className="no-underline super-center">
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
            skills = <React.Fragment>
                    <div className="search-header">
                    <div className="searchBar w-25">
                        <Input className='form-control-white mb-2 mt-3 search-input form-control' placeholder="Search" onChange={(e) => this.onFilter("name", e.target)}/>
                    </div>
                    {/* <div className="Button-select">
                      <ButtonGroup className="toggle-group mb-2 toggle-group-2">
                          {FILTER_OPTIONS.map(tab => {
                              return <Button
                                  key={tab}
                                  onClick={() => {
                                    this.switchTab(tab)
                                  }}
                                  outline={this.state.filter_tab !== tab}
                                  disabled={this.state.filter_tab === tab}>
                                  {tab}
                              </Button>
                          })}
                      </ButtonGroup>
                    </div> */}
                  </div>
                  <Masonry elementType='div' className="skills-container">
                    {this.state.filter_skills.map((skill, i) => {
                        let icon
                        let smallIcon = skill.small_icon
                        let largeIcon = skill.large_icon
                        if (!_.isNull(largeIcon)) {
                            icon = largeIcon
                        } else if (!_.isNull(smallIcon)) {
                            icon = smallIcon
                        }

                        let name = skill.name.match(/\b(\w)/g)
                        if(name) { name = name.join('') }
                        else { name = skill.name }
                        name = name.substring(0,3)
                        
                        return(
                            <VoiceCards
                                key={i}
                                id={skill.skill_id}
                                icon={icon}
                                name={skill.name}
                                placeholder={<div className='no-image card-image'><h1>{name}</h1></div>}
                                dropdownOpen={this.state.dropdownOpen}
                                onDelete={this.deleteSkill}
                                onCopy={this.copySkill}
                                deleteLabel="Delete Skill"
                                copyLabel="Copy Skill"
                                onClick={this.openSkill}
                                extension={skill.diagram}
                                buttonLabel="Edit Skill"
                            />
                        )
                    })}
                    <EmptyCard
                        onClick={() => this.props.history.push(`/templates`)}
                    />
                </Masonry>
            </React.Fragment>
        }

        return (
            <div id="app">
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
                            <Link to="/templates" className="no-underline">
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
