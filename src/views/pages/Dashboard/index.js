import React, { Component } from 'react';
// import moment from 'moment'
// import 'react-table/react-table.css'
import { Link } from 'react-router-dom';
import Masonry from 'react-masonry-component';
import MUIButton from '@material-ui/core/Button';

import CircularProgress from '@material-ui/core/CircularProgress';
// import { InputGroup, Input, Button } from 'reactstrap';
// import CardMedia from '@material-ui/core/CardMedia';

// import EnvironmentModal from './EnvironmentModal'

import './DashBoard.css';

import axios from 'axios';

import ConfirmModal from './../../components/Modals/ConfirmModal';
import SkillCard from './Skill/SkillCard';

class DashBoard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            confirm: false,
            loading: false,
            skills: null,
            modal: false
        }

        this.onLoadSkills = this.onLoadSkills.bind(this);
        this.openSkill = this.openSkill.bind(this);
    }

    openSkill(skill, diagram){
        setTimeout(() => { 
            this.props.history.push(`/canvas/${skill}/${diagram}`);
        }, 100);
    }

    componentDidMount() {
        this.onLoadSkills();
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
            });
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

    onDeleteDiagram(id) {
        this.setState({
            confirm: {
                text: "Are you sure you want to delete this diagram? Diagrams can not be recovered",
                confirm: () => {
                    this.setState({
                        loading: true,
                        error: false,
                        success: false,
                        confirm: false
                    });
                    axios.delete('/diagram/'+id)
                    .then(res => {
                        this.onLoad();
                    })
                    .catch(error => {
                        this.setState({ error: "Unable to Delete" });
                    });
                }
            }
        });
    }

    toggleConfirm() {
        this.setState({
            confirm: null
        });
    }

                            //     <InputGroup className="mr-2">
                            //     <Input placeholder="Search for Skills"/>
                            // </InputGroup>

                    //     <div className="banner mb-3">
                    //     <h1 className="display-4">Welcome {this.props.user.name}</h1>
                    // </div>

    render() {
        let skills;

        if(this.state.skills === null){
            skills = <div className="super-center w-100 text-muted mt-5">
                        <div className="text-center">
                            <CircularProgress color="secondary" size={50} />
                            <br/><br/>
                            Loading Skills
                        </div>
                     </div>
        }else if(this.state.skills.length === 0){
            // skills = <div className="text-center mt-5">
            //             <h1 className="display-5 text-mute">
            //                 <i className="far fa-frown"/> No Skills Found
            //             </h1>
            //             <Link to="/canvas/new">Create New Skill</Link>
            //         </div>
            skills = <div className="super-center w-100 text-muted mt-5">
                <div className="horizontal-center mt-5">
                    <div className="card">
                      <div className="card-body p-4">
                        <img src="/images/entertainment-icon.svg" alt="skill-icon" width="200"/><br/>
                        <Link to="/canvas/new" className="no-underline">
                            <MUIButton varient="contained" className="purple-btn w-100">Create Skill</MUIButton>
                        </Link>
                      </div>
                    </div>
                    <span className="mx-5">OR</span>
                    <div className="d-flex">
                        <img src="/images/clipboard-icon.svg" alt="list" height="90"/><br/>
                        <div className="ml-3">
                            <h5 className="text-dark">Getting Started</h5>
                            <p className="mb-1">
                                Learn about the tool<br/>
                                and how blocks work
                            </p>
                            <small>
                                <a href="https://getvoiceflow.com/storyschool" className="text-muted" target="_blank" rel="noopener noreferrer">
                                    <b>STORY SCHOOL</b>
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
                                <MUIButton varient="contained" className="purple-btn"><i className="far fa-plus mr-2"/> New Project</MUIButton>
                            </Link>
                        </div>
                    </div>
                </div>
                <ConfirmModal confirm={this.state.confirm} toggle={this.toggleConfirm}/>
                <div className="my-5 pt-5 container">
                    {skills}
                </div>
            </div>
        );
    }
}

export default DashBoard;
