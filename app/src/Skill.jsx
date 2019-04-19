import React, { Component } from 'react'
import cn from 'classnames'
import { connect } from 'react-redux';
import { compose } from 'recompose'

import { loadSession, errorScreen, socketCheck } from './views/HOC/socketCheck'

import { fetchVersion, setLiveModeModal, updateVersion, resetVersion } from './actions/versionActions'
import { fetchDiagrams } from './actions/diagramActions'
import { fetchProducts } from "./actions/productActions";
import { fetchDisplays } from "./actions/displayActions";
import { fetchEmails } from "./actions/emailActions";

import Canvas from './views/pages/Canvas'
import Visuals from './views/pages/Visuals'
import Business from './views/pages/Business'
import Settings from './views/pages/Skill/Settings'
import Publish from './views/pages/Skill/Publish'
import Logs from './views/pages/Logs'
import axios from 'axios'
import SecondaryNavBar from './views/components/NavBar/SecondaryNavBar'
import DefaultModal from './views/components/Modals/DefaultModal'
import { Spinner } from './views/components/Spinner'
import { Link } from 'react-router-dom';
import Marketplace from './views/pages/Marketplace';

const live_modal_content = <div className="text-center">
    <img className="modal-img-small mb-4 mt-3" src="/warning.svg" alt="Upload"/>
    <div className="modal-bg-txt mt-2">Entering Live Editing</div>
    <div className="modal-txt mt-2 mb-3"> Updating your skill in live mode will not effect the live version of the skill until you hit the upload button.</div>
</div>


/* Code for detecting whether a user visits a different tab */
let hidden = null;
let visibilityChange = null;
if (typeof document.hidden !== 'undefined') { // Opera 12.10 and Firefox 18 and later support 
    hidden = 'hidden';
    visibilityChange = 'visibilitychange';
} else if (typeof document.msHidden !== 'undefined') {
    hidden = 'msHidden';
    visibilityChange = 'msvisibilitychange';
} else if (typeof document.webkitHidden !== 'undefined') {
    hidden = 'webkitHidden';
    visibilityChange = 'webkitvisibilitychange';
}

class Skill extends Component {
    constructor(props){
        super(props)
        this.state = {
            mounted: true,
            linter: [],
            upgrade_modal: false,
            selected_plan: 1,
            load_skill: true,
            editName: false
        }

        this.time_mounted = null

        this.renderPage = this.renderPage.bind(this)
        this.componentGracefulUnmount = this.componentGracefulUnmount.bind(this)

        this.child_canvas = React.createRef()
        this.trackCanvasTime = this.trackCanvasTime.bind(this)

        /* Logic for detecting when page refreshed */
        if (window.performance) {
            if (performance.navigation.type === 1) {
              this.trackCanvasTime()
            }
        }
    }

    trackCanvasTime(){
        let time_unmounted = new Date()
        if(!!this.props.skill){
            axios.post('/analytics/track_session_time', {
                duration: time_unmounted - this.time_mounted,
                skill_id: this.props.skill.skill_id
            })
        }
        this.time_mounted = null
    }

    componentGracefulUnmount(){
        this.setState({mounted: false})
        window.removeEventListener('beforeunload', this.componentGracefulUnmount);
    }

    componentDidMount(){
        this.setState({
            mounted: true,
        })
        window.addEventListener(
          "beforeunload",
          this.componentGracefulUnmount
        )
        if(this.props.computedMatch && this.props.computedMatch.params && this.props.computedMatch.params.skill_id){
          this.props.getVersion(this.props.computedMatch.params.skill_id, this.props.preview, this.props.computedMatch.params.diagram_id).then(() => {
            document.title=(this.props.skill.name !== undefined ? this.props.skill.name : 'Voiceflow Creator')
            this.setState({load_skill: false})
            if (!this.props.preview){
              if (this.props.user && (this.props.user.admin > 0) && this.props.skill) {
                // LOAD EMAIL TEMPLATES IF ON PLAN > 1
                try {
                    this.props.getEmails(this.props.skill.skill_id)
                } catch (err) {
                    console.error(err)
                }
              }

              // LOAD MULTIMODAL/VISUAL TEMPLATES
              try {
                this.props.getDisplays(this.props.skill.skill_id)
              } catch (err) {
                console.error(err)
              }

              // LOAD PRODUCTS
              if (this.props.skill.locales && this.props.skill.locales.includes('en-US')) {
                try {
                  this.props.getProducts(this.props.skill.skill_id)
                } catch (err) {
                  console.error(err)
                }
              }
            }
          })
          this.props.getDiagrams(this.props.computedMatch.params.skill_id)
        }else{
            this.setState({
                load_skill: false,
            })
        }
        document.addEventListener(visibilityChange, this.handleVisibilityChange, false)
        this.time_mounted = new Date()
    }
    componentWillUnmount(){
        if(this.props.skill){
            this.trackCanvasTime()
        }
        this.props.resetSkill()

        document.removeEventListener(visibilityChange, this.handleVisibilityChange)
        this.componentGracefulUnmount()

        document.title='Voiceflow Creator'
    }

    handleVisibilityChange = () => {
        if (document[hidden]) {
            this.trackCanvasTime()
        } else {
            this.time_mounted = new Date()
        }
    }

    renderPage(){
        switch(this.props.page){
            case 'canvas':
                return <Canvas 
                    {...this.props} 
                    live_mode={this.props.live_mode}
                    ref={this.child_canvas}
                    linter={this.state.linter}
                    toggleUpgrade={this.toggleUpgrade}
                />
            case 'business':
                return <Business
                  {...this.props}
                  page={this.props.secondaryPage}
                  toggleUpgrade={this.toggleUpgrade}
                />
            case 'settings':
                return <Settings 
                    {...this.props} 
                    page={this.props.secondaryPage}
                    live_mode={this.props.live_mode}
                    toggleUpgrade={this.toggleUpgrade}/>
            case 'publish':
                return <Publish 
                    {...this.props} 
                    page={this.props.secondaryPage}
                />
            case 'logs':
                return <Logs
                  {...this.props}
                />
            case 'visuals':
                return <Visuals
                  {...this.props}
                  page={this.props.secondaryPage}
                />
            case 'market':
                return <Marketplace
                  {...this.props}
                  page={this.props.secondaryPage}
                />
            default:
                return null
        }
    }

    render(){
        if(!this.state.mounted) return null

        if(this.props.errorScreen){
            return <div className="super-center w-100 h-100">
                {this.props.errorScreen}
            </div>
        }

        return <React.Fragment>
          {!this.props.preview && <SecondaryNavBar page={this.props.page} history={this.props.history}/>}
          <DefaultModal open={this.props.show_live_mode_modal} toggle={()=>{this.props.setLiveModal(false)}} content={live_modal_content} header="Live Mode Disclaimer" close_button_text="Confirm"></DefaultModal>
            <div className="skill-name-top-left fixed-top" onDoubleClick={() => this.setState({ editName: true })}>
            <Link to="/" className="mx-3">
                <img src={"/back.svg"} alt="back" className="mr-3" />
            </Link>
                {this.state.editName ? <input autoFocus className="edit-input" value={this.props.skill.name} onChange={e => { this.props.updateSkill('name', e.target.value); this.props.updateSkill('inv_name', e.target.value) }} onBlur={() => this.setState({ editName: false })} /> :
            this.props.skill && this.props.skill.name ? this.props.skill.name : "Loading Skill"
            }
          </div>
          {((this.state.load_skill || this.props.load_diagram || this.props.loadSession) || ((!this.props.skill || !this.props.skill.skill_id) && !this.props.new)) ? 
            React.createElement(Spinner,  {name: 'Skill'}) :
            <>
              <div id="app" className={cn(this.props.page, { 'secondary-padding': !this.props.preview })}>
                {this.renderPage()}
              </div>
            </>
          }
        </React.Fragment>
    }
}

const mapStateToProps = state => ({
    skill: state.skills.skill,
    load_diagram: state.diagrams.loading,
    error: state.skills.error,
    show_live_mode_modal: state.skills.show_live_mode_modal,
    live_mode: state.skills.live_mode,
    dev_skill: state.skills.dev_skill ? state.skills.dev_skill : state.skills.skill,
    user: state.account
})

const mapDispatchToProps = dispatch => {
  return {
    getDiagrams: (skill_id) => dispatch(fetchDiagrams(skill_id)),
    getVersion: (version_id, preview, diagram_id) => dispatch(fetchVersion(version_id, preview, diagram_id)),
    setLiveModal: isLive => dispatch(setLiveModeModal(isLive)),
    getProducts: (skill_id) => dispatch(fetchProducts(skill_id)),
    getDisplays: (skill_id) => dispatch(fetchDisplays(skill_id)),
    getEmails: (skill_id) => dispatch(fetchEmails(skill_id)),
    updateSkill: (type, val) => dispatch(updateVersion(type, val)),
    resetSkill: () => dispatch(resetVersion())
  }
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  errorScreen,
  loadSession,
  socketCheck,
)(Skill)
