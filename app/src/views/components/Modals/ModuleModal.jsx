/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import withRenderModuleIcon from '../../HOC/ModuleIcon'
import React from 'react'
import { connect } from 'react-redux'
import { Modal, ModalBody } from 'reactstrap'
import axios from 'axios'
import { updateVersion } from './../../../actions/versionActions'

class ModuleModal extends React.Component {
  constructor(props){
    super(props)

    this.state = {
      conflicts: [],
      loading: false
    }

    this.previewFlow = this.previewFlow.bind(this)
    this.addFlow = this.addFlow.bind(this)
    this.checkFlowConflicts = this.checkFlowConflicts.bind(this)
    this.renderModalBody = this.renderModalBody.bind(this)
    this.renderConflictBody = this.renderConflictBody.bind(this)
    this.cancelAddFlow = this.cancelAddFlow.bind(this)
  }

  previewFlow(){
    alert('Preview')
  }

  addFlow(){
    let module_id = this.props.module.module_id
    
    this.setState({
      loading: true
    })

    axios.post(`/marketplace/user_module/${this.props.project_id}/${module_id}`)
			.then(res => {
        this.props.updateVersion('global', JSON.parse(res.data.globals))
        this.props.toggle()
        this.props.hideModule(module_id)
			})
			.catch(error => {
				console.log(error)
      })
      .finally(() => {
        this.setState({
          loading: false
        })
      })
  }

  checkFlowConflicts(){
    this.setState({
      loading: true
    })

    axios.get(`/marketplace/user_module/${this.props.project_id}/${this.props.module.module_id}`)
      .then(res => {
        if(Object.keys(res.data.globals_intersect).length > 0){
          this.setState({
            conflicts: res.data.globals_intersect
          })
        } else {
          this.addFlow()
        }
      })
      .catch(error => {
        console.log(error)
      })
      .finally(() => {
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
    return (
      <div className="text-center pt-3">
        <h5>Flow Conflicts</h5>
        The following global variables exist in both your project and the flow you are importing.
        {this.state.conflicts.map((conflict, i) => {
          return(
            <div key={i}>
              {conflict}
            </div>
          )
        })}
        If these are fine, hit confirm to add the flow to your project or cancel to not.
        <div className="row justify-content-center mt-2">
          <button className="white-btn mr-2" onClick={this.cancelAddFlow} disabled={this.state.loading}>Cancel</button>
          <button className="purple-btn ml-2" onClick={this.addFlow} disabled={this.state.loading}>Confirm</button>
        </div>
      </div>
    )
  }

  renderModalBody(){
    return (
      this.props.module && 
      <div className="text-center pt-5">
        <div className="module-modal-icon">{this.props.module && this.props.renderIcon(this.props.module)}</div>
        <div className="module-modal-author text-secondary">
          {this.props.module.name}
        </div>

        <p>{this.props.module.title}</p>
        <p className="text-secondary">{this.props.module.descr}</p>
        <div className="row justify-content-center mb-3">
          <button className="white-btn mr-2" onClick={this.previewFlow} disabled={this.state.loading}>Preview</button>
          <button className="purple-btn ml-2" onClick={this.checkFlowConflicts} disabled={this.state.loading}>Add Flow</button>
        </div>
        <p>{this.props.module.overview}</p>
      </div>
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
  project_id: state.skills.skill.project_id
})

const mapDispatchToProps = dispatch => {
  return {
    updateVersion: (key, val) => dispatch(updateVersion(key, val)),
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(withRenderModuleIcon(ModuleModal));