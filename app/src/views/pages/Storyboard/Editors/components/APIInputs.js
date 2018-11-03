import React, { Component } from 'react';
import Textarea from 'react-textarea-autosize';
import { InputGroup, Input, InputGroupAddon, InputGroupText } from 'reactstrap';

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
        console.log("fuck", this.state.pairs)
        return (
            <React.Fragment>
                <div>
                    {Array.isArray(this.state.pairs) ? this.state.pairs.map((choice, i) => {
                        return (
                            <div key={i} className="mb-2">
                                <InputGroup>
                                    <InputGroupAddon addonType="prepend">
                                        <InputGroupText>
                                            {i+1}
                                        </InputGroupText>
                                    </InputGroupAddon>
                                    <Input placeholder="key" />
                                    <Input placeholder="value" />
                                    <InputGroupAddon addonType="append">
                                        <InputGroupText>
                                            <button className="close" onClick={e => this.props.onRemove(e, i)}>&times;</button>
                                        </InputGroupText>
                                    </InputGroupAddon>
                                </InputGroup>
                            </div> )
                    }) : null}
                    <button className="btn btn-default btn-block" onClick={this.props.onAdd}>
                        <i className="far fa-plus"></i> Add Pair
                    </button>
                </div>

            </React.Fragment>
        );
    }
}

export default APIInputs;
