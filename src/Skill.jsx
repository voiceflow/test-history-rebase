import React, { Component } from 'react'
import Canvas from './views/pages/Canvas'
import Business from './views/pages/Business'
import Settings from './views/pages/Skill/Settings'
import axios from 'axios'
import SecondaryNavBar from './views/components/NavBar/SecondaryNavBar'

class Skill extends Component {
    constructor(props){
        super(props)

        this.state = {
            load_skill: true,
            diagram_id: null,
            secondary: true
        }

        this.renderPage = this.renderPage.bind(this)     
    }

    static getDerivedStateFromProps(props, state){
        if(props.computedMatch && props.computedMatch.params && props.computedMatch.params.diagram_id && props.computedMatch.params.diagram_id !== state.diagram_id){
            return {
                diagram_id: props.computedMatch.params.diagram_id
            }
        }else{
            return null
        }
    }

    componentDidMount(){
        if(this.props.computedMatch && this.props.computedMatch.params && this.props.computedMatch.params.skill_id){
            this.onLoadSkill(this.props.computedMatch.params.skill_id)
        }else{
            // TODO
            this.setState({
                load_skill: false
            })
            // alert("rip")
        }
    }

    onLoadSkill(skill_id){
        axios.get(`/skill/${skill_id}?${this.props.preview ? 'preview=1' : 'simple=1'}`)
        .then(res => {
            // prevent redundant saving of global variables in the skill object
            let skill = res.data

            // TODO SKILL PREVIEW NOT ENABLED
            this.setState({
                skill: skill,
                load_skill: false,
                diagram_id: this.state.diagram_id ? this.state.diagram_id : skill.diagram
            })
        })
        .catch(err => {
            // TODO ERROR MESSAGE
            console.error(err.response)
        })
    }

    renderPage(){
        switch(this.props.page){
            case 'canvas':
                return <Canvas {...this.props} skill={this.state.skill} diagram_id={this.state.diagram_id}/>
            case 'business':
                return <Business {...this.props} skill_id={this.state.skill.skill_id} page={this.props.secondaryPage}/>
            case 'settings':
                return <Settings {...this.props} skill={this.state.skill}/>
            default:
                return null
        }
    }

    render(){
        if(this.state.load_skill || !(this.state.skill && this.state.skill.skill_id)){
            return <div id="loading-diagram">
                <div className="text-center">
                    <h5 className="text-muted mb-2">Loading Skill</h5>
                    <span className="loader"/>
                </div>
            </div>
        }

        return <React.Fragment>
            {this.state.secondary && <SecondaryNavBar skill={this.state.skill} page={this.props.page}/>}
            
            <div id="app" className={this.state.secondary ? "secondary-padding" : ""}>
                {this.renderPage()}
            </div>
        </React.Fragment>
    }
}

export default Skill