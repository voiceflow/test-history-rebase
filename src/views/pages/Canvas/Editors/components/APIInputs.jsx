import React, { Component } from 'react';
import { InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap';
import VariableInput from './VariableInput';

class APIInputs extends Component {
    constructor(props) {
        super(props);

        this.state = {
            pairs: this.props.pairs
        };
    }

    componentWillReceiveProps(props) {
        this.setState({
            pairs: props.pairs
        });
    }

    render() {
        return (
            <React.Fragment>
                <div>
                    {Array.isArray(this.state.pairs) ? this.state.pairs.map((pair, i) => {
                        return (
                            <div key={pair.index} className="mb-2">
                                <InputGroup>
                                    <InputGroupAddon addonType="prepend">
                                        <InputGroupText>
                                            {i+1}
                                        </InputGroupText>
                                    </InputGroupAddon>
                                    <VariableInput className="form-control form-control-border no-radius" placeholder="key" updateRaw={e => this.props.onChange(e, i, 'key')} variables={this.props.variables} raw={pair.key}/>
                                    <VariableInput className="form-control form-control-border right" placeholder="value" updateRaw={e => this.props.onChange(e, i, 'val')} variables={this.props.variables} raw={pair.val}/>
                                            <button className="btn-float" onClick={e => this.props.onRemove(e, i)}>&times;</button>
                                </InputGroup>
                            </div> )
                    }) : null}
                    <button className="btn btn-lg btn-clear btn-block" onClick={this.props.onAdd}>
                        <i className="far fa-plus mr-2"></i> Add Pair
                    </button>
                </div>

            </React.Fragment>
        );
    }
}

export default APIInputs;
