import React from 'react';
import cn from 'classnames';

import { Input } from 'reactstrap'

const ConditionExpression = props => {
    const {
        variable,
        onSelection,
    } = props

    return (
        <div className="mb-2 px-3">
            <div className="break" />
            <div className="variable-group">
                <span>Set</span>
                <span className="action-visible light-blue">{`{${variable}}`}</span>
                <span>to:</span>
            </div>
            <Input type="text" placeholder={`{${variable}}`} onChange={e => onSelection(variable, e.target.value)} />
        </div>
    );
}
export default ConditionExpression