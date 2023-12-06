import React from 'react';

import Page from '@/components/Page';
import * as Router from '@/ducks/router';
import { useDispatch } from '@/hooks';

const BackHeader: React.FC = () => {
  const goToCurrentCanvas = useDispatch(Router.goToCurrentCanvas);

  return <Page.Header renderLogoButton={() => <Page.Header.BackButton onClick={() => goToCurrentCanvas()} />}></Page.Header>;
};

export default BackHeader;
