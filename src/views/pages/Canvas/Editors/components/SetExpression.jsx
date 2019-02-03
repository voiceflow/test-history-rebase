import React, { Component } from 'react';
import Select from 'react-select';
import Expression from './Expression';
import Expressionfy from './Expressionfy';

class SetExpression extends Component {
    render() {
        let block = this.props.block;
        let show = !(block.expression.type === 'value' || block.expression.type === 'variable');

        return (
            <div className="solid-border set-block">
                <div className="close" onClick={this.props.onRemove}>&times;</div>
                <div className="variable-group">
                    <span>Set</span>
                    <Select
                        classNamePrefix="variable-box"
                        placeholder="Variable Name"
                        className="variable-box"
                        value={block.variable ? {label: '{' + block.variable + '}', value: block.variable} : null}
                        onChange={this.props.onSelection}
                        options={Array.isArray(this.props.variables) ? this.props.variables.map(variable => {
                            return {label: '{' + variable + '}', value: variable}
                        }) : null}
                    />
                    <span>To:</span>
                </div>
                { show ? <Expressionfy expression={block.expression} />:null}
                <Expression expression={block.expression} variables={this.props.variables} onUpdate={this.props.onUpdate}/>
            </div>
        );
    }
}

export default SetExpression;
