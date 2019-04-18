import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { TransitionGroup } from 'react-transition-group';

import Button from '../Button';
import Transition from '../Transition';

import Section from './components/Section';

export default function StepperFlatView({ sections, withButton, buttonProps }) {
  return (
    <div className="skill-products-view">
      <TransitionGroup component={Fragment}>
        {sections.map(({ id, ...props }, i) => (
          <Transition
            key={id}
            name="fade"
            delay={i * 20}
            component="div"
            className="skill-products-view__section"
          >
            <Section key={id} {...props} />
          </Transition>
        ))}
      </TransitionGroup>

      {withButton && (
        <div className="skill-products-view__action">
          <Button isPrimary {...buttonProps} />
        </div>
      )}
    </div>
  );
}

StepperFlatView.propTypes = {
  sections: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
    }).isRequired
  ).isRequired,
  withButton: PropTypes.bool,
  buttonProps: PropTypes.object.isRequired,
};
