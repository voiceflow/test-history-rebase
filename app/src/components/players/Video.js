import React, { PureComponent } from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';
import { Player } from 'video-react';

import 'video-react/dist/video-react.css';

import Button from '../Button';

import HLSSource from './HLSSource';

export default class Video extends PureComponent {
  static propTypes = {
    src: PropTypes.string.isRequired,
    onError: PropTypes.func,
    onLoadedMetadata: PropTypes.func,
  };

  state = {
    hls: false,
    error: false,
    paused: true,
  };

  loadMetadataErrorTimeout = null;

  componentDidMount() {
    this.player.subscribeToStateChange(this.onStateChanged);
  }

  componentWillUnmount() {
    clearTimeout(this.loadMetadataErrorTimeout);
  }

  onRef = node => {
    this.player = node;
  };

  onStateChanged = ({ paused }) => {
    this.setState({ paused });
  };

  onPlayClick = e => {
    e.stopPropagation();

    this.player.play();
  };

  onError = () => {
    const { hls } = this.state;
    const { onError } = this.props;

    if (!hls) {
      this.loadMetadataErrorTimeout = setTimeout(this.onError, 2000);
      this.setState({ hls: true });
    } else if (onError) {
      this.setState({ error: true });
      onError(this.player.error);
    }
  };

  onLoadedMetadata = () => {
    const { onLoadedMetadata } = this.props;

    clearTimeout(this.loadMetadataErrorTimeout);

    if (onLoadedMetadata) {
      onLoadedMetadata({
        width: this.player.video.video.videoWidth,
        height: this.player.video.video.videoHeight,
        duration: this.player.duration,
      });
    }
  };

  render() {
    const { src } = this.props;
    const { hls, error, paused } = this.state;

    return (
      <div
        onClick={e => e.stopPropagation()}
        className={cn('video-player', { '__is-paused': paused })}
      >
        {paused && (
          <div className="video-player__action">
            <Button icon="play-system" isIcon onClick={this.onPlayClick} disabled={error} />
          </div>
        )}

        <div className="video-player-container">
          {!error && (
            <Player
              ref={this.onRef}
              src={src}
              fluid
              preload="metadata"
              onError={this.onError}
              onLoadedMetadata={this.onLoadedMetadata}
            >
              {hls && <HLSSource src={src} isVideoChild />}
            </Player>
          )}
        </div>
      </div>
    );
  }
}
