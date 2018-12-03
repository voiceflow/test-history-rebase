import React, { Component } from 'react';
import YouTube from 'react-youtube';

class Story extends Component {
    render() {
        const opts = {
          width: '100%',
          playerVars: { // https://developers.google.com/youtube/player_parameters
            autoplay: false
          }
        }
        return (
            <div>
              <p className="modal-bg-txt text-center mt-5">
                 Let's get started! <span role="img" aria-label="happy">😊</span>
              </p>
              <p className="modal-txt-no-pad text-center mb-3"> Watch this 5 minute introduction video by Voiceflow's CEO to familiarize yourself with our creator tool!</p>
              <YouTube
                videoId="WQnBhEVTTCA"
                opts={opts}
                onReady={this._onReady}
              />
            </div>
        );
    }
}

export default Story;
