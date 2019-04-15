import React from 'react';
import PropTypes from 'prop-types';

import * as icons from './icons';

export default function BigIcon({ name, width, height }) {
  return (
    <i
      className="sl-big-icon sl-react-big-icon"
      style={{ width, height, backgroundImage: `url("${icons[name]}")` }}
    />
  );
}

BigIcon.propTypes = {
  name: PropTypes.oneOf([
    'shop',
    'receipt',
    'templateShow0',
    'templateShow0Selected',
    'templateShow1',
    'templateShow1Selected',
    'templateShow2',
    'templateShow2Selected',
    'templateShow3',
    'templateShow3Selected',
    'templateShow4',
    'templateShow4Selected',
    'templateShow5',
    'templateShow5Selected',
    'templateShow6',
    'templateShow6Selected',
    'templateShow7',
    'templateShow7Selected',
    'templateShow9',
    'templateShow9Selected',
  ]).isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
};

BigIcon.defaultProps = {
  width: 64,
  height: 64,
};
