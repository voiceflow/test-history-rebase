import React, { Component } from 'react';
import Select from 'react-select';

class APIInputs extends Component {
    render() {
        return (
            <React.Fragment>
                <div>
                    {this.props.pairs}
                </div>
                <button className="btn btn-default btn-block" onClick={this.props.onAdd}>
                    <i className="far fa-plus"></i> Add Pair
                </button>

            </React.Fragment>
        );
    }
}

export default APIInputs;
