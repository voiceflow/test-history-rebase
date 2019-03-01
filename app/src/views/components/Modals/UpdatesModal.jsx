/* eslint react/no-multi-comp: 0, react/prop-types: 0 */

import React from 'react'
import { Button, Modal, ModalBody, ModalHeader } from 'reactstrap'

const class_mapping = {
  FEATURE: {
    class: 'update-modal-feature',
    label: 'New Feature'
  },
  UPDATE: {
    class: 'update-modal-update',
    label: 'Update'
  },
  CHANGE: {
    class: 'update-modal-change',
    label: 'Change'
  }
}

class UpdatesModal extends React.Component {
  constructor(props){
    super(props)

    this.state = {
      // HARDCODE UPDATES HERE :)
      updates: [
        {
          type: 'FEATURE',
          descr: 'This feature is really good, it makes you fly faster and lift heavier'
        },
        {
          type: 'UPDATE',
          descr: 'This update makes that thing really fahfeoijaoifj ejaofjeaojfoe jfaejoi fjeaiojfoeiajfoiea joifjeai joeiajio ejao'
        },
        {
          type: 'CHANGE',
          descr: 'ajfoidajfoiejaiojfoieaj jeoaj ioejfwaoijeioaj ioejawoi jefoaij oieajiofe jaoif jeaoijf oieajoife jaoifjeoiajfioeajoi'
        },
        {
          type: 'CHANGE',
          descr: 'ajfoidajfoiejaiojfoieaj jeoaj ioejfwaoijeioaj ioejawoi jefoaij oieajiofe jaoif jeaoijf oieajoife jaoifjeoiajfioeajoi'
        },
        {
          type: 'CHANGE',
          descr: 'ajfoidajfoiejaiojfoieaj jeoaj ioejfwaoijeioaj ioejawoi jefoaij oieajiofe jaoif jeaoijf oieajoife jaoifjeoiajfioeajoi'
        },
        {
          type: 'CHANGE',
          descr: 'ajfoidajfoiejaiojfoieaj jeoaj ioejfwaoijeioaj ioejawoi jefoaij oieajiofe jaoif jeaoijf oieajoife jaoifjeoiajfioeajoi'
        }
      ]
    }
  }

  render() {
    return (
      <Modal isOpen={this.props.show_update_modal} toggle={this.props.toggle} centered size="sm">
        <div className="pt-3 mb-0 text-center">
          <p className="mb-0" id="update-modal-header-title">Since you've been gone ✨</p>
        </div>
        <ModalBody className="text-center">
          <hr className="mt-0"/>
          <div className="update-modal-body">
            {this.state.updates.map((entry, i) => {
              return <div align="left" key={i}>
                  <p className={class_mapping[entry.type].class}>&bull; {class_mapping[entry.type].label}: </p>
                  <p className="update-modal-txt">{entry.descr}</p>
                <hr/> 
              </div>
            })}
          </div>
          <div>
            <button className="btn btn-clear" onClick={this.props.toggle}>Got it!</button>
          </div>
        </ModalBody>
      </Modal>
    )
  }
}

export default UpdatesModal