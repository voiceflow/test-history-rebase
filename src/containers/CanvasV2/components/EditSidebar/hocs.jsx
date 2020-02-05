import moize from 'moize';
import React from 'react';

import * as Creator from '@/ducks/creator';
import { connect } from '@/hocs';

import { useHeaderActions } from './hooks';

// eslint-disable-next-line import/prefer-default-export
export const withHeaderActions = (headerActions) => (
  Component
  // eslint-disable-next-line react/display-name
) => (props) => {
  useHeaderActions(headerActions);

  return <Component {...props} />;
};

const mapStateToProps = {
  data: Creator.focusedNodeDataSelector,
};

export const withManagerProps = moize(connect(mapStateToProps));
