import React, { Component } from 'react'
import Canvas from './views/pages/Canvas'
import Visuals from './views/pages/Visuals'
import Business from './views/pages/Business'
import Settings from './views/pages/Skill/Settings'
import Publish from './views/pages/Skill/Publish'
import Logs from './views/pages/Logs'
import axios from 'axios'
import SecondaryNavBar from './views/components/NavBar/SecondaryNavBar'
import ErrorModal from './views/components/Modals/ErrorModal'
import ConfirmModal from './views/components/Modals/ConfirmModal'
import { Link } from 'react-router-dom';
import {Alert} from 'reactstrap'
import AuthenticationService from './services/Authentication'

class Skill extends Component {
    constructor(props){
        super(props)
        this.state = {
            skill: null,
            load_skill: true,
            diagram_id: null,
            secondary: !props.preview,
            error: null,
            confirm: null,
            mounted: true,
            error_screen: null,
            time_mounted: null,
            linter: [],
            upgrade_modal: false,
            selected_plan: 1
        }

        this.renderPage = this.renderPage.bind(this)
        this.onError = this.onError.bind(this)
        this.onConfirm = this.onConfirm.bind(this)
        this.componentGracefulUnmount = this.componentGracefulUnmount.bind(this)
        this.onSwapVersions = this.onSwapVersions.bind(this)
        this.logout = this.logout.bind(this)
    }

    static getDerivedStateFromProps(props, state){
        if(props.page === 'canvas'){
            let match = props.computedMatch && props.computedMatch.params && props.computedMatch.params.diagram_id
            if(match && match !== state.diagram_id){
                return {
                    diagram_id: props.computedMatch.params.diagram_id
                }
            }else if(!match && state.skill){
                if(!state.diagram_id){
                    let diagram_id = state.skill.diagram
                    let last_session = localStorage.getItem('flow')
                    if(last_session){
                        let parts = last_session.split('/')
                        if(parts.length === 2 && parts[0] === state.skill.skill_id){
                            diagram_id = last_session.split('/')[1]
                        }
                    }
                    props.history.push(`/canvas/${state.skill.skill_id}/${diagram_id}`)
                    return {
                        diagram_id: diagram_id
                    }
                }else{
                    props.history.push(`/canvas/${state.skill.skill_id}/${state.diagram_id}`)
                }
            }
        }
        return null
    }

    componentGracefulUnmount(){
        this.setState({mounted: false})
        window.removeEventListener('beforeunload', this.componentGracefulUnmount);
    }

    componentDidMount(){
        this.setState({
            mounted: true,
            time_mounted: new Date()
        })
        window.addEventListener('beforeunload', this.componentGracefulUnmount)
        if(this.props.computedMatch && this.props.computedMatch.params && this.props.computedMatch.params.skill_id){
            this.onLoadSkill(this.props.computedMatch.params.skill_id)
        }else{
            this.setState({
                load_skill: false,
            })
        }
    }

    componentWillUnmount(){
        let time_unmounted = new Date()
        axios.post('/analytics/track_canvas_time', {
            duration: time_unmounted - this.state.time_mounted,
            skill_id: this.state.skill.skill_id
        }).then(()=>{}).catch(()=>{})
        this.componentGracefulUnmount()
    }

    onError(message) {
        this.setState({error: message})
    }

    onConfirm(confirm){
        this.setState({confirm: {...confirm, confirm: () => {
            this.setState({confirm: null})
            if(confirm.params){
                confirm.confirm(...confirm.params)   
            } else {
                confirm.confirm()
            }
        }}})
    }

    onLoadSkill(skill_id){
        axios.get(`/skill/${skill_id}?${this.props.preview ? 'preview=1' : 'simple=1'}`, {
            headers: { Pragma: 'no-cache' }
        })
        .then(res => {
            let skill = res.data
            if(this.props.preview && !skill.preview){
                this.setState({
                    error_screen: <Alert color="danger">Preview not enabled for this skill</Alert>
                })
            }

            // TODO: this function is horrible and needs to die
            let globals = Array.isArray(skill.global) ? skill.global : []
            // make sure that there are no duplicate variables and that the defaults are included
            let global_variables = ['sessions', 'user_id', 'timestamp', 'platform', 'locale']
            if(window.user_detail.admin > 0){
                global_variables.push('access_token')
            }
            if (Array.isArray(globals)) {
                globals.forEach(v => {
                    if(!global_variables.includes(v)){
                        global_variables.push(v)
                    }
                })
            }
            skill.global = global_variables

            // NULL CHECK ON FULFILLMENT
            if(!skill.fulfillment){
                skill.fulfillment = {}
            }

            // TODO SKILL PREVIEW NOT ENABLED
            this.setState({
                load_skill: false,
                diagram_id: this.state.diagram_id ? this.state.diagram_id : skill.diagram,
                skill: skill,
            })
        })
        .catch(err => {
            // TODO ERROR MESSAGE
            console.error(err.response)
            this.setState({
                error: 'Unable to load project'
            })
        })
    }

    onSwapVersions(skill_id, skill){
        axios.post(`/skill/${skill_id}/restore`)
        .then(res => {
            skill.skill_id = res.data.skill_id
            skill.diagram = res.data.diagram
            this.setState({
                skill: skill,
                diagram_id: skill.diagram
            })
            this.props.history.push(`/canvas/${res.data.skill_id}/${res.data.diagram}`)
        })
        .catch(err => {
            console.error(err.response)
            this.setState({
                error: 'Unable to restore version'
            })
        })
    }

    logout(e) {
        e.preventDefault();
        AuthenticationService.logout(() => {
          console.log("logout");
          this.props.history.push('/login');
        });
        return false;
    }

    renderPage(){
        switch(this.props.page){
            case 'canvas':
                return <Canvas 
                    {...this.props} 
                    skill={this.state.skill} 
                    diagram_id={this.state.diagram_id} 
                    onError={this.onError} 
                    onConfirm={this.onConfirm} 
                    updateSkill={(skill) => {this.setState({skill: skill})}}
                    linter={this.state.linter}
                    toggleUpgrade={this.toggleUpgrade}/>
            case 'business':
                return <Business
                  {...this.props}
                  skill_id={this.state.skill.skill_id}
                  page={this.props.secondaryPage}
                  onError={this.onError}
                  onConfirm={this.onConfirm}
                  updateSkill={(skill) => {this.setState({skill: skill})}}
                  toggleUpgrade={this.toggleUpgrade}
                />
            case 'settings':
                return <Settings 
                    {...this.props} 
                    skill={this.state.skill} 
                    onError={this.onError} 
                    page={this.props.secondaryPage}
                    onSwapVersions={this.onSwapVersions} 
                    onConfirm={this.onConfirm} 
                    updateSkill={(skill) => {this.setState({skill: skill})}}
                    toggleUpgrade={this.toggleUpgrade}/>
            case 'publish':
                return <Publish 
                    {...this.props} 
                    skill={this.state.skill} 
                    page={this.props.secondaryPage}
                    onError={this.onError} 
                    onConfirm={this.onConfirm}
                    updateSkill={(skill) => {this.setState({skill: skill})}}
                    />
            case 'logs':
                return <Logs
                  {...this.props}
                  skill={this.state.skill}
                />
            case 'visuals':
                return <Visuals
                  {...this.props}
                  skill={this.state.skill}
                  page={this.props.secondaryPage}
                  onError={this.onError}
                  onConfirm={this.onConfirm}
                />
            default:
                return null
        }
    }

    render(){
        if(!this.state.mounted) return null

        if(this.state.error_screen){
            return <div className="super-center w-100 h-100">
                {this.state.error_screen}
            </div>
        }

        if(this.state.load_skill || ((!this.state.skill || !this.state.skill.skill_id) && !this.props.new)){
            return <div id="loading-diagram">
                <div className="text-center">
                    <h5 className="text-muted mb-2">Loading Skill</h5>
                    <span className="loader"/>
                </div>
            </div>
        }

        return <React.Fragment>
            {this.state.secondary && <SecondaryNavBar skill={this.state.skill} page={this.props.page} />}

            <div className="skill-name-top-left fixed-top">
            <Link to="/" className="mx-2">
                <img src={"/back.svg"} alt="back" className="mr-3" />
            </Link>
            {this.state.skill ? this.state.skill.name : "New Skill"}
            </div>
            <ErrorModal error={this.state.error} dismiss={()=>this.setState({error: null})}/>
            <ConfirmModal confirm={this.state.confirm} toggle={()=>this.setState({confirm: null})}/>
            <div id="app" className={(this.state.secondary ? "secondary-padding " : "") + this.props.page}>
            {this.renderPage()}
            </div>
          </React.Fragment>;
    }
}

export default Skill
