import React from 'react';

import { TutorialProps } from '../Tutorial';

export interface Tutorial extends TutorialProps {
  content: React.ReactNode;
}

export interface Props extends React.PropsWithChildren {
  tutorial?: Tutorial | string;
}
