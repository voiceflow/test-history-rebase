import React from 'react';
import Select from 'react-select';

import { VOICES } from 'Constants';

function Voice(props) {
  const { voice, onChange, className } = props;
  return (
    <div className={`d-inline-block ${className}`} style={{ minWidth: '125px' }}>
      <Select
        className="speak-box"
        classNamePrefix="select-box"
        value={{ label: voice, value: voice }}
        onChange={(selected) => onChange(selected.value)}
        options={VOICES}
      />
    </div>
  );
}

export default React.memo(Voice);
