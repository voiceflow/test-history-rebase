import React, { Component } from 'react';
import { InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap';

import Button from '@/components/Button';

import VariableInput from './VariableInput';

class APIInputs extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pairs: this.props.pairs,
    };
  }

  // eslint-disable-next-line react/no-deprecated
  componentWillReceiveProps(props) {
    this.setState({
      pairs: props.pairs,
    });
  }

  render() {
    return (
      <>
        <div>
          {Array.isArray(this.state.pairs)
            ? this.state.pairs.map((pair, i) => {
                return (
                  <div key={pair.index} className="mb-2">
                    <InputGroup>
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>{i + 1}</InputGroupText>
                      </InputGroupAddon>
                      <VariableInput
                        className="form-control form-control-border no-radius"
                        placeholder="key"
                        updateRaw={(e) => this.props.onChange(e, i, 'key')}
                        variables={this.props.variables}
                        raw={pair.key}
                      />
                      <VariableInput
                        className="form-control form-control-border right"
                        placeholder="value"
                        updateRaw={(e) => this.props.onChange(e, i, 'val')}
                        variables={this.props.variables}
                        raw={pair.val}
                      />
                      <Button isFloat onClick={(e) => this.props.onRemove(e, i)}>
                        &times;
                      </Button>
                    </InputGroup>
                  </div>
                );
              })
            : null}
          <Button isBtn isLarge isClear isBlock onClick={this.props.onAdd}>
            <i className="far fa-plus mr-2" /> Add Pair
          </Button>
        </div>
      </>
    );
  }
}

export default APIInputs;
