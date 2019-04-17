import React, { Component } from 'react';
import { InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap';
import Select from 'react-select';
import { selectStyles, variableComponent } from 'views/components/VariableSelect'
import { connect } from 'react-redux'
import { openTab } from 'actions/userActions'

class VariableMap extends Component {
    constructor(props) {
        super(props);

        this.state = {
            pairs: this.props.pairs,
            unused_array: []
        }
    }

    componentWillReceiveProps(props) {
        let unused_array = []
        if(props.variables && props.pairs){
            unused_array = props.variables.filter(function(x) { return props.pairs.indexOf(x) < 0 });
        }

        this.setState({
            pairs: props.pairs,
            unused_array: unused_array
        });
    }


    render() {
        return (
            <React.Fragment>
                <div>
                    {Array.isArray(this.state.pairs) ? this.state.pairs.map((pair, i) => {
                        return (
                            <div key={i} className="mb-2">
                                <InputGroup>
                                    <InputGroupAddon addonType="prepend">
                                        <InputGroupText>
                                            {i+1}
                                        </InputGroupText>
                                    </InputGroupAddon>

                                    <Select
                                        styles={selectStyles}
                                        components={{ Option: variableComponent }}
                                        classNamePrefix="variable-box"
                                        placeholder="Variable"
                                        className="variable-box"
                                        value={this.state.pairs[i] ? {value: this.state.pairs[i], label: this.state.pairs[i]} : null}
                                        onChange={e => this.props.onChange(e.value, i, this.props.type)}
                                        options={Array.isArray(this.state.unused_array) ? this.state.unused_array.map(variable => {
                                                return {label: variable, value: variable, openVar: this.props.openVarTab }
                                            
                                        }) : null}
                                    />

                                    <InputGroupAddon addonType="append">
                                        <InputGroupText>
                                            <button className="close" onClick={e => this.props.onRemove(e, i, this.props.type)}></button>
                                        </InputGroupText>
                                    </InputGroupAddon>
                                </InputGroup>
                            </div> )
                    }) : null}
                    <button className="btn btn-default btn-block" onClick={e => this.props.onAdd(this.props.type)}>
                        <i className="far fa-plus"></i> Add Variable
                    </button>
                </div>

            </React.Fragment>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        openVarTab: (tab) => dispatch(openTab(tab))
    }
}

export default connect(null, mapDispatchToProps)(VariableMap);
