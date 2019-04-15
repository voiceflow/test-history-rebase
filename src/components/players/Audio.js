import React, { PureComponent } from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import ReactSlider from 'react-slider';
import { Player, ControlBar } from 'video-react';

import { getFileNameFromURL } from 'utils/urls';

import Button from '../Button';

export default class Audio extends PureComponent {
  static propTypes = {
    src: PropTypes.string.isRequired,
    title: PropTypes.string,
    onError: PropTypes.func,
    onLoadedMetadata: PropTypes.func,
  };

  state = {
    error: false,
    paused: true,
    duration: 0,
    currentTime: 0,
  };

  resizeTimeout = null;

  componentDidMount() {
    this.player.subscribeToStateChange(this.onStateChanged);
  }

  componentDidUpdate() {
    if (this.slider) {
      this.slider._resize();
    }
  }

  componentWillUnmount() {
    clearTimeout(this.resizeTimeout);
  }

  onRef = node => {
    this.player = node;
  };

  onSliderRef = node => {
    this.slider = node;
  };

  onStateChanged = ({ ended, paused, duration, currentTime }) => {
    this.setState({
      paused: ended ? true : paused,
      duration,
      currentTime,
    });
  };

  onPlayClick = e => {
    const { error, paused } = this.state;

    e.stopPropagation();

    if (error) {
      return;
    }

    if (paused) {
      this.player.video.play();
    } else {
      this.player.video.pause();
    }

    this.setState({ paused: !paused }, () => {
      this.resizeTimeout = this.slider && setTimeout(this.slider._handleResize, 350);
    });
  };

  onError = () => {
    const { onError } = this.props;

    this.setState({ error: true });

    if (onError) {
      onError();
    }
  };

  onLoadedMetadata = () => {
    const { onLoadedMetadata } = this.props;

    const { duration } = this.player.video.video;

    this.setState({ duration });

    if (onLoadedMetadata) {
      onLoadedMetadata({ duration });
    }
  };

  onChangeCurrentTime = currentTime => {
    this.player.video.seek(currentTime);
  };

  render() {
    const { error, paused, duration, currentTime } = this.state;
    const { src, title } = this.props;

    return (
      <div
        className={cn('audio-player', {
          __loaded: duration,
          '__is-paused': duration && paused,
        })}
      >
        <div className="h-h-0 h-ov-h">
          <Player
            ref={this.onRef}
            src={src}
            fluid
            preload="metadata"
            onError={this.onError}
            onLoadedMetadata={this.onLoadedMetadata}
          >
            <ControlBar />
          </Player>
        </div>

        <div className="audio-player__action">
          <Button icon={paused ? 'play-system' : 'pause'} isIcon onClick={this.onPlayClick} />
        </div>

        <div className="audio-player-details">
          <div className="audio-player-details__name">{title || getFileNameFromURL(src)}</div>

          <div
            onClick={elm => elm.stopPropagation()}
            className={cn('audio-player-details__duration', { '__unable-to-play': error })}
          >
            {!!duration && (
              <ReactSlider
                min={0}
                ref={this.onSliderRef}
                max={Math.floor(duration)}
                value={Math.floor(currentTime)}
                withBars
                onChange={this.onChangeCurrentTime}
                className="audio-player-details__slider"
              >
                <div className="audio-player-details__slider-handler" />
              </ReactSlider>
            )}

            <span>
              {error
                ? 'Unable to play in browser'
                : format((duration - currentTime) * 1000, duration > 3600 ? 'hh:mm:ss' : 'mm:ss')}
            </span>
          </div>
        </div>
      </div>
    );
  }
}
