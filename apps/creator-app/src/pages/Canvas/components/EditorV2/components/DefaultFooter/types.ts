import type React from 'react';

import type { TutorialProps } from '../Tutorial';

export interface Tutorial extends TutorialProps {
  content: React.ReactNode;
}

export interface Props extends React.PropsWithChildren {
  tutorial?: Tutorial | string;
}
