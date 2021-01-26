import React from 'react';

import AudioPlayer from '@/components/AudioPlayer';

import DropAudio from './components/DropAudio';

const AudioUpload = ({ audio, update, endpoint = 'audio' }) =>
  audio ? <AudioPlayer link={audio} onClose={() => update(null)} /> : <DropAudio update={update} endpoint={endpoint} withVariables />;

export default AudioUpload;
