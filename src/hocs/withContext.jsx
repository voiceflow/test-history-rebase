import React from 'react';

// eslint-disable-next-line import/prefer-default-export
export const withContext = (Context, key) => (Component) => {
  const WrappedComponent = (props) => {
    const value = React.useContext(Context);

    return <Component {...props} {...{ [key]: value }} />;
  };
  WrappedComponent.displayName = `withContext(${Component.displayName || Component.name})`;

  return WrappedComponent;
};
