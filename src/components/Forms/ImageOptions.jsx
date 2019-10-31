import React from 'react';

import Button from '@/components/Button';
import { ButtonCard } from '@/containers/Onboarding/container';

export default (props) => {
  const option_map = props.options.map((o) => o.type);

  return (
    <>
      <p className="text-muted text-center mb-3 mt-4">{props.question}</p>
      <div className="row justify-content-center mb-4">
        {props.options.map((o) => (
          <ButtonCard className="selector-card col-s ml-2 mr-2" key={o.type} onClick={() => props.update(o.type)}>
            <img className="image-selector" alt="intermediate" src={props.state === o.type ? o.selected : o.unselected} />
            <p className={props.state === o.type ? '' : 'text-muted'}>{o.text}</p>
          </ButtonCard>
        ))}
      </div>
      <div className="justify-content-center">
        <Button isPrimary disabled={!option_map.includes(props.state)} onClick={props.next}>
          {props.button || 'Continue'}
        </Button>
      </div>
    </>
  );
};
