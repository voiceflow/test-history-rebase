import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import Panel from '../../../Panel';

export default function Section({ label, children, sections }) {
  return (
    <Fragment>
      <div className="skill-products-view__title">{label}</div>
      <div className="skill-products-view-content">
        <Panel sections={sections}>{children}</Panel>
      </div>
    </Fragment>
  );
}

Section.propTypes = {
  label: PropTypes.string.isRequired,
  sections: PropTypes.arrayOf(PropTypes.object),
  children: PropTypes.node,
};
