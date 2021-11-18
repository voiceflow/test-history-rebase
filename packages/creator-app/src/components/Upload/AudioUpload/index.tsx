import React from 'react';

import AudioPlayer from '@/components/AudioPlayer';

import DropAudio from './components/DropAudio';

interface AudioUploadProps {
  audio?: string | null;
  update: (url: string | null) => void;
  endpoint?: string;
}

const AudioUpload: React.FC<AudioUploadProps> = ({ audio, update, endpoint = 'audio' }) =>
  audio ? <AudioPlayer link={audio} onClose={() => update(null)} /> : <DropAudio update={update} endpoint={endpoint} withVariables />;

export default AudioUpload;
