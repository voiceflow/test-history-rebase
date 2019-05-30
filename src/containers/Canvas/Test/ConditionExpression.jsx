import React, { Component } from 'react';
import cn from 'classnames'
import { connect } from 'react-redux';

import { useToggle } from 'hooks/toggle'

import { Input } from 'reactstrap'

const ConditionExpression = props => {
    const {
        variable,
        onSelection,
    } = props

    const [show, toggleShow] = useToggle()

    return (
        <div className="set-block p-3">
            <div className="close" onClick={() => toggleShow()} />
            <div className="variable-group">
                <span>Set</span>
                <span className="action-visible">{`{${variable}}`}</span>
                <span>to:</span>
            </div>
            <Input type="text" onChange={e => onSelection(variable, e.target.value)} />
        </div>
    );
}
export default ConditionExpression