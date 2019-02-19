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
import DefaultModal from './views/components/Modals/DefaultModal'
import { Link } from 'react-router-dom';
import {Alert} from 'reactstrap'
import AuthenticationService from './services/Authentication'
import {getDevice} from 'Helper'

const live_modal_content = <div className="text-center">
    <img className="modal-img-small mb-4 mt-3" src="/warning.svg" alt="Upload"/>
    <div className="modal-bg-txt mt-2">Entering Live Editing</div>
    <div className="modal-txt mt-2 mb-3"> Updating your skill in live mode will not effect the live version of the skill until you hit the upload button.</div>
</div>

const session_warning_content = <div style={{maxWidth: 600}} className="text-center">
    <img className="modal-img-small mb-4 mt-3" src="/warning.svg" alt="Upload"/>
    <div className="modal-bg-txt mt-2">You have another session in progress</div>
    <div className="modal-txt mt-2 mb-3">For project safety, we only allow one editable version of your project to be open at a time - otherwise they may overwrite each other</div>
</div>

const connection_error = <Alert color="danger" className="text-center p-4">
    <i class="fas fa-wifi-slash text-lg"/><br/><br/>
    <b>Unable to Connect to Voiceflow</b><br/>
    Refresh your page or try again later
</Alert>

class Skill extends Component {
    constructor(props){
        super(props)
        this.state = {
            skill: null,
            load_skill: true,
            load_session: true,
            diagram_id: null,
            secondary: !props.preview,
            error: null,
            confirm: null,
            mounted: true,
            error_screen: null,
            time_mounted: null,
            linter: [],
            upgrade_modal: false,
            selected_plan: 1,
            live_mode: false,
            live_version: null,
            show_live_mode_modal: false
        }

        this.renderPage = this.renderPage.bind(this)
        this.onError = this.onError.bind(this)
        this.onConfirm = this.onConfirm.bind(this)
        this.componentGracefulUnmount = this.componentGracefulUnmount.bind(this)
        this.onSwapVersions = this.onSwapVersions.bind(this)
        this.toggleLiveMode = this.toggleLiveMode.bind(this)
        this.logout = this.logout.bind(this)

        this.child_canvas = React.createRef()
        this.updateSkill = this.updateSkill.bind(this)
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
        })

        // UNMOUNT SOCKET SESSION
        delete window.CreatorSocket.connectedCB[`SKILL_${this.skill_id}`]
        window.CreatorSocket.emit('leave')

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
        this.skill_id = skill_id

        // SKILL SOCKET STATUS
        if(window.CreatorSocket.status === 'CONNECTED'){
            window.CreatorSocket.emit('project', {
                skill_id: skill_id,
                auth: AuthenticationService.getAuth(),
                device: getDevice()
            })
            window.CreatorSocket.on('occupied', data => {
                this.setState({error_screen: session_warning_content})
            })
            window.CreatorSocket.on('joined', data => {
                if(data === skill_id){
                    this.setState({load_session: false})
                }
            })
            // IF RECONNECTED RE-EMIT PROPERTY
            window.CreatorSocket.connectedCB[`SKILL_${skill_id}`] = () => {
                window.CreatorSocket.emit('project', {
                    skill_id: skill_id,
                    auth: AuthenticationService.getAuth(),
                    device: getDevice(),
                    reconnect: true
                })
            }
            // IF REJOINED AND THERE IS CONFLICT - THROW WARNING
            window.CreatorSocket.on('conflict', () => {
                this.onError(<React.Fragment>
                    <b>Conflict:</b><br/>
                    There is another existing session on this project, please close the older version before making changes
                </React.Fragment>)
            })
        }else{
            this.setState({error_screen: connection_error})
        }

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

            skill.platform = skill.platform === 'google' ? 'google' : 'alexa'

            // TODO SKILL PREVIEW NOT ENABLED
            this.setState({
                load_skill: false,
                diagram_id: this.state.diagram_id ? this.state.diagram_id : skill.diagram,
                skill: skill
            })

            axios.get(`/skill/${skill_id}/live_version`)
            .then(res => {
                this.setState({
                    live_version: res.data.live_version,
                    live_mode: skill_id === res.data.live_version,
                    show_live_mode_modal: skill_id === res.data.live_version
                })

                // Retrieve the dev skill, triggered if user refreshes page when live
                if(!this.state.dev_skill && skill_id === res.data.live_version){
                    axios.get(`/skill/${skill_id}/dev_version`)
                    .then(res => {
                        this.setState({
                            dev_skill: res.data
                        })
                    })
                    .catch(err => {
                        console.error(err)
                    })
                } else if(skill_id !== res.data.live_version) {
                    this.setState({
                        dev_skill: skill
                    })
                }
            })
            .catch(err => {
                console.error(err)
            })
        })
        .catch(err => {
            this.setState({
                error: 'Unable to load project'
            })
        })
    }

    onSwapVersions(skill_id, skill, is_overwrite, cb){
        axios.post(`/skill/${skill_id}/restore`)
        .then(res => {
            if(!is_overwrite){
                skill.skill_id = res.data.skill_id
                skill.diagram = res.data.diagram
                this.setState({
                    skill: skill,
                    diagram_id: skill.diagram,
                    dev_skill: res.data
                })
            } else {
                this.setState({
                    dev_skill: res.data
                })
            }

            if(!cb){
                this.props.history.push(`/canvas/${res.data.skill_id}/${res.data.diagram}`)
            } else {
                cb(true)
            }
        })
        .catch(err => {
            console.error(err.response)
            this.setState({
                error: 'Unable to restore version'
            })

            if(cb){
                cb(false)
            }
        })
    }

    toggleLiveMode(disableCb){
        if(this.state.live_mode){
            this.child_canvas.current.saveCB = () => {
                let s = this.state
                this.setState({
                    skill: s.dev_skill,
                    diagram_id: s.dev_skill.diagram,
                    live_version: s.skill.skill_id,
                    live_mode: false
                })
                this.props.history.push(`/canvas/${s.dev_skill.skill_id}/${s.dev_skill.diagram}`)
                setTimeout(
                    () => {disableCb()},
                    1000
                )
            }
            this.child_canvas.current.onSave()
        } else {
            axios.get(`/skill/${this.state.live_version}`)
            .then((res) => {
                this.child_canvas.current.saveCB = () => {
                    this.setState({
                        skill: res.data,
                        diagram_id: res.data.diagram,
                        live_mode: true
                    })
                    this.props.history.push(`/canvas/${res.data.skill_id}/${res.data.diagram}`)
                    setTimeout(
                        () => {
                            this.setState({show_live_mode_modal: true})
                            disableCb()
                        },
                        1000
                    )
                }
                this.child_canvas.current.onSave()
            })
            .catch((err) => {
                console.log(err)
                this.setState({
                    error: 'Unable to load live version',
                    live_mode: false,
                    skill: this.state.dev_skill,
                    diagram_id: this.state.dev_skill.diagram
                })
                console.log(this.state)
                setTimeout(
                    () => {disableCb()},
                    1000
                )
            })
        }
        
    }

    logout(e) {
        e.preventDefault();
        AuthenticationService.logout(() => {
          console.log("logout");
          this.props.history.push('/login');
        });
        return false;
    }

    updateSkill(skill){
        this.setState({
            skill: {
                ...this.state.skill,
                ...skill
            }
        })
    }

    renderPage(){
        switch(this.props.page){
            case 'canvas':
                return <Canvas 
                    {...this.props} 
                    skill={this.state.skill} 
                    diagram_id={this.state.diagram_id} 
                    live_mode={this.state.live_mode}
                    onError={this.onError} 
                    onConfirm={this.onConfirm} 
                    ref={this.child_canvas}
                    onSwapVersions={this.onSwapVersions}
                    updateSkill={this.updateSkill}
                    linter={this.state.linter}
                    toggleUpgrade={this.toggleUpgrade}/>
            case 'business':
                return <Business
                  {...this.props}
                  skill_id={this.state.skill.skill_id}
                  page={this.props.secondaryPage}
                  onError={this.onError}
                  onConfirm={this.onConfirm}
                  updateSkill={this.updateSkill}
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
                    live_mode={this.state.live_mode}
                    updateSkill={this.updateSkill}
                    toggleUpgrade={this.toggleUpgrade}/>
            case 'publish':
                return <Publish 
                    {...this.props} 
                    skill={this.state.skill} 
                    page={this.props.secondaryPage}
                    onError={this.onError} 
                    onConfirm={this.onConfirm}
                    updateSkill={this.updateSkill}
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

        if((this.state.load_skill || this.state.load_session) || ((!this.state.skill || !this.state.skill.skill_id) && !this.props.new)){
            return <div id="loading-diagram">
                <div className="text-center">
                    <h5 className="text-muted mb-2">Loading Skill</h5>
                    <span className="loader"/>
                </div>
            </div>
        }

        return <React.Fragment>
            {this.state.secondary && <SecondaryNavBar skill={this.state.skill} page={this.props.page} live_mode={this.state.live_mode} has_live={this.state.live_version} toggleLiveMode={this.toggleLiveMode}/>}

            <div className="skill-name-top-left fixed-top">
            <Link to="/" className="mx-2">
                <img src={"/back.svg"} alt="back" className="mr-3" />
            </Link>
            {this.state.skill ? this.state.skill.name : "New Skill"}
            </div>
            <ErrorModal error={this.state.error} dismiss={()=>this.setState({error: null})}/>
            <ConfirmModal confirm={this.state.confirm} toggle={()=>this.setState({confirm: null})}/>
            <DefaultModal open={this.state.show_live_mode_modal} toggle={()=>{this.setState({show_live_mode_modal: false})}} content={live_modal_content} header="Live Mode Disclaimer" close_button_text="Confirm"></DefaultModal>

            <div id="app" className={(this.state.secondary ? "secondary-padding " : "") + this.props.page}>
            {this.renderPage()}
            </div>
          </React.Fragment>;
    }
}

export default Skill
