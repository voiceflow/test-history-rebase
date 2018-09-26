/* eslint react/no-multi-comp: 0, react/prop-types: 0 */

import React from 'react';
import Dropzone from 'react-dropzone'
import axios from 'axios'

class WorldPreview extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      audio: this.props.audio,
      world_id: this.props.world_id
    }

    this.onDrop = this.onDrop.bind(this);
    this.onClear = this.onClear.bind(this);
  }

  onDrop(files, name) {
      if (files.length > 0) {
          let data = new FormData();
          let that = this;
          data.append(name, files[0]);
          axios.post('/audio', data)
          .then((res) => {
            console.log(res);
            axios.patch('/world/' + this.state.world_id, {preview: res.data})
            .then(res1 => {
              that.setState({
                audio: res.data
              })
            });
          });
      }
  }

  onClear(name) {
    this.setState({
        audio: null
    });
    axios.patch('/world/' + this.state.world_id);
  }

  render() {
    return (
      this.state.audio ? 
      <div className="audio-box">
          <button className="btn btn-danger" onClick={() => this.onClear('audio')}>&times;</button>
          <div>{this.state.audio.split('/').pop().split('-').pop()}</div>
          <audio key={this.state.audio.split('/').pop()} controls>
              <source src={this.state.audio} type="audio/mpeg" />
          </audio>
      </div>
      :
      <Dropzone
          className="dropzone"
          activeClassName="active"
          rejectClassName="reject"
          multiple={false}
          disableClick={false}
          accept="audio/*"
          onDrop={(accepted, rejected) => this.onDrop(accepted, 'audio')}
      >
      <div>
          <div className="prompt">
              <b>Drag and Drop Files here</b><br/>
              <small>OR</small><br/>
              <i className="fas fa-plus-circle"></i> Add Files
          </div>
          <div className="rejected-file text-danger">
              <b>File not Accepted</b> <i className="far fa-frown ml-1"></i>
          </div>
      </div>
      </Dropzone>
    );
  }
}

export default WorldPreview;