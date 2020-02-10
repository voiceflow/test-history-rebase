import React from 'react';

import AudioPlayer from '@/components/AudioPlayer';

import DropAudio from './components/DropAudio';

function AudioUpload({ audio, update, endpoint = 'audio' }) {
  return audio ? <AudioPlayer link={audio} onClose={() => update(null)} /> : <DropAudio update={update} endpoint={endpoint} withVariables />;
}

export default AudioUpload;
