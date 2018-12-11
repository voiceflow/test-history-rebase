import React, { Component } from 'react';
// import moment from 'moment'
// import 'react-table/react-table.css'
import { Link } from 'react-router-dom';
import Masonry from 'react-masonry-component';
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
                            <h5 className="pb-3">Loading Skills</h5>
                            <h1><span className="loader"/></h1>
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
                    <div className="">
                      <div className="card-body p-4">
                        <img src="/images/entertainment-icon.svg" alt="skill-icon" width="400" className="mb-5"/><br/>
                        <Link to="/canvas/new" className="no-underline super-center">
                            <button varient="contained" className="purple-btn w-75">Create Skill</button>
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
                <ConfirmModal confirm={this.state.confirm} toggle={this.toggleConfirm}/>
                <div className="my-5 pt-5 container">
                    {skills}
                </div>
            </div>
        );
    }
}

export default DashBoard;
