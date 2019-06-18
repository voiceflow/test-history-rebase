import AudioDrop from 'components/Uploads/AudioDrop';
import Image from 'components/Uploads/Image';
import _ from 'lodash';
import React, { Component } from 'react';
import Toggle from 'react-toggle';

import VariableInput from './components/VariableInput';

class Stream extends Component {
  constructor(props) {
    super(props);

    this.state = {
      node: props.node,
    };

    this.togglePause = this.togglePause.bind(this);
    this.toggleLoop = this.toggleLoop.bind(this);
  }

  static getDerivedStateFromProps(props) {
    return {
      node: props.node,
    };
  }

  onUpdate() {
    this.forceUpdate();
    this.props.onUpdate();
  }

  toggleLoop() {
    const node = this.state.node;
    node.extras.loop = !node.extras.loop;
    this.onUpdate();
  }

  togglePause() {
    let node = this.state.node;
    const ports = node.getPorts();

    if (this.state.node.extras.custom_pause) {
      const idsEqual = (npc) => npc.id === node.id;

      // eslint-disable-next-line no-restricted-syntax, guard-for-in
      for (const name in ports) {
        const port = node.getPort(name);
        // eslint-disable-next-line no-continue
        if (port.in) continue;

        if (port.label === 'pause') {
          node.removePort(port);
          if (node.parentCombine) {
            const bestNode = _.findIndex(node.parentCombine.combines, idsEqual);
            node.parentCombine.combines[bestNode] = node;
          }
        }
      }
    } else {
      this.state.node.addOutPort('pause').setMaximumLinks(1);
      node = this.state.node;
      if (node.parentCombine) {
        const bestNode = _.findIndex(node.parentCombine.combines, ['id', node.id]);
        node.parentCombine.combines[bestNode] = node;
      }
    }
    node.extras.custom_pause = !node.extras.custom_pause;
    this.setState(
      {
        node,
      },
      this.props.onUpdate
    );
    // this.props.diagramEngine.setSuperSelect(node.parentCombine);
    this.props.repaint();
    this.forceUpdate();
  }

  updateContent = (name, content) => {
    const node = this.state.node;
    node.extras[name] = content;
    this.setState({
      node,
    });
  };

  render() {
    const isAlexa = this.props.platform === 'alexa';
    return (
      <div>
        <label>Stream File (AAC/MP4, MP3, HLS)</label>
        <AudioDrop
          audio={this.state.node.extras.audio}
          update={(audio) => {
            const node = this.state.node;
            node.extras.audio = audio;
            this.onUpdate();
          }}
          stream
        />
        <label>Title</label>
        <VariableInput
          className="form-control"
          raw={this.state.node.extras.title}
          placeholder="Insert audio stream title"
          variables={this.props.variables}
          updateRaw={(raw) => this.updateContent('title', raw)}
        />

        <label>Description</label>
        <VariableInput
          className="form-control"
          raw={this.state.node.extras.description}
          placeholder="Insert audio stream description"
          variables={this.props.variables}
          updateRaw={(raw) => this.updateContent('description', raw)}
        />

        <label>Icon</label>
        <Image
          url
          max_size={5 * 1024 * 1024}
          image={this.state.node.extras.icon_img}
          update={(url) => this.updateContent('icon_img', url)}
          // className='image-upload-icon'
        />

        <label>Background Image</label>
        <Image
          url
          max_size={5 * 4096 * 4096}
          image={this.state.node.extras.background_img}
          update={(url) => this.updateContent('background_img', url)}
          // className='image-upload-icon'
          margin
        />
        {isAlexa && (
          <div className="space-between mt-3">
            <label>Custom Pause</label>
            <Toggle icons={false} checked={!!this.state.node.extras.custom_pause} onChange={this.togglePause} className="fulfill-switch" />
          </div>
        )}
        {isAlexa && (
          <div className="space-between">
            <label>Loop Audio</label>
            <Toggle icons={false} checked={!!this.state.node.extras.loop} onChange={this.toggleLoop} className="fulfill-switch" />
          </div>
        )}
      </div>
    );
  }
}

export default Stream;
