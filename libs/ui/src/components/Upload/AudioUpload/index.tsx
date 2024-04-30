import React from 'react';

import AudioPlayer from '@/components/AudioPlayer';

import type { InputRenderer } from '../Primitive/LinkUpload';
import { prettifyBucketURL } from '../utils';
import DropAudio from './DropAudio';

export interface AudioUploadProps {
  audio?: string | null;
  update: (url: string | null) => void;
  className?: string;
  renderInput: InputRenderer;
}

const AudioUpload: React.FC<AudioUploadProps> = ({ audio, update, className, renderInput }) =>
  audio ? (
    <AudioPlayer title={prettifyBucketURL(audio)} link={audio} onClose={() => update(null)} />
  ) : (
    <DropAudio update={update} renderInput={renderInput} className={className} />
  );

export default AudioUpload;
