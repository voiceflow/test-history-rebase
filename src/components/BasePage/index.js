import React from 'react';
import PropTypes from 'prop-types';

import Header from 'containers/Header';

import Loader from '../Loader';
import MainContainer from '../MainContainer';

export default function BasePage(props) {
  const {
    pending,
    pageName,
    children,
    loadingText,
    centerRenderer,
    searchRenderer,
    ...mainPageProps
  } = props;

  return (
    <Loader text={loadingText} pending={pending}>
      {() => (
        <MainContainer
          headerRenderer={() => (
            <Header
              pageName={pageName}
              centerRenderer={centerRenderer}
              searchRenderer={searchRenderer}
            />
          )}
          {...mainPageProps}
        >
          {typeof children === 'function' ? children() : children}
        </MainContainer>
      )}
    </Loader>
  );
}

BasePage.propTypes = {
  pending: PropTypes.bool,
  pageName: PropTypes.string,
  loadingText: PropTypes.string,
  searchRenderer: PropTypes.func,
  centerRenderer: PropTypes.func,
};
