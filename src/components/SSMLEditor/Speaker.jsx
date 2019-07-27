import axios from 'axios';
import React, { Component } from 'react';
import { Tooltip } from 'react-tippy';

import SvgIcon from '@/components/SvgIcon';

class Speaker extends Component {
  state = {
    loading: false,
    playing: false,
  };

  componentWillUnmount = () => {
    if (this.audio) {
      this.audio.pause();
      this.audio.removeAttribute('src');
      this.audio.load();
    }
  };

  speak = async () => {
    const { ssml, voice, setError } = this.props;

    if (this.state.playing) {
      this.audio.pause();
      this.setState({ playing: false });
      return;
    }

    if (!ssml.trim()) return;

    // if nothing has changed in the text ssml don't make the call but instead just replay the current audio
    if (this.currentSSML === voice + ssml && this.audio) {
      try {
        this.audio.currentTime = 0;
        this.audio.play();
        this.setState({ playing: true, loading: false });
        return;
      } catch (err) {
        console.error(err);
      }
    }

    this.setState({ loading: true });

    try {
      const res = await axios.post('/test/speak', { ssml, voice: voice === 'Alexa' ? '_DEFAULT' : voice });
      this.setState({ playing: true });

      this.currentSSML = voice + ssml;
      this.audio = new Audio(res.data);
      this.audio.play();

      this.audio.onended = () => this.setState({ playing: false });
    } catch (err) {
      setError('Unable to play SSML');
    }

    this.setState({ loading: false });
  };

  render() {
    const { loading, playing } = this.state;
    let icon = 'sound';
    if (loading) {
      icon = 'loader';
    } else if (playing) {
      icon = 'stop';
    }
    return (
      <div style={{ cursor: 'pointer' }} className={loading ? 'spin' : ''}>
        <Tooltip title="Play" position="top">
          <SvgIcon onClick={this.speak} icon={icon} />
        </Tooltip>
      </div>
    );
  }
}

export default React.memo(Speaker);
