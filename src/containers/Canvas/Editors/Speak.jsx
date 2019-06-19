import Button from 'components/Button';
import _ from 'lodash';
import randomstring from 'randomstring';
import React, { Component } from 'react';
import { Input, InputGroup } from 'reactstrap';

import SpeakElement from './components/SpeakElement';

const BLOCK_LIMIT = 50;

export class Speak extends Component {
  constructor(props) {
    super(props);

    // DEPRECATE SWITCH PEOPLE OFF THE OLD VERSION OF SPEAK
    if (props.node.extras.rawContent) {
      props.node.extras.dialogs = [
        {
          index: randomstring.generate(5),
          voice: 'Alexa',
          rawContent: props.node.extras.rawContent,
          open: true,
        },
      ];
      delete props.node.extras.rawContent;
    } else if (!Array.isArray(props.node.extras.dialogs)) {
      props.node.extras.dialogs = [
        {
          index: randomstring.generate(5),
          voice: 'Alexa',
          rawContent: '',
          open: true,
        },
      ];
    }

    this.handleAddBlock = this.handleAddBlock.bind(this);
    this.handleRemoveBlock = this.handleRemoveBlock.bind(this);
    this.onUpdate = this.onUpdate.bind(this);

    this.state = {
      node: this.props.node,
    };
  }

  onUpdate() {
    this.forceUpdate();
    this.props.onUpdate();
  }

  handleAddBlock(audio = false) {
    const node = this.state.node;
    this.props.clearRedo();
    this.props.updateEvents(_.cloneDeep(node).extras);
    if (node.extras.dialogs.length < BLOCK_LIMIT) {
      if (audio) {
        node.extras.dialogs.push({
          index: randomstring.generate(5),
          audio: '',
          open: true,
        });
      } else {
        node.extras.dialogs.push({
          index: randomstring.generate(5),
          voice: 'Alexa',
          rawContent: '',
          open: true,
        });
      }
      this.onUpdate();
    }
  }

  handleRemoveBlock(i) {
    const node = this.state.node;
    this.props.clearRedo();
    this.props.updateEvents(_.cloneDeep(node).extras);
    node.extras.dialogs.splice(i, 1);
    this.onUpdate();
  }

  reorder = (dragIndex, hoverIndex) => {
    const drag = this.state.node.extras.dialogs[dragIndex];
    const node = this.state.node;
    node.extras.dialogs.splice(dragIndex, 1);
    node.extras.dialogs.splice(hoverIndex, 0, drag);
    this.onUpdate();
  };

  render() {
    const properties = this.state.node.extras;

    return (
      <div>
        {properties.dialogs.map((d, i) => (
          <SpeakElement
            d={d}
            toggleOpen={() => {
              d.open = !d.open;
              this.onUpdate();
            }}
            key={d.index}
            index={i}
            id={d.index}
            reorder={this.reorder}
            properties={properties}
            variables={this.props.variables}
            onUpdate={this.onUpdate}
            handleRemoveBlock={this.handleRemoveBlock}
          />
        ))}
        {properties.dialogs.length < BLOCK_LIMIT ? (
          <React.Fragment>
            <div className="d-flex mt-4">
              <Button isBtn isSecondary className="mr-3" onClick={() => this.handleAddBlock(false)}>
                <img src="/comment.svg" alt="comment" className="mr-3 mb-1" width="17px" />
                Add Speech
              </Button>
              <Button isBtn isSecondary onClick={() => this.handleAddBlock(true)}>
                <img src="/volume.svg" alt="volume" className="mr-3 mb-1" width="16px" />
                Add Audio
              </Button>
            </div>
            <InputGroup className="my-3">
              <label className="input-group-text w-100 text-left">
                <Input
                  addon
                  type="checkbox"
                  checked={!!properties.randomize}
                  onChange={() => {
                    properties.randomize = !properties.randomize;
                    this.forceUpdate();
                  }}
                />
                <span className="ml-2">Output Random Entry</span>
              </label>
            </InputGroup>
          </React.Fragment>
        ) : null}
      </div>
    );
  }
}

export default Speak;
