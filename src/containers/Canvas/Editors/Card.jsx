import React, { Component } from 'react';
import { Tooltip } from 'react-tippy';
import { Button, ButtonGroup } from 'reactstrap';

import DefaultButton from '@/components/Button';
import Image from '@/components/Uploads/Image';

import VariableInput from './components/VariableInput';
import VariableText from './components/VariableText';

class Card extends Component {
  constructor(props) {
    super(props);

    this.state = {
      node: props.node,
      data: JSON.stringify(props.node.extras.data),
    };

    this.updateContent = this.updateContent.bind(this);
  }

  onUpdate() {
    const node = this.state.node;
    node.extras.data = JSON.parse(this.state.data);
    this.setState({
      node,
    });
  }

  updateContent(name, content) {
    const node = this.state.node;
    node.extras[name] = content;
    this.setState({
      node,
    });
  }

  render() {
    const type = this.state.node.extras.cardtype;
    return (
      <React.Fragment>
        <label className="mt-0">Card Type</label>
        <ButtonGroup className="toggle-group mb-2">
          <Button outline={type !== 'Simple'} onClick={() => this.updateContent('cardtype', 'Simple')} disabled={type === 'Simple'}>
            Simple
          </Button>
          <Button outline={type !== 'Standard'} onClick={() => this.updateContent('cardtype', 'Standard')} disabled={type === 'Standard'}>
            Standard
          </Button>
        </ButtonGroup>
        <label>Title</label>
        <VariableInput
          className="form-control"
          raw={this.state.node.extras.title}
          placeholder="Insert card title"
          variables={this.props.variables}
          updateRaw={(raw) => this.updateContent('title', raw)}
        />
        {type === 'Standard' && (
          <React.Fragment>
            <label className="space-between">
              Image <span className="section-title">OPTIONAL</span>
            </label>
            <Image url max_size={5 * 1024 * 1024} image={this.state.node.extras.large_img} update={(url) => this.updateContent('large_img', url)} />
            {this.state.node.extras.small_img !== undefined && (
              <div className="mb-2">
                <label>Small Screen Image</label>
                <Image
                  url
                  max_size={5 * 1024 * 1024}
                  image={this.state.node.extras.small_img}
                  update={(url) => this.updateContent('small_img', url)}
                  margin
                />
              </div>
            )}
            <div className="my-2 text-center">
              <DefaultButton
                isFlat
                block
                onClick={() => this.updateContent('small_img', this.state.node.extras.small_img === undefined ? null : undefined)}
              >
                {this.state.node.extras.small_img === undefined ? (
                  <Tooltip position="bottom" html={<div style={{ width: 165 }}>Small screens use the normal image by default</div>}>
                    Add Small Screen Image
                  </Tooltip>
                ) : (
                  <React.Fragment>Remove Small Image</React.Fragment>
                )}
              </DefaultButton>
            </div>
          </React.Fragment>
        )}
        <React.Fragment>
          <label>{type === 'Standard' ? 'Text' : 'Content'}</label>
          <VariableText
            className="editor"
            raw={this.state.node.extras.content}
            placeholder={<React.Fragment>Add content to your card here</React.Fragment>}
            variables={this.props.variables}
            updateRaw={(raw) => this.updateContent('content', raw)}
          />
        </React.Fragment>
      </React.Fragment>
    );
  }
}

export default Card;
