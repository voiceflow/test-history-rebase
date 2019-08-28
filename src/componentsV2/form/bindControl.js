import React from 'react';
import { Field } from 'redux-form';

// A Higher Order component to wrap redux form elements
// Returns a component

const WrappedComponent = (props) => {
  const { ogComponent: Component, input, meta, outerProps } = props;
  // Need to manually pick out meta details because some components will freak out if given random props
  const { error, touched, warning, name } = meta;
  return <Component {...input} {...outerProps} error={error} touched={touched} warning={warning} name={name} />;
};
const bindControl = (Component) => (props) => {
  return <Field component={WrappedComponent} ogComponent={Component} outerProps={props} {...props} />;
};

export default bindControl;
