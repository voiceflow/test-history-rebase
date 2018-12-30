import React, { Component } from 'react'
import Canvas from './views/pages/Canvas'
import Business from './views/pages/Business'
import Settings from './views/pages/Skill/Settings'
import Publish from './views/pages/Skill/Publish'
import axios from 'axios'
import SecondaryNavBar from './views/components/NavBar/SecondaryNavBar'
import ErrorModal from './views/components/Modals/ErrorModal'
import ConfirmModal from './views/components/Modals/ConfirmModal'

const generateID = () => {
    return "xxxxxxxxxxxxxxxxyxxxxxxxxxxxxxxx".replace(/[xy]/g, c => {
        const r = (Math.random() * 16) | 0
        const v = c === "x" ? r : (r & 0x3) | 0x8
        return v.toString(16)
    })
}

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
            mounted: true
        }

        this.renderPage = this.renderPage.bind(this)
        this.onError = this.onError.bind(this)
        this.onConfirm = this.onConfirm.bind(this)
        this.createSkill = this.createSkill.bind(this)
        this.componentGracefulUnmount = this.componentGracefulUnmount.bind(this)
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
        this.setState({mounted: true})
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
        this.componentGracefulUnmount()
    }

    onError(message) {
        this.setState({error: message})
    }

    onConfirm(confirm){
        this.setState({confirm: confirm})
    }

    createSkill(name, locales){
        // CREATE NEW PROJECT
        if(!name){
            name = 'New Skill'
        }

        let diagram_id = generateID()

        axios.post('/skill', {
          name: name,
          diagram: diagram_id,
          locales: locales
        })
        .then(res => {
            if(res.data && res.data.id){
                this.onLoadSkill(res.data.id)
            }
        })
        .catch(err => {
            console.error(err)
            this.onError('Could Not Create Project - Error')
        })
    }

    onLoadSkill(skill_id){
        axios.get(`/skill/${skill_id}?${this.props.preview ? 'preview=1' : 'simple=1'}`)
        .then(res => {
            // prevent redundant saving of global variables in the skill object
            let skill = res.data

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
                error: 'Unable to Load Project'
            })
        })
    }

    renderPage(){
        switch(this.props.page){
            case 'canvas':
                return <Canvas {...this.props} skill={this.state.skill} diagram_id={this.state.diagram_id} onError={this.onError} onConfirm={this.onConfirm} createSkill={this.createSkill}/>
            case 'business':
                return <Business {...this.props} skill_id={this.state.skill.skill_id} page={this.props.secondaryPage} onError={this.onError} onConfirm={this.onConfirm}/>
            case 'settings':
                return <Settings {...this.props} skill={this.state.skill} onError={this.onError} onConfirm={this.onConfirm} updateSkill={(skill) => {this.setState({skill: skill})}}/>
            case 'publish':
                return <Publish {...this.props} skill={this.state.skill} page={this.props.secondaryPage} onError={this.onError} onConfirm={this.onConfirm}/>
            default:
                return null
        }
    }

    render(){

        if(!this.state.mounted) return null

        if(this.state.load_skill || (!(this.state.skill && this.state.skill.skill_id) && !this.props.new)){
            return <div id="loading-diagram">
                <div className="text-center">
                    <h5 className="text-muted mb-2">Loading Skill</h5>
                    <span className="loader"/>
                </div>
            </div>
        }

        return <React.Fragment>
            {this.state.secondary && <SecondaryNavBar skill={this.state.skill} page={this.props.page}/>}
            
            <ErrorModal error={this.state.error} dismiss={()=>this.setState({error: null})}/>
            <ConfirmModal confirm={this.state.confirm} toggle={()=>this.setState({confirm: null})}/>

            <div id="app" className={this.state.secondary ? "secondary-padding" : ""}>
                {this.renderPage()}
            </div>
        </React.Fragment>
    }
}

export default Skill