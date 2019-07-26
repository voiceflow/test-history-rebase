import axios from 'axios';
import React from 'react';
import { Tooltip } from 'react-tippy';

import SvgIcon from '@/components/SvgIcon';
import Sound from '@/svgs/sound.svg';

function Speaker(props) {
  const { ssml, voice } = props;

  const speak = async () => {
    const res = await axios.post('/test/speak', { ssml, voice: voice === 'Alexa' ? '_DEFAULT' : voice });
    new Audio(res.data).play();
  };

  return (
    <Tooltip title="Play" position="top">
      <SvgIcon style={{ cursor: 'pointer' }} onClick={speak} icon={Sound} />
    </Tooltip>
  );
}

export default React.memo(Speaker);
