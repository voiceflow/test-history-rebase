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
          descr: 'This feature is really good, it makes you fly faster and lift ee heavier'
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
      <Modal isOpen={this.props.show_update_modal} toggle={this.props.toggle} centered>
        <div className="pt-3 mb-0 text-center">
          <p className="mb-0" id="update-modal-header-title">Since you've been gone ✨</p>
        </div>
        <ModalBody className="text-center pl-0 pr-0">
          <hr className="mt-0 w-100"/>
          <div className="update-modal-body mb-4">
            {this.state.updates.map((entry, i) => {
              return <React.Fragment>
                <div align="left" key={i} className="pr-4 pl-4">
                  <p className={class_mapping[entry.type].class}>&bull; {class_mapping[entry.type].label}: </p>
                  <p className="update-modal-txt">{entry.descr}</p>
                </div>
                <hr className="w-100"/> 
              </React.Fragment>
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