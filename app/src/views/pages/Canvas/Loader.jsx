import React, { Component } from 'react';
import { Button, Modal, ModalBody, ModalFooter } from 'reactstrap';
import { ModalHeader } from 'views/components/Modals/ModalHeader'

class Loader extends Component {
    render() {
        return (
            <Modal isOpen={this.props.modal} toggle={this.props.toggle} centered>
                <ModalHeader toggle={this.props.toggle} header='Projects' />
                <ModalBody>
                    {Array.isArray(this.props.diagrams) ? this.props.diagrams.map(diagram => {
                        return <div key={diagram.id}><button onClick={() => this.props.onLoadId(diagram.id)}>{diagram.title ? diagram.title : diagram.id}</button></div>;
                    }) : null }
                </ModalBody>
            </Modal>
        );
    }
}

export default Loader;
