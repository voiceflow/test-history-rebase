import axios from 'axios';
import React from 'react';
import { Button } from 'reactstrap';

function Speaker(props) {
  const { className, ssml, voice } = props;

  const speak = async () => {
    const res = await axios.post('/test/speak', { ssml, voice: voice === 'Alexa' ? '_DEFAULT' : voice });
    new Audio(res.data).play();
  };

  return (
    <div className={`d-inline-block ${className}`}>
      <Button onClick={speak}>S</Button>
    </div>
  );
}

export default React.memo(Speaker);
