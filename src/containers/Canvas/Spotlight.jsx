import React, { Component } from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';

import { getBlocks } from './Blocks';

export class Spotlight extends Component {
  constructor(props) {
    super(props);

    this.state = {
      blocks: getBlocks(),
    };
  }

  render() {
    return (
      <div id="spotlight">
        <Select
          onBlur={this.props.cancel}
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
          classNamePrefix="spotlight"
          onChange={(selected) => this.props.addBlock(selected.value)}
          options={this.state.blocks.map((block) => ({
            label: block.text,
            value: block.type,
          }))}
          maxMenuHeight={124}
          value={null}
          placeholder="Add Block"
          filterOption={(value, input) => {
            return value.label.toLowerCase().startsWith(input.toLowerCase().trim());
          }}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.account,
});

export default connect(mapStateToProps)(Spotlight);
