import React from 'react';
import cn from 'classnames'
import { Collapse } from 'reactstrap'

import { useToggle } from 'hooks/toggle'

import { Input } from 'reactstrap'

const ConditionExpression = props => {
    const {
        variable,
        onSelection,
    } = props

    const [show, toggleShow] = useToggle(true)

    return (
        <div className="mb-2 px-3">
            <div className="break" />
            <div className="condition-label" onClick={() => toggleShow()}>
                <div className="text-left w-100">{`${variable}`}</div>
                <i className={cn("fas","light-grey", "d-flex", "align-items-center", {
                    "fa-chevron-up": show,
                    "fa-chevron-down": !show
                })} />
            </div>
            <Collapse isOpen={show}>
                <div className="variable-group">
                    <span>Set</span>
                    <span className="action-visible light-blue">{`{${variable}}`}</span>
                    <span>to:</span>
                </div>
                <Input type="text" onChange={e => onSelection(variable, e.target.value)} />
            </Collapse>
        </div>
    );
}
export default ConditionExpression