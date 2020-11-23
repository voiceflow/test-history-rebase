import React from 'react';

import AlertMessage, { AlertMessageVariant } from '@/components/AlertMessage';
import { FlexCenter } from '@/components/Flex';
import SvgIcon from '@/components/SvgIcon';
import { Nullable } from '@/types';

import StageContainer from './StageContainer';

export type ErrorStageProps = {
  title: string;
  footer?: Nullable<React.ReactNode>;
};

const ErrorStage: React.FC<ErrorStageProps> = ({ title, children, footer }) => (
  <StageContainer>
    <FlexCenter>
      <SvgIcon icon="error" color="#d94c4c" mr={8} size={16} />
      {title}
    </FlexCenter>

    <AlertMessage variant={AlertMessageVariant.DANGER} width="100%" mt={8} mb={footer ? 8 : 0}>
      {children}
    </AlertMessage>

    {footer && (
      <AlertMessage width="100%" mb={0}>
        {footer}
      </AlertMessage>
    )}
  </StageContainer>
);

export default ErrorStage;
