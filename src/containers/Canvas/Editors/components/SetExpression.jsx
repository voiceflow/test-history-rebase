import React, { Component } from 'react';
import cn from 'classnames'
import Select from 'react-select';
import { connect } from "react-redux";
import { Input } from 'reactstrap'
import Expression from './Expression';
import Expressionfy from './Expressionfy';
import { openTab } from 'ducks/user'
import { selectStyles, variableComponent } from 'components/VariableSelect/VariableSelect'
import { isConditional } from '@babel/types';

class SetExpression extends Component {
    render() {
        let block = this.props.block ;
        const variable = this.props.variable
        let show = (block && !(block.expression.type === 'value' || block.expression.type === 'variable' || block.expression.type === 'advance'));

        return (
            <div className={cn("set-block", {
                'solid-border': !this.props.isCondition,
                'p-3': this.props.isCondition,
            })}>
                <div className="close" onClick={this.props.onRemove}></div>
                <div className="variable-group">
                    <span>Set</span>
                    <Select
                        classNamePrefix="variable-box"
                        placeholder="Variable Name"
                        className="variable-box"
                        styles={selectStyles}
                        components={{ Option: variableComponent }}
                        value={variable ? {label: '{' + variable + '}', value: variable} : null}
                        onChange={this.props.onSelection}
                        options={Array.isArray(this.props.variables) ? this.props.variables.map((variable, idx) => {
                            if (idx === this.props.variables.length - 1) {
                                return { label: variable, value: variable, openVar: this.props.openVarTab }
                            }
                            return { label: '{' + variable + '}', value: variable }
                        }) : null}
                    />
                    <span>to:</span>
                </div>
                { show ? <Expressionfy expression={block.expression} />:null}
                {block && <Expression expression={block.expression} variables={this.props.variables} onUpdate={this.props.onUpdate}/> }
                {!block && <Input type="text" onChange={(e) => this.props.onSelection(variable, e.target.value)} />}
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        openVarTab: (tab) => dispatch(openTab(tab)),
    }
}

export default connect(null, mapDispatchToProps)(SetExpression);
