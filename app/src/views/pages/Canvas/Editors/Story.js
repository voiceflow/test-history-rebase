import React, { Component } from 'react';
import YouTube from 'react-youtube';

class Story extends Component {
    render() {
        const opts = {
      height: '187px',
      width: '100%',
      playerVars: { // https://developers.google.com/youtube/player_parameters
        autoplay: 0
      }
            
        };
        return (
            <div>
            <p className="modal-bg-txt text-center mt-5 mb-2">
                   Let's get started! 😊
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
