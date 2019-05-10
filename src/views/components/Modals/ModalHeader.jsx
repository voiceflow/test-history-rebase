import React from 'react'
import Button from 'components/Button'

export const ModalHeader = ({ header, toggle }) => (
    <div className="modal-header">
        <h5 className="modal-title">{header}</h5>
        <Button className="close" aria-label="Close" onClick={toggle} />
    </div>
)