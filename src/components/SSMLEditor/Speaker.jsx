import axios from 'axios';
import SvgIcon from 'components/SvgIcon';
import React from 'react';
import { Tooltip } from 'react-tippy';
import Sound from 'svgs/sound.svg';

function Speaker(props) {
  const { ssml, voice } = props;

  const speak = async () => {
    const res = await axios.post('/test/speak', { ssml, voice: voice === 'Alexa' ? '_DEFAULT' : voice });
    new Audio(res.data).play();
  };

  return (
    <Tooltip title="Play" position="top">
      <SvgIcon style={{ cursor: 'pointer', marginRight: '7px', marginTop: '7px' }} onClick={speak} icon={Sound} />
    </Tooltip>
  );
}

export default React.memo(Speaker);
