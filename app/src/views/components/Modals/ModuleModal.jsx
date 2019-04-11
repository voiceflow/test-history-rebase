/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import withRenderModuleIcon from '../../HOC/ModuleIcon'
import React from 'react'
import { Modal, ModalBody } from 'reactstrap'
import axios from 'axios'

class ModuleModal extends React.Component {
  constructor(props){
    super(props)

    this.previewFlow = this.previewFlow.bind(this)
    this.addFlow = this.addFlow.bind(this)
  }

  previewFlow(){
    alert('Preview')
  }

  addFlow(){
    axios.post(`/marketplace/user_module/${this.props.skill_id}/${this.props.module.module_id}`)
			.then(res => {
        console.log('success')
			})
			.catch(error => {
				console.log(error);
			});
  }

  render() {
    return (
      <Modal isOpen={this.props.isOpen} toggle={this.props.toggle} centered size="lg">
        <ModalBody>
          {this.props.module && 
            <div className="text-center pt-5">
              <div className="module-modal-icon">{this.props.module && this.props.renderIcon(this.props.module)}</div>
              <div className="module-modal-author text-secondary">
                {this.props.module.name}
              </div>

              <p>{this.props.module.title}</p>
              <p className="text-secondary">{this.props.module.descr}</p>
              <div className="row justify-content-center mb-3">
                <button className="white-btn mr-2" onClick={this.previewFlow}>Preview</button>
                <button className="btn-primary ml-2" onClick={this.addFlow}>Add Flow</button>
              </div>
              <p>{this.props.module.overview}</p>
            </div>
          }
        </ModalBody>
      </Modal>
    );
  }
}

export default withRenderModuleIcon(ModuleModal)
