import React, { Component } from 'react';
import PropTypes from 'prop-types';
import wrapDisplayName from 'recompose/wrapDisplayName';

import withPropsBridge from './withPropsBridge';

export default ({ id, ...options } = {}) => Wrapper =>
  withPropsBridge({ ...options, id: `${id}-form`, key: 'providedFormProps' })(
    class WithForm extends Component {
      static displayName = wrapDisplayName(Wrapper, 'WithForm');

      static propTypes = {
        providedFormProps: PropTypes.shape({
          isValid: PropTypes.bool,
          handleSubmit: PropTypes.func,
          isSubmitting: PropTypes.bool,
        }),
      };

      render() {
        const { providedFormProps } = this.props;

        return (
          <Wrapper
            {...this.props}
            isFormValid={providedFormProps.isValid}
            handleFormSubmit={providedFormProps.handleSubmit}
            isFormSubmitting={providedFormProps.isSubmitting}
          />
        );
      }
    }
  );
