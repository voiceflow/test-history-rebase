/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import ModuleIcon from '../../pages/Marketplace/ModuleIcon'
import cn from 'classnames'
import React from 'react'
import { connect } from 'react-redux'
import { Modal, ModalBody } from 'reactstrap'
import axios from 'axios'

import Button from 'components/Button'
import { updateVersion, updateUserModules } from './../../../ducks/version'
import { appendDiagrams } from './../../../ducks/diagram'
import LightCanvas from './../../pages/Canvas/LightCanvas'

class ModuleModal extends React.Component {
  constructor(props){
    super(props)

    this.state = {
      conflicts: [],
      loading: false,
      preview: false,
      module_diagram: null
    }

    this.addFlow = this.addFlow.bind(this)
    this.checkFlowConflicts = this.checkFlowConflicts.bind(this)
    this.renderModalBody = this.renderModalBody.bind(this)
    this.renderConflictBody = this.renderConflictBody.bind(this)
    this.cancelAddFlow = this.cancelAddFlow.bind(this)
  }

  addFlow(){
    let module_id = this.props.module.module_id
    
    this.setState({
      loading: true
    })
    
    axios.post(`/marketplace/user_module/${this.props.project_id}/${module_id}`)
			.then(res => {
        for(let diagram of res.data.new_diagrams){
          if(typeof diagram.sub_diagrams === 'string'){
            diagram.sub_diagrams = JSON.parse(diagram.sub_diagrams)
          }
        }
        this.props.appendDiagrams(res.data.new_diagrams)
        this.props.updateUserModules(res.data.new_module)
        this.props.updateVersion('global', JSON.parse(res.data.globals))
        this.props.updateVersion('intents', res.data.new_intents)
        this.props.updateVersion('slots', res.data.new_slots)
        this.setState({
          loading: false
        })
        this.props.toggle()
        this.props.hideModule(module_id)
			})
			.catch(error => {
        console.log(error)
        this.setState({
          loading: false
        })
      })
  }

  componentWillReceiveProps(props){
    if(props.isOpen === true && this.props.isOpen === false){
      let module_id = props.module.module_id
      axios.get(`/marketplace/diagram/${module_id}`)
      .then(res => {
        if(res.data.diagram_id){
          this.setState({
            module_diagram: res.data.diagram_id
          })
        }
      })
      .catch(err => {
        console.log(err)
      })
    }
  }

  checkFlowConflicts(){
    this.setState({
      loading: true
    })

    axios.get(`/marketplace/user_module/${this.props.project_id}/${this.props.module.module_id}`)
      .then(res => {
        if(Object.keys(res.data.globals_intersect).length > 0){
          this.setState({
            conflicts: res.data.globals_intersect,
            loading: false
          })
        } else {
          this.addFlow()
        }
      })
      .catch(error => {
        console.log(error)
        this.setState({
          loading: false
        })
      })
  }

  cancelAddFlow(){
    this.setState({
      conflicts: []
    })
    this.props.toggle()
  }

  renderConflictBody(){
    let conflict_string = this.state.conflicts.reduce((accumulator, curr_string) => {
      return accumulator + `${curr_string}, `
    }, '')
    conflict_string = conflict_string.substring(0, conflict_string.length - 2)

    return (
      <div className="pt-3 pl-3 flow-conflict-text">
        <h5 className="modal-title mb-4">Flow Conflicts</h5>
        <p>The following global variables exist in both your project and the flow you are importing:</p>
        <p className="font-weight-bold">{conflict_string}</p>
        <p>If these are fine, hit confirm to add the flow to your project or cancel to not.</p>
        <div className="row justify-content-center mt-4">
          <Button isWhite className="mr-2" onClick={this.cancelAddFlow} disabled={this.state.loading}>Cancel</Button>
          <Button isPurple className="ml-2" onClick={this.addFlow} disabled={this.state.loading}>
              {this.state.loading?
              <span className="loader"/>
              :
              "Confirm"}
          </Button>
        </div>
      </div>
    )
  }

  renderModalBody(){
    return (
      this.props.module && 
      <React.Fragment>
        <Modal isOpen={this.state.preview} size="xl" toggle={()=>this.setState({preview: false})} className="light-canvas-modal">
          <div id="light-canvas-wrap">
            <div className="no-select" id="PreviewBar">
              {this.props.module.title}
            </div>
            {!!this.state.module_diagram && <LightCanvas diagram_id={this.state.module_diagram}/>}
          </div>
          <Button className="goback-btn position-absolute" onClick={()=>this.setState({preview: false})} style={{top: 320, left: -90}}/>
        </Modal>

        <div className="close" onClick={this.props.toggle}/>
        <div className="text-center pt-5">
          <div className="module-modal-icon">{this.props.module && <div className="module-card-icon"><ModuleIcon module={this.props.module}/></div>}</div>
          <div className="module-modal-author text-secondary">
            {this.props.module.name}
          </div>

          <div className="lg-header">{this.props.module.title}</div>
          <p className="text-secondary">{this.props.module.descr}</p>
          <div className="row justify-content-center mb-3">
            <Button isWhite className={cn("mr-2", {disabled: this.state.loading})} onClick={()=>{this.setState({preview: true})}} disabled={this.state.loading}>Preview</Button>
            <Button isPrimary className={cn("ml-2", { disabled: this.state.loading })} onClick={this.checkFlowConflicts} disabled={this.state.loading}>{
              this.state.loading?
              <span className="loader"/>
              :
              "Add Flow"
            }</Button>
          </div>
          <p>{this.props.module.overview}</p>
        </div>
      </React.Fragment>
    )
  }

  render() {
    return (
      <Modal isOpen={this.props.isOpen} toggle={this.props.toggle} centered size="lg">
        <ModalBody>
          {this.state.conflicts.length > 0 ?
            this.renderConflictBody()
            :
            this.renderModalBody()
          }
        </ModalBody>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  project_id: state.skills.skill.project_id,
  user_modules: state.skills.user_modules
})

const mapDispatchToProps = dispatch => {
  return {
    updateVersion: (key, val) => dispatch(updateVersion(key, val)),
    updateUserModules: (module) => dispatch(updateUserModules(module)),
    appendDiagrams: (diagrams) => dispatch(appendDiagrams(diagrams))
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(ModuleModal);