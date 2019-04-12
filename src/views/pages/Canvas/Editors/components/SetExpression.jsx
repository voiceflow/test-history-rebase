import React, { Component } from 'react';
import Select from 'react-select';
import { connect } from "react-redux";
import Expression from './Expression';
import Expressionfy from './Expressionfy';
import { openTab } from 'actions/userActions'
import { selectStyles, variableComponent } from 'views/components/VariableSelect'

class SetExpression extends Component {
    render() {
        let block = this.props.block;
        let show = !(block.expression.type === 'value' || block.expression.type === 'variable');

        return (
            <div className="solid-border set-block">
                <div className="close" onClick={this.props.onRemove}></div>
                <div className="variable-group">
                    <span>Set</span>
                    <Select
                        classNamePrefix="variable-box"
                        placeholder="Variable Name"
                        className="variable-box"
                        styles={selectStyles}
                        components={{ Option: variableComponent }}
                        value={block.variable ? {label: '{' + block.variable + '}', value: block.variable} : null}
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
                <Expression expression={block.expression} variables={this.props.variables} onUpdate={this.props.onUpdate}/>
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
